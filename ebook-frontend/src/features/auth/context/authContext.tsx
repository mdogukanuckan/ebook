import React, { createContext, useEffect, useState, type ReactNode } from "react";
import type { LoginRequest, User } from "../types/auth";
import { authApi } from "../api/authApi";

interface AuthContextType {
    user : User | null;
    login : (credentials : LoginRequest) => Promise<void>;
    logout : () => void;
    loading : boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false); 
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const data = await authApi.login(credentials);
      const { accessToken, ...userData } = data;
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData as unknown as User);
    } catch (error) {
      throw error; 
    }
  };

  const logout = () =>{
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return(
    <AuthContext.Provider value={{user,login,logout,loading}}>
        {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;