
import { createContext, useState, useContext, ReactNode } from "react";

export type UserRole = "customer" | "pharmacist" | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  currentRole: UserRole;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  setCurrentRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>(null);
  
  // For demo purposes, we'll use a mock login function
  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call to authenticate
    // For demo, we'll create a mock user
    const mockUser = {
      id: "user-1",
      name: email.split('@')[0],
      email,
      role: null as UserRole
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUser(mockUser);
    return Promise.resolve();
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    // In a real app, this would make an API call to register the user
    // For demo, we'll create a mock user
    const mockUser = {
      id: "user-1",
      name,
      email,
      role
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUser(mockUser);
    setCurrentRole(role);
    return Promise.resolve();
  };

  const logout = () => {
    setUser(null);
    setCurrentRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        currentRole,
        login,
        register,
        logout,
        setCurrentRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
