/**
 * SidebarContext
 * Provides openSidebar / closeSidebar and the shared Animated progress value
 * to any screen without prop-drilling.
 */
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated } from 'react-native';

interface SidebarContextValue {
  isOpen:      boolean;
  progress:    Animated.Value;
  openSidebar:  () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  const openSidebar = useCallback(() => {
    setIsOpen(true);
    Animated.spring(progress, {
      toValue:         1,
      useNativeDriver: true,
      damping:         22,
      stiffness:       200,
      mass:            1,
    }).start();
  }, [progress]);

  const closeSidebar = useCallback(() => {
    Animated.spring(progress, {
      toValue:         0,
      useNativeDriver: true,
      damping:         24,
      stiffness:       220,
    }).start(() => setIsOpen(false));
  }, [progress]);

  return (
    <SidebarContext.Provider value={{ isOpen, progress, openSidebar, closeSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used inside SidebarProvider');
  return ctx;
}
