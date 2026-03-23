export type NavItem = {
  name: string;
  icon?: string;
  path?: string;
  code?: string;
  authorized?: boolean;
  subItems?: NavItem[];
};
