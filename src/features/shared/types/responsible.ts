export type Responsible = {
  name: string;
  cpf: string;
  rg?: string;
  birthDate: string;
  gender: string;
  email: string;
  phone: string;
};

export type ResponsibleCreatePayload = {
  name: string;
  cpf: string;
  rg?: string;
  birth_date: string;
  gender: string;
  email?: string;
  phone: string;
  client_id: number;
};
