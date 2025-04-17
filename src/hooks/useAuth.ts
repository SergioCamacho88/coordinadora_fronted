import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContextObject"; // 👈 Importar de AuthContextObject.ts

export const useAuth = () => useContext(AuthContext);
