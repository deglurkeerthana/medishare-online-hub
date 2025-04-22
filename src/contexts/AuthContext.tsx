
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
    // For demo, we'll check if we have stored user data
    const storedUsers = localStorage.getItem('medishare_users');
    let users: User[] = [];
    
    if (storedUsers) {
      users = JSON.parse(storedUsers);
      const foundUser = users.find(u => u.email === email);
      
      if (foundUser) {
        // In a real app, we would validate the password here
        setUser(foundUser);
        setCurrentRole(foundUser.role);
        return Promise.resolve();
      }
    }
    
    // If user not found, create a new one
    const mockUser = {
      id: `user-${Date.now()}`,
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
    // For demo, we'll create a mock user and store it
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role
    };

    // Store user in localStorage for persistence
    const storedUsers = localStorage.getItem('medishare_users');
    let users: User[] = [];
    
    if (storedUsers) {
      users = JSON.parse(storedUsers);
    }
    
    users.push(newUser);
    localStorage.setItem('medishare_users', JSON.stringify(users));

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUser(newUser);
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
