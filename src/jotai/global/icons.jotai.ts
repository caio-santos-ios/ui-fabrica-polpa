import { atom } from "jotai";
import {
  FiShoppingCart, FiPackage, FiBox, FiUsers, FiTruck,
  FiBarChart2, FiHome, FiSettings, FiAlertTriangle,
} from "react-icons/fi";

export const iconAtom = atom<Record<string, any>>({
  FiShoppingCart,
  FiPackage,
  FiBox,
  FiUsers,
  FiTruck,
  FiBarChart2,
  FiHome,
  FiSettings,
  FiAlertTriangle,
});
