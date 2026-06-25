import React, { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { UserRole, Property } from '@/types';
import { MOCK_PROPERTIES } from '@/data/mockData';

interface AppContextType {
  properties: Property[];
  addProperty: (property: Property) => void;
  userRole: UserRole | null;
  setUserRole: (role: UserRole) => void;
  showRoleModal: boolean;
  dismissRoleModal: () => void;
  reopenRoleModal: () => void;
  isLoggedIn: boolean;
  userName: string;
  userPhone: string;
  businessName: string;
  whatsappPhone: string;
  userEmail: string;
  updateProfile: (fields: { name?: string; businessName?: string; phone?: string; whatsappPhone?: string; email?: string }) => void;
  login: (phone: string, name: string) => void;
  logout: () => void;
  showLoginModal: boolean;
  loginPromptMessage: string;
  requestLogin: (message: string, onSuccess?: () => void) => void;
  dismissLoginModal: () => void;
  savedProperties: Set<string>;
  toggleSave: (propertyId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRoleState] = useState<UserRole | null>(null);
  // RoleModal haionekani mara moja — inajitokeza baada ya sekunde 5 (onboarding),
  // ila tu kama mtumiaji bado hajachagua wala kufunga role.
  const [showRoleModal, setShowRoleModal] = useState(false);
  const roleChosenRef = useRef(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPromptMessage, setLoginPromptMessage] = useState('');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [savedProperties, setSavedProperties] = useState<Set<string>>(new Set());
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);

  const addProperty = useCallback((property: Property) => {
    setProperties(prev => [property, ...prev]);
  }, []);

  // Onboarding: onyesha RoleModal baada ya sekunde 10 kama bado hajachagua role.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!roleChosenRef.current) {
        setShowRoleModal(true);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const setUserRole = useCallback((role: UserRole) => {
    roleChosenRef.current = true;
    setUserRoleState(role);
  }, []);

  const dismissRoleModal = useCallback(() => {
    roleChosenRef.current = true;
    setShowRoleModal(false);
  }, []);

  const reopenRoleModal = useCallback(() => {
    setShowRoleModal(true);
  }, []);

  const login = useCallback((phone: string, name: string) => {
    setIsLoggedIn(true);
    setUserPhone(phone);
    setUserName(name || phone.replace('+255', '0'));
    setShowLoginModal(false);
    setPendingAction(prev => {
      if (prev) {
        setTimeout(prev, 100);
      }
      return null;
    });
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserName('');
    setUserPhone('');
    setBusinessName('');
    setWhatsappPhone('');
    setUserEmail('');
    setSavedProperties(new Set());
  }, []);

  const updateProfile = useCallback((fields: { name?: string; businessName?: string; phone?: string; whatsappPhone?: string; email?: string }) => {
    if (fields.name !== undefined) setUserName(fields.name);
    if (fields.businessName !== undefined) setBusinessName(fields.businessName);
    if (fields.phone !== undefined) setUserPhone(fields.phone);
    if (fields.whatsappPhone !== undefined) setWhatsappPhone(fields.whatsappPhone);
    if (fields.email !== undefined) setUserEmail(fields.email);
  }, []);

  const requestLogin = useCallback((message: string, onSuccess?: () => void) => {
    setLoginPromptMessage(message);
    setPendingAction(onSuccess ? () => onSuccess : null);
    setShowLoginModal(true);
  }, []);

  const dismissLoginModal = useCallback(() => {
    setShowLoginModal(false);
    setPendingAction(null);
  }, []);

  const toggleSave = useCallback((propertyId: string) => {
    if (!isLoggedIn) {
      requestLogin('Sign in to save properties to your wishlist');
      return;
    }
    setSavedProperties(prev => {
      const next = new Set(prev);
      if (next.has(propertyId)) {
        next.delete(propertyId);
      } else {
        next.add(propertyId);
      }
      return next;
    });
  }, [isLoggedIn, requestLogin]);

  return (
    <AppContext.Provider value={{
      properties, addProperty,
      userRole, setUserRole,
      showRoleModal, dismissRoleModal, reopenRoleModal,
      isLoggedIn, userName, userPhone,
      businessName, whatsappPhone, userEmail, updateProfile,
      login, logout,
      showLoginModal, loginPromptMessage,
      requestLogin, dismissLoginModal,
      savedProperties, toggleSave,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
