// types/auth/dataLocal.type.ts
export type TDataLocal = {
  token: string;
  refreshToken: string;
  name: string;
  email: string;
  admin: string;
  photo: string;
  logoCompany: string;
  nameCompany: string;
  nameStore: string;
  typePlan: string;
  subscriberPlan: string;
  expirationDate: string;
  modules: any[];
  master?: string;
};
