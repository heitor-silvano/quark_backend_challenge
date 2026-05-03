export interface MockApiResponse {
  companyName: string;
  tradeName: string;
  cnpj: string;
  industry: string;
  legalNature: string;
  employeeCount: number;
  annualRevenue: number;
  foundedAt: string;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  cnaes: Array<{ code: string; description: string; isPrimary: boolean }>;
  partners: Array<{ name: string; cpf: string; role: string; joinedAt: string; phone: string; email: string }>;
  phones: Array<{ type: 'commercial' | 'mobile'; number: string }>;
  emails: Array<{ type: string; address: string }>;
}