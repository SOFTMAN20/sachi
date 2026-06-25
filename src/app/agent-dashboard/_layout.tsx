import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { Slot, usePathname, useRouter } from 'expo-router';
import { LayoutGrid, Building2, Plus, Inbox, User, Wallet } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';

const COLORS = {
  primary: '#1B6B3A',
  primaryLight: '#E8F5E9',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  bg: '#F8F9FA',
  surface: '#FFFFFF',
};

export const DESKTOP_BREAKPOINT = 900;

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid, path: '/agent-dashboard', match: '/agent-dashboard' },
  { id: 'listings', label: 'My Listings', icon: Building2, path: '/agent-dashboard/listings', match: '/agent-dashboard/listings' },
  { id: 'add', label: 'Add Listing', icon: Plus, path: '/add-listing', match: '/add-listing' },
  { id: 'leads', label: 'Lead Inbox', icon: Inbox, path: '/agent-dashboard/lead-inbox', match: '/agent-dashboard/lead-inbox' },
  { id: 'profile', label: 'Agent Profile', icon: User, path: '/agent-dashboard/profile', match: '/agent-dashboard/profile' },
  { id: 'billing', label: 'Billing', icon: Wallet, path: '/agent-dashboard/billing', match: '/agent-dashboard/billing' },
] as const;

export default function AgentDashboardLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;
  const router = useRouter();
  const pathname = usePathname();
  const { userName } = useApp();

  if (!isDesktop) {
    return <Slot />;
  }

  return (
    <View style={styles.shell}>
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.brand}>Sachi</Text>
          <Text style={styles.brandSub}>Agent Dashboard</Text>
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
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{(userName || 'A').charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.userName} numberOfLines={1}>{userName || 'Agent'}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  avatarCircle: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: { fontSize: 13, fontWeight: '800', color: COLORS.primary },
  userName: { fontSize: 13, fontWeight: '700', color: COLORS.text, flex: 1 },
  content: { flex: 1, height: '100%' },
});
