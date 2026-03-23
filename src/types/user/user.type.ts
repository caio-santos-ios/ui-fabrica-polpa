export type TUserLogged = {
  id: string;
  name: string;
  email: string;
  photo: string;
  admin: boolean;
  master: boolean;
  modules: any[];
};

export const ResetUserLogged: TUserLogged = {
  id: "",
  name: "",
  email: "",
  photo: "",
  admin: false,
  master: false,
  modules: [],
};
