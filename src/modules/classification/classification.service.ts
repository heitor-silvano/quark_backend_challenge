import { Injectable, NotFoundException } from '@nestjs/common';
import { LeadsService } from '../leads/leads.service';
import { ClassificationRepository } from './classification.repository';

interface OllamaResponse {
  score: number;
  classification: 'Hot' | 'Warm' | 'Cold';
  justification: string;
  commercialPotential: 'High' | 'Medium' | 'Low';
}

@Injectable()
export class ClassificationService {
  private readonly ollamaUrl = process.env.OLLAMA_URL ?? 'http://localhost:11434';
  private readonly model = process.env.OLLAMA_MODEL ?? 'tinyllama';

  constructor(
    private readonly leadsService: LeadsService,
    private readonly classificationRepository: ClassificationRepository,
  ) { }

  async execute(leadId: string) {
    const lead = await this.leadsService.findOne(leadId);
    if (!lead) throw new NotFoundException(`Lead ${leadId} was not found`);

    const classification = await this.classificationRepository.create({
      leadId,
      status: 'PENDING',
      requestedAt: new Date(),
    });

    try {
      const prompt = this.buildPrompt(lead);
      const raw = await this.callOllama(prompt);
      const parsed = this.parseResponse(raw);

      await this.classificationRepository.update(classification.id, {
        score: parsed.score,
        classification: parsed.classification,
        justification: parsed.justification,
        commercialPotential: parsed.commercialPotential,
        modelUsed: `${this.model}`,
        status: 'SUCCESS',
        completedAt: new Date(),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      await this.classificationRepository.update(classification.id, {
        status: 'FAILED',
        completedAt: new Date(),
        errorMessage,
      });

      throw error;
    }
  }

  private buildPrompt(lead: {
    fullName: string;
    email: string;
    companyName: string;
    estimatedValue?: unknown;
    source: string;
    notes?: string | null;
  }): string {
    return `### Role
You are a sales lead classifier computer program. Analyze the lead below and return ONLY a JSON object.

### Rules
- NEVER return an array
- NEVER return explanation
- NEVER return markdown
- NEVER return something like: "Here's a JSON object..."
- ALWAYS return a JSON object only
- ALWAYS return code only

Lead data:
- Name: ${lead.fullName}
- Email: ${lead.email}
- Company: ${lead.companyName}
- Estimated Value: ${lead.estimatedValue ?? 'not informed'}
- Source: ${lead.source}
- Notes: ${lead.notes ?? 'none'}

Return exactly this JSON structure:
{
  "score": <number from 0 to 100>,
  "classification": <"Hot" | "Warm" | "Cold">,
  "justification": <short string explaining the classification>,
  "commercialPotential": <"High" | "Medium" | "Low">
}

### Score Rules:
- score 70-100 = Hot, High potential
- score 40-69 = Warm, Medium potential
- score 0-39 = Cold, Low potential`;
  }

  private async callOllama(prompt: string): Promise<string> {
    const response = await fetch(`${this.ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama returned ${response.status}`);
    }

    const data = await response.json() as { response: string };
    return data.response;
  }

  private parseResponse(raw: string): OllamaResponse {
    try {
      const clean = raw
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const parsed = JSON.parse(clean);

      if (typeof parsed.score !== 'number' || typeof parsed.justification !== 'string') {
        throw new Error("Mandatory fields are missing in Ollama's response");
      }

      const score = Math.min(100, Math.max(0, Math.round(parsed.score)));

      const classification = score >= 70 ? 'Hot' : score >= 40 ? 'Warm' : 'Cold';
      const commercialPotential = score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low';

      return {
        score,
        classification,
        justification: parsed.justification,
        commercialPotential,
      };
    } catch {
      throw new Error(`Error on Ollama parsing: ${raw}`);
    }
  }
}