import { useContext } from "react"
import AuthContext from "../context/authContext"

export const useAuth = () => {
    const context = useContext(AuthContext);
     if(context === undefined) {
        throw new Error("useAuth, bir AuthProvider içerisinde olmalı ");
     }
     return context;
}