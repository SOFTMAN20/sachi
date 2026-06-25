import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Platform, Modal, Pressable, Alert, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Shield, Users, Building2, MessageSquare, DollarSign, Menu, X,
  TrendingUp, AlertCircle, CheckCircle, Clock, Home, Settings,
  LogOut, FileText, BarChart3, Star,
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';

const DESKTOP_BREAKPOINT = 900;

const COLORS = {
  primary: '#1B6B3A',
  primaryLight: '#E8F5E9',
  secondary: '#F5A623',
  secondaryLight: '#FEF3E2',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  bg: '#F8F9FA',
  surface: '#FFFFFF',
  blue: '#2563EB',
  blueLight: '#E0F2FE',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  success: '#16A34A',
};

// Mock admin stats
const ADMIN_STATS = {
  totalUsers: 1247,
  totalProperties: 342,
  activeListings: 289,
  totalRevenue: 45800000,
  pendingVerifications: 12,
  reportedIssues: 5,
  monthlyGrowth: 15.3,
  activeHosts: 98,
};

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;
  const { isLoggedIn, userName, userRole, requestLogin, logout } = useApp();
  const [menuVisible, setMenuVisible] = useState(false);

  if (!isLoggedIn || userRole !== 'admin') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.lockScreen}>
          <View style={styles.lockIcon}>
            <Shield size={36} color={COLORS.danger} strokeWidth={1.5} />
          </View>
          <Text style={styles.lockTitle}>Admin Access Required</Text>
          <Text style={styles.lockSubtitle}>
            This area is restricted to administrators only.
          </Text>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleLogout = () => {
    setMenuVisible(false);
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => {
        logout();
        router.replace('/(tabs)');
      }},
    ]);
  };

  const showComingSoon = (feature: string) => {
    Alert.alert(feature, 'This feature is coming soon.');
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, onPress: () => { setMenuVisible(false); router.push('/(tabs)'); } },
    { id: 'users', label: 'Users', icon: Users, onPress: () => { setMenuVisible(false); router.push('/admin/users'); } },
    { id: 'properties', label: 'Properties', icon: Building2, onPress: () => { setMenuVisible(false); router.push('/admin/properties'); } },
    { id: 'featured', label: 'Featured', icon: TrendingUp, onPress: () => { setMenuVisible(false); router.push('/admin/featured'); } },
    { id: 'reports', label: 'Reports', icon: FileText, onPress: () => { setMenuVisible(false); router.push('/admin/reports'); } },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, onPress: () => { setMenuVisible(false); router.push('/admin/analytics'); } },
    { id: 'settings', label: 'Settings', icon: Settings, onPress: () => { setMenuVisible(false); showComingSoon('Settings'); } },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView 
        style={styles.scroll}
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
        showsVerticalScrollIndicator={false}
      >
        <View style={isDesktop ? styles.innerDesktop : undefined}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.menuBtn}
            onPress={() => setMenuVisible(true)}
            activeOpacity={0.7}
          >
            <Menu size={24} color={COLORS.text} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.greeting}>Admin Dashboard</Text>
          <View style={styles.adminBadge}>
            <Shield size={14} color={COLORS.danger} strokeWidth={2.5} />
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: COLORS.blueLight }]}>
            <Users size={20} color={COLORS.blue} strokeWidth={2} />
            <Text style={styles.statValue}>{ADMIN_STATS.totalUsers.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: COLORS.primaryLight }]}>
            <Building2 size={20} color={COLORS.primary} strokeWidth={2} />
            <Text style={styles.statValue}>{ADMIN_STATS.totalProperties}</Text>
            <Text style={styles.statLabel}>Properties</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: COLORS.secondaryLight }]}>
            <TrendingUp size={20} color={COLORS.secondary} strokeWidth={2} />
            <Text style={styles.statValue}>{ADMIN_STATS.monthlyGrowth}%</Text>
            <Text style={styles.statLabel}>Growth</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#F3E8FF' }]}>
            <DollarSign size={20} color='#9333EA' strokeWidth={2} />
            <Text style={styles.statValue}>{(ADMIN_STATS.totalRevenue / 1000000).toFixed(1)}M</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
        </View>

        {/* Alerts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requires Attention</Text>
          
          <TouchableOpacity 
            style={styles.alertCard} 
            activeOpacity={0.7}
            onPress={() => router.push('/admin/properties')}
          >
            <View style={[styles.alertIcon, { backgroundColor: COLORS.secondaryLight }]}>
              <Clock size={20} color={COLORS.secondary} strokeWidth={2} />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Pending Verifications</Text>
              <Text style={styles.alertSubtitle}>{ADMIN_STATS.pendingVerifications} properties awaiting approval</Text>
            </View>
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeText}>{ADMIN_STATS.pendingVerifications}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.alertCard} 
            activeOpacity={0.7}
            onPress={() => router.push('/admin/reports')}
          >
            <View style={[styles.alertIcon, { backgroundColor: COLORS.dangerLight }]}>
              <AlertCircle size={20} color={COLORS.danger} strokeWidth={2} />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Reported Issues</Text>
              <Text style={styles.alertSubtitle}>{ADMIN_STATS.reportedIssues} unresolved reports</Text>
            </View>
            <View style={[styles.alertBadge, { backgroundColor: COLORS.dangerLight }]}>
              <Text style={[styles.alertBadgeText, { color: COLORS.danger }]}>{ADMIN_STATS.reportedIssues}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Management Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Management</Text>
          
          <View style={styles.managementGrid}>
            <TouchableOpacity 
              style={styles.managementCard}
              onPress={() => router.push('/admin/users')}
              activeOpacity={0.85}
            >
              <View style={[styles.managementIcon, { backgroundColor: COLORS.blueLight }]}>
                <Users size={24} color={COLORS.blue} strokeWidth={2} />
              </View>
              <Text style={styles.managementTitle}>Users</Text>
              <Text style={styles.managementValue}>{ADMIN_STATS.totalUsers}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.managementCard}
              onPress={() => router.push('/admin/properties')}
              activeOpacity={0.85}
            >
              <View style={[styles.managementIcon, { backgroundColor: COLORS.primaryLight }]}>
                <Building2 size={24} color={COLORS.primary} strokeWidth={2} />
              </View>
              <Text style={styles.managementTitle}>Properties</Text>
              <Text style={styles.managementValue}>{ADMIN_STATS.totalProperties}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.managementCard}
              onPress={() => router.push('/admin/featured')}
              activeOpacity={0.85}
            >
              <View style={[styles.managementIcon, { backgroundColor: COLORS.secondaryLight }]}>
                <Star size={24} color={COLORS.secondary} strokeWidth={2} />
              </View>
              <Text style={styles.managementTitle}>Featured</Text>
              <Text style={styles.managementValue}>3</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.managementCard}
              onPress={() => router.push('/admin/reports')}
              activeOpacity={0.85}
            >
              <View style={[styles.managementIcon, { backgroundColor: COLORS.dangerLight }]}>
                <FileText size={24} color={COLORS.danger} strokeWidth={2} />
              </View>
              <Text style={styles.managementTitle}>Reports</Text>
              <Text style={styles.managementValue}>{ADMIN_STATS.reportedIssues}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.managementCard}
              onPress={() => router.push('/admin/analytics')}
              activeOpacity={0.85}
            >
              <View style={[styles.managementIcon, { backgroundColor: '#F3E8FF' }]}>
                <BarChart3 size={24} color='#9333EA' strokeWidth={2} />
              </View>
              <Text style={styles.managementTitle}>Analytics</Text>
              <Text style={styles.managementValue}>View</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Platform Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Platform Activity</Text>
          
          <View style={styles.activityCard}>
            <View style={styles.activityRow}>
              <Text style={styles.activityLabel}>Active Listings</Text>
              <Text style={styles.activityValue}>{ADMIN_STATS.activeListings}</Text>
            </View>
            <View style={styles.activityRow}>
              <Text style={styles.activityLabel}>Active Hosts</Text>
              <Text style={styles.activityValue}>{ADMIN_STATS.activeHosts}</Text>
            </View>
            <View style={styles.activityRow}>
              <Text style={styles.activityLabel}>Monthly Growth</Text>
              <View style={styles.growthBadge}>
                <TrendingUp size={12} color={COLORS.success} strokeWidth={2.5} />
                <Text style={styles.growthText}>+{ADMIN_STATS.monthlyGrowth}%</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      </ScrollView>

      {/* Hamburger Menu Modal */}
      <Modal
        visible={menuVisible}
        animationType="fade"
        transparent
        statusBarTranslucent
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.menuOverlay} onPress={() => setMenuVisible(false)}>
          <Pressable style={styles.menuDrawer} onPress={e => e.stopPropagation()}>
            <View style={styles.menuHeader}>
              <View>
                <Text style={styles.menuUserName}>{userName || 'Admin'}</Text>
                <View style={styles.adminRoleBadge}>
                  <Shield size={12} color={COLORS.danger} strokeWidth={2.5} />
                  <Text style={styles.adminRoleText}>Administrator</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.closeBtn}
                onPress={() => setMenuVisible(false)}
                activeOpacity={0.7}
              >
                <X size={22} color={COLORS.text} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.menuItems} showsVerticalScrollIndicator={false}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.menuItem}
                    onPress={item.onPress}
                    activeOpacity={0.7}
                  >
                    <Icon size={22} color={COLORS.text} strokeWidth={2} />
                    <Text style={styles.menuItemText}>{item.label}</Text>
                  </TouchableOpacity>
                );
              })}

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <LogOut size={22} color={COLORS.danger} strokeWidth={2} />
                <Text style={[styles.menuItemText, { color: COLORS.danger }]}>Sign Out</Text>
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },
  contentDesktop: { alignItems: 'center', paddingTop: 24 },
  innerDesktop: { width: '100%', maxWidth: 1200, alignSelf: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 20,
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  adminBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 180 : '47%',
    maxWidth: Platform.OS === 'web' ? 280 : '48%',
    borderRadius: 18,
    padding: 16,
    gap: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  alertIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  alertSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  alertBadge: {
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  alertBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  managementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  managementCard: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 180 : '47%',
    maxWidth: Platform.OS === 'web' ? 220 : '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  managementIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  managementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  managementValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  activityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activityValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  growthText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.success,
  },
  lockScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  lockIcon: {
    width: 84,
    height: 84,
    borderRadius: 28,
    backgroundColor: COLORS.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  lockTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  lockSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  backBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuDrawer: {
    width: '80%',
    maxWidth: 320,
    height: '100%',
    backgroundColor: COLORS.surface,
    paddingTop: Platform.OS === 'android' ? 48 : 60,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuUserName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  adminRoleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.dangerLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  adminRoleText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.danger,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItems: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
    marginHorizontal: 20,
  },
});
