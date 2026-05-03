import { Injectable, Logger } from '@nestjs/common';
import { MockApiResponse } from './dto/mock-api.dto';

@Injectable()
export class MockApiClient {
  private readonly logger = new Logger(MockApiClient.name);
  private readonly baseUrl = process.env.MOCK_API_URL ?? 'http://localhost:3001';

  async getCompanyByCnpj(cnpj: string): Promise<MockApiResponse> {
    this.logger.log(`Searching for company by CNPJ: ${cnpj}`);

    const response = await fetch(`${this.baseUrl}/company/${cnpj}`);

    if (!response.ok) {
      throw new Error(`Mock API returned ${response.status} for the CNPJ ${cnpj}`);
    }

    return response.json() as Promise<MockApiResponse>;
  }
}