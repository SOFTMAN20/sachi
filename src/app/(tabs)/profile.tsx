import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Platform, Alert, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  User, LogIn, LogOut, Phone, Shield, ChevronRight,
  Heart, MessageCircle, Settings as SettingsIcon, CircleHelp, Plus, Building2,
  Pencil, Briefcase, Mail, TrendingUp,
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { ROLE_INFO } from '@/data/mockData';

const DESKTOP_BREAKPOINT = 900;

const COLORS = {
  primary: '#1B6B3A',
  primaryLight: '#E8F5E9',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  bg: '#F8F9FA',
  border: '#E5E7EB',
  surface: '#FFFFFF',
  danger: '#DC2626',
};

const MENU_ITEMS = [
  { icon: Heart, label: 'Saved Properties', action: 'saved' as const },
  { icon: MessageCircle, label: 'Messages', action: 'messages' as const },
  { icon: SettingsIcon, label: 'Account Settings', action: 'settings' as const },
  { icon: CircleHelp, label: 'Help & Support', action: 'help' as const },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;
  // Clear the native bottom tab bar so Sign Out isn't hidden behind it.
  const bottomPad = Platform.OS === 'web' ? 32 : insets.bottom + 160;
  const {
    isLoggedIn, userName, userPhone, userRole, requestLogin, logout, reopenRoleModal,
    businessName, whatsappPhone, userEmail,
  } = useApp();

  const handleMenuPress = (action: typeof MENU_ITEMS[number]['action']) => {
    switch (action) {
      case 'saved':
        router.push('/(tabs)/saved');
        break;
      case 'messages':
        router.push('/(tabs)/messages');
        break;
      case 'settings':
        Alert.alert('Account Settings', undefined, [
          { text: 'Change Role', onPress: reopenRoleModal },
          { text: 'Cancel', style: 'cancel' },
        ]);
        break;
      case 'help':
        Alert.alert('Help & Support', 'Reach us at support@sachi.app');
        break;
    }
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.lockScreen}>
          <View style={styles.lockIcon}>
            <User size={36} color={COLORS.primary} strokeWidth={1.5} />
          </View>
          <Text style={styles.lockTitle}>Manage your account</Text>
          <Text style={styles.lockSubtitle}>
            Sign in to view your profile, manage listings, and update your details.
          </Text>
          <TouchableOpacity
            style={styles.signInBtn}
            onPress={() => requestLogin('Sign in to view your profile')}
            activeOpacity={0.85}
          >
            <LogIn size={18} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.signInBtnText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const roleInfo = userRole ? ROLE_INFO[userRole] : null;

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop, { paddingBottom: bottomPad }]} showsVerticalScrollIndicator={false}>
       <View style={isDesktop ? styles.innerDesktop : undefined}>

        <View style={[styles.profileCard, isDesktop && styles.profileCardDesktop]}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{(userName || 'U').charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>{userName || 'User'}</Text>
          {!!businessName && (
            <View style={styles.phoneRow}>
              <Briefcase size={13} color={COLORS.textSecondary} strokeWidth={2} />
              <Text style={styles.userPhone}>{businessName}</Text>
            </View>
          )}
          <View style={styles.phoneRow}>
            <Phone size={13} color={COLORS.textSecondary} strokeWidth={2} />
            <Text style={styles.userPhone}>{userPhone}</Text>
          </View>
          {!!whatsappPhone && (
            <View style={styles.phoneRow}>
              <MessageCircle size={13} color={COLORS.textSecondary} strokeWidth={2} />
              <Text style={styles.userPhone}>{whatsappPhone}</Text>
            </View>
          )}
          {!!userEmail && (
            <View style={styles.phoneRow}>
              <Mail size={13} color={COLORS.textSecondary} strokeWidth={2} />
              <Text style={styles.userPhone}>{userEmail}</Text>
            </View>
          )}
          {roleInfo && (
            <View style={styles.roleBadge}>
              <Shield size={13} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.roleBadgeText}>{roleInfo.title}</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => router.push('/edit-profile')}
            activeOpacity={0.7}
          >
            <Pencil size={13} color={COLORS.primary} strokeWidth={2} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {isLoggedIn && userRole === 'admin' && (
          <TouchableOpacity
            style={[styles.dashboardBtn, { backgroundColor: '#FEE2E2', borderColor: COLORS.danger }]}
            onPress={() => router.push('/admin-dashboard' as any)}
            activeOpacity={0.85}
          >
            <View style={[styles.dashboardIconWrap, { backgroundColor: COLORS.danger }]}>
              <Shield size={18} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.dashboardTitle}>Admin Dashboard</Text>
              <Text style={styles.dashboardSubtitle}>Manage users, properties & reports</Text>
            </View>
            <ChevronRight size={18} color={COLORS.danger} strokeWidth={2} />
          </TouchableOpacity>
        )}

        {isLoggedIn && (userRole === 'landlord' || userRole === 'property_manager') && (
          <TouchableOpacity
            style={styles.dashboardBtn}
            onPress={() => router.push('/rental-manager' as any)}
            activeOpacity={0.85}
          >
            <View style={styles.dashboardIconWrap}>
              <Building2 size={18} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.dashboardTitle}>Rental Manager</Text>
              <Text style={styles.dashboardSubtitle}>Manage properties, leads & viewings</Text>
            </View>
            <ChevronRight size={18} color={COLORS.primary} strokeWidth={2} />
          </TouchableOpacity>
        )}

        {isLoggedIn && userRole === 'agent' && (
          <TouchableOpacity
            style={styles.dashboardBtn}
            onPress={() => router.push('/agent-dashboard' as any)}
            activeOpacity={0.85}
          >
            <View style={styles.dashboardIconWrap}>
              <TrendingUp size={18} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.dashboardTitle}>Agent Dashboard</Text>
              <Text style={styles.dashboardSubtitle}>Track leads, conversions & commission</Text>
            </View>
            <ChevronRight size={18} color={COLORS.primary} strokeWidth={2} />
          </TouchableOpacity>
        )}

        {isLoggedIn && (
          <TouchableOpacity
            style={styles.addListingBtn}
            onPress={() => router.push('/add-listing')}
            activeOpacity={0.85}
          >
            <View style={styles.addListingIconWrap}>
              <Plus size={18} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.addListingTitle}>Start hosting</Text>
              <Text style={styles.addListingSubtitle}>Post a property in a few quick steps</Text>
            </View>
            <ChevronRight size={18} color={COLORS.primary} strokeWidth={2} />
          </TouchableOpacity>
        )}

        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === MENU_ITEMS.length - 1;
            return (
              <TouchableOpacity
                key={item.action}
                style={[styles.menuRow, isLast && styles.menuRowLast]}
                activeOpacity={0.7}
                onPress={() => handleMenuPress(item.action)}
              >
                <View style={styles.menuIconWrap}>
                  <Icon size={18} color={COLORS.primary} strokeWidth={2} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <ChevronRight size={18} color={COLORS.textSecondary} strokeWidth={2} />
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <LogOut size={18} color={COLORS.danger} strokeWidth={2} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
       </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },
  contentDesktop: { alignItems: 'center', paddingTop: 24 },
  innerDesktop: { width: '100%', maxWidth: 620, alignSelf: 'center' },
  profileCardDesktop: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: COLORS.text, letterSpacing: -0.5 },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 6,
  },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  avatarInitial: { fontSize: 32, fontWeight: '800', color: '#FFFFFF' },
  userName: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  userPhone: { fontSize: 14, color: COLORS.textSecondary },
  roleBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.primaryLight, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 6, marginTop: 8,
  },
  roleBadgeText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  editProfileBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 12, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: COLORS.primary,
  },
  editProfileText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  dashboardBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.primaryLight,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dashboardIconWrap: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  dashboardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  dashboardSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },
  addListingBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  addListingIconWrap: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  addListingTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  addListingSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },
  menuSection: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  menuRowLast: {
    borderBottomWidth: 0,
  },
  menuIconWrap: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.text },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginHorizontal: 20, marginTop: 20, paddingVertical: 15,
    borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.danger,
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: COLORS.danger },
  lockScreen: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 40, gap: 16, paddingBottom: 80,
  },
  lockIcon: {
    width: 84, height: 84, borderRadius: 28, backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  lockTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text, textAlign: 'center', letterSpacing: -0.3 },
  lockSubtitle: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22 },
  signInBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.primary,
    borderRadius: 14, paddingVertical: 15, paddingHorizontal: 32, marginTop: 8,
  },
  signInBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
