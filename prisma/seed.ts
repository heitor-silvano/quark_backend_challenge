'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, lead_source, enrichment_status, classification_status } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('[SEED] Seeding database...');

  await prisma.leadClassification.deleteMany();
  await prisma.leadEnrichment.deleteMany();
  await prisma.lead.deleteMany();

  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        fullName: 'João da Silva',
        email: 'joao.silva@techcorp.com.br',
        phone: '+5511999991111',
        companyName: 'Tech Corp',
        companyCnpj: '11222333000181',
        companyWebsite: 'https://techcorp.com.br',
        estimatedValue: 150000,
        source: lead_source.WEBSITE,
        notes: 'Lead interessado em soluções SaaS',
        createdBy: 'seed',
      },
    }),
    prisma.lead.create({
      data: {
        fullName: 'Heitor Nunes',
        email: 'heitor.nunes182@example-inovadata.com',
        phone: '+5521988882222',
        companyName: 'InovaData Example',
        companyCnpj: '22333444000199',
        companyWebsite: 'https://example-inovadata.com.br',
        estimatedValue: 80000,
        source: lead_source.REFERRAL,
        notes: 'Indicação de cliente existente',
        createdBy: 'seed',
      },
    }),
    prisma.lead.create({
      data: {
        fullName: 'Wallace Almeida',
        email: 'w.almeida@digitalgroup-example.com.br',
        phone: '+5531977773333',
        companyName: 'Digital Group Example',
        companyCnpj: '33444555000150',
        companyWebsite: 'https://digitalgroup-example.com.br',
        estimatedValue: 320000,
        source: lead_source.PAID_ADS,
        createdBy: 'seed',
      },
    }),
    prisma.lead.create({
      data: {
        fullName: 'Ana Beatriz Costa',
        email: 'ana.costa@smartbiz-example.com.br',
        phone: '+5541966664444',
        companyName: 'SmartBiz Example',
        companyCnpj: '44555666000107',
        estimatedValue: 45000,
        source: lead_source.ORGANIC,
        notes: 'Encontrou pelo blog',
        createdBy: 'seed',
      },
    }),
    prisma.lead.create({
      data: {
        fullName: 'Pedro Alves',
        email: 'pedro.alves@nexustech-example.com.br',
        phone: '+5551955555555',
        companyName: 'Nexus Tech Example',
        companyCnpj: '55666777000163',
        companyWebsite: 'https://nexustech-example.com.br',
        estimatedValue: 500000,
        source: lead_source.OTHER,
        notes: 'Contato via evento',
        createdBy: 'seed',
      },
    }),
  ]);

  console.log(`[SEED] Created ${leads.length} leads`);

  await Promise.all([
    prisma.leadEnrichment.create({
      data: {
        leadId: leads[0].id,
        status: enrichment_status.SUCCESS,
        fullName: leads[0].fullName,
        email: leads[0].email,
        phone: leads[0].phone,
        companyName: 'Tech Corp Soluções',
        companyCnpj: leads[0].companyCnpj,
        companyWebsite: leads[0].companyWebsite,
        estimatedValue: 180000,
        source: lead_source.WEBSITE,
        rawData: { industry: 'SaaS', employeeCount: 120 },
        requestedAt: new Date('2026-05-01T10:00:00Z'),
        completedAt: new Date('2026-05-01T10:00:05Z'),
        createdBy: 'seed',
      },
    }),
    prisma.leadEnrichment.create({
      data: {
        leadId: leads[1].id,
        status: enrichment_status.SUCCESS,
        fullName: leads[1].fullName,
        email: leads[1].email,
        phone: leads[1].phone,
        companyName: 'InovaData Tecnologia',
        companyCnpj: leads[1].companyCnpj,
        companyWebsite: leads[1].companyWebsite,
        estimatedValue: 95000,
        source: lead_source.REFERRAL,
        rawData: { industry: 'Data Analytics', employeeCount: 45 },
        requestedAt: new Date('2026-05-01T11:00:00Z'),
        completedAt: new Date('2026-05-01T11:00:04Z'),
        createdBy: 'seed',
      },
    }),
    prisma.leadEnrichment.create({
      data: {
        leadId: leads[2].id,
        status: enrichment_status.FAILED,
        errorMessage: 'Mock API timeout',
        requestedAt: new Date('2026-05-01T12:00:00Z'),
        completedAt: new Date('2026-05-01T12:00:10Z'),
        createdBy: 'seed',
      },
    }),
  ]);

  console.log('[SEED] Created enrichments');

  await Promise.all([
    prisma.leadClassification.create({
      data: {
        leadId: leads[0].id,
        status: classification_status.SUCCESS,
        score: 92,
        classification: 'Hot',
        justification: 'Alto valor estimado e fonte qualificada',
        commercialPotential: 'High',
        modelUsed: 'tinyllama',
        requestedAt: new Date('2026-05-01T10:01:00Z'),
        completedAt: new Date('2026-05-01T10:01:30Z'),
        createdBy: 'seed',
      },
    }),
    prisma.leadClassification.create({
      data: {
        leadId: leads[1].id,
        status: classification_status.SUCCESS,
        score: 65,
        classification: 'Warm',
        justification: 'Indicação confiável mas valor moderado',
        commercialPotential: 'Medium',
        modelUsed: 'tinyllama',
        requestedAt: new Date('2026-05-01T11:01:00Z'),
        completedAt: new Date('2026-05-01T11:01:25Z'),
        createdBy: 'seed',
      },
    }),
    prisma.leadClassification.create({
      data: {
        leadId: leads[3].id,
        status: classification_status.SUCCESS,
        score: 35,
        classification: 'Cold',
        justification: 'Valor estimado baixo e fonte orgânica sem qualificação',
        commercialPotential: 'Low',
        modelUsed: 'tinyllama',
        requestedAt: new Date('2026-05-01T13:00:00Z'),
        completedAt: new Date('2026-05-01T13:00:45Z'),
        createdBy: 'seed',
      },
    }),
    prisma.leadClassification.create({
      data: {
        leadId: leads[4].id,
        status: classification_status.FAILED,
        errorMessage: 'Ollama model unavailable',
        requestedAt: new Date('2026-05-01T14:00:00Z'),
        completedAt: new Date('2026-05-01T14:00:05Z'),
        createdBy: 'seed',
      },
    }),
  ]);

  console.log('[SEED] Created classifications');
  console.log('[SEED] Completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });