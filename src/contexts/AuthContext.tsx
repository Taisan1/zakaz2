import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  login: string;
  password: string;
  name: string;
  role: 'photographer' | 'designer' | 'admin';
  department?: string;
  position?: string;
  salary?: number;
  phone?: string;
  telegram?: string;
  avatar?: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  addUser: (userData: Omit<User, 'id'>) => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin',
    login: 'admin',
    password: 'admin',
    name: 'Администратор',
    role: 'admin',
    department: 'Управление',
    position: 'Системный администратор',
    createdAt: new Date()
  },
  {
    id: '2',
    email: 'john@company.com',
    login: 'john@company.com',
    password: 'john@company.com',
    name: 'John Doe',
    role: 'photographer',
    department: 'Engineering',
    position: 'Software Developer',
    salary: 75000,
    createdAt: new Date()
  },
  {
    id: '3',
    email: 'jane@company.com',
    login: 'jane@company.com',
    password: 'jane@company.com',
    name: 'Jane Smith',
    role: 'designer',
    department: 'Marketing',
    position: 'Marketing Manager',
    salary: 65000,
    createdAt: new Date()
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    const foundUser = users.find(u => u.login === email);
    if (foundUser) {
      if (foundUser.password === password) {
        setUser(foundUser);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    // Mock registration - in real app, this would call an API
    const existingUser = users.find(u => u.login === userData.login);
    if (existingUser) {
      return false; // User already exists
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      login: userData.login,
      password: userData.password,
      name: userData.name,
      role: userData.role,
      department: userData.department,
      position: userData.position,
      salary: userData.salary,
      phone: userData.phone,
      telegram: userData.telegram,
      createdAt: new Date()
    };

    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return true;
  };

  const addUser = (userData: Omit<User, 'id'> & { password: string }) => {
    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date()
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...userData } : user
    ));
    
    // Update current user if it's the same user being updated
    if (user && user.id === id) {
      setUser(prev => prev ? { ...prev, ...userData } : null);
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    
    // Logout if current user is being deleted
    if (user && user.id === id) {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    users,
    login,
    logout,
    register,
    addUser,
    updateUser,
    deleteUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};