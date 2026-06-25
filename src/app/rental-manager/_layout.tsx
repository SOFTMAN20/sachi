import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Platform, Alert,
} from 'react-native';
import { Slot, usePathname, useRouter } from 'expo-router';
import {
  LayoutGrid, Building2, Plus, UserPlus, Users, CreditCard, MessageSquare, LogOut,
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { ROLE_INFO } from '@/data/mockData';

const COLORS = {
  primary: '#1B6B3A',
  primaryLight: '#E8F5E9',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  bg: '#F8F9FA',
  surface: '#FFFFFF',
  danger: '#DC2626',
};

export const DESKTOP_BREAKPOINT = 900;

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, path: '/rental-manager', match: '/rental-manager' },
  { id: 'properties', label: 'Properties', icon: Building2, path: '/rental-manager/properties', match: '/rental-manager/properties' },
  { id: 'add', label: 'Add Listing', icon: Plus, path: '/add-listing', match: '/add-listing' },
  { id: 'leads', label: 'Leads', icon: UserPlus, path: '/rental-manager/leads', match: '/rental-manager/leads' },
  { id: 'tenants', label: 'Tenants', icon: Users, path: '/rental-manager/tenants', match: '/rental-manager/tenants' },
  { id: 'payments', label: 'Payments', icon: CreditCard, path: '/rental-manager/payments', match: '/rental-manager/payments' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/(tabs)/messages', match: '/messages' },
] as const;

export default function RentalManagerLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, userName, userRole, logout } = useApp();

  const canManage = userRole === 'landlord' || userRole === 'property_manager';

  // On mobile, or for unauthorized/locked states, render the screen as-is (no sidebar).
  if (!isDesktop || !isLoggedIn || !canManage) {
    return <Slot />;
  }

  const roleLabel = userRole ? ROLE_INFO[userRole].title : 'Host';

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(tabs)');
        },
      },
    ]);
  };

  return (
    <View style={styles.shell}>
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.brand}>Sachi</Text>
          <Text style={styles.brandSub}>Rental Manager</Text>
        </View>

        <View style={styles.navList}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = pathname === item.match;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.navItem, active && styles.navItemActive]}
                onPress={() => router.push(item.path as any)}
                activeOpacity={0.7}
              >
                <Icon size={19} color={active ? '#FFFFFF' : COLORS.text} strokeWidth={2} />
                <Text style={[styles.navText, active && styles.navTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sidebarFooter}>
          <View style={styles.footerUser}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>{(userName || 'U').charAt(0).toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName} numberOfLines={1}>{userName || 'User'}</Text>
              <Text style={styles.userRole} numberOfLines={1}>{roleLabel}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout} activeOpacity={0.7}>
            <LogOut size={17} color={COLORS.danger} strokeWidth={2} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, flexDirection: 'row', backgroundColor: COLORS.bg, height: '100%' },
  sidebar: {
    width: 260,
    backgroundColor: COLORS.surface,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  sidebarHeader: { paddingHorizontal: 8, marginBottom: 24 },
  brand: { fontSize: 20, fontWeight: '800', color: COLORS.primary, letterSpacing: -0.3 },
  brandSub: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600', marginTop: 2 },
  navList: { flex: 1, gap: 4 },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
  },
  navItemActive: { backgroundColor: COLORS.primary },
  navText: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  navTextActive: { color: '#FFFFFF' },
  sidebarFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  footerUser: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 4 },
  avatarCircle: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: { fontSize: 14, fontWeight: '800', color: COLORS.primary },
  userName: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  userRole: { fontSize: 12, color: COLORS.textSecondary },
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: COLORS.danger,
  },
  signOutText: { fontSize: 13, fontWeight: '700', color: COLORS.danger },
  content: { flex: 1, height: '100%' },
});
