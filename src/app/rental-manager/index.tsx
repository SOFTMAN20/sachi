import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Platform, Image, Alert, Modal, Pressable, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Building2, Users, MessageSquare, Bell, Plus, ChevronRight,
  Eye, Clock, CheckCircle2, AlertCircle, Circle, Menu, X,
  Settings, LogOut, HelpCircle, CreditCard, UserPlus,
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { ROLE_INFO } from '@/data/mockData';
import { ListingStatus } from '@/types';
import { DESKTOP_BREAKPOINT } from './_layout';

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
};

const STATUS_META: Record<ListingStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: '#16A34A', bg: '#E8F5E9' },
  rented: { label: 'Rented', color: COLORS.blue, bg: COLORS.blueLight },
  pending_review: { label: 'Pending', color: COLORS.secondary, bg: COLORS.secondaryLight },
};

const PROPERTY_STATS: Record<string, { views: number; leads: number }> = {
  '1': { views: 482, leads: 9 },
  '2': { views: 211, leads: 4 },
  '3': { views: 96, leads: 1 },
  '4': { views: 357, leads: 6 },
  '5': { views: 174, leads: 3 },
};

type LeadStatus = 'new' | 'contacted' | 'viewing_scheduled';

const LEAD_STATUS_META: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  new: { label: 'New', color: COLORS.secondary, bg: COLORS.secondaryLight },
  contacted: { label: 'Contacted', color: COLORS.blue, bg: COLORS.blueLight },
  viewing_scheduled: { label: 'Viewing set', color: '#16A34A', bg: COLORS.primaryLight },
};

const MOCK_LEADS: {
  id: string; name: string; avatar: string; propertyTitle: string;
  message: string; time: string; status: LeadStatus;
}[] = [
  {
    id: 'l1',
    name: 'Christina Mbatia',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    propertyTitle: 'Modern 3BR Apartment in Masaki',
    message: 'Is this still available? I can move in next week.',
    time: '12m ago',
    status: 'new',
  },
  {
    id: 'l2',
    name: 'Brian Otieno',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    propertyTitle: 'Luxurious 2BR in Oyster Bay',
    message: 'Would you consider a 1-year lease at this rate?',
    time: '1h ago',
    status: 'contacted',
  },
  {
    id: 'l3',
    name: 'Halima Said',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    propertyTitle: 'Cozy 2BR in Mikocheni B',
    message: 'Confirmed for a viewing this Saturday at 10am.',
    time: 'Yesterday',
    status: 'viewing_scheduled',
  },
];

type PaymentStatus = 'paid' | 'due' | 'overdue';

const PAYMENT_STATUS_META: Record<PaymentStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  paid: { label: 'Paid', color: '#16A34A', bg: COLORS.primaryLight, icon: CheckCircle2 },
  due: { label: 'Due soon', color: COLORS.secondary, bg: COLORS.secondaryLight, icon: Clock },
  overdue: { label: 'Overdue', color: COLORS.danger, bg: COLORS.dangerLight, icon: AlertCircle },
};

const MOCK_PAYMENTS: {
  id: string; tenantName: string; propertyTitle: string; amount: number;
  dueDate: string; status: PaymentStatus;
}[] = [
  { id: 'p1', tenantName: 'Ahmed Hassan', propertyTitle: 'Modern 3BR Apartment in Masaki', amount: 2500000, dueDate: '01 Jul', status: 'paid' },
  { id: 'p2', tenantName: 'Fatuma Mwangi', propertyTitle: 'Cozy 2BR in Mikocheni B', amount: 750000, dueDate: '03 Jul', status: 'due' },
  { id: 'p3', tenantName: 'Grace Njoroge', propertyTitle: 'Luxurious 2BR in Oyster Bay', amount: 1800000, dueDate: '28 Jun', status: 'overdue' },
];

function formatTZS(amount: number) {
  return `TZS ${amount.toLocaleString('en-US')}`;
}

export default function DashboardScreen() {
  const router = useRouter();
  const { isLoggedIn, userName, userRole, requestLogin, properties, logout } = useApp();
  const [menuVisible, setMenuVisible] = useState(false);
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.lockScreen}>
          <View style={styles.lockIcon}>
            <Building2 size={36} color={COLORS.primary} strokeWidth={1.5} />
          </View>
          <Text style={styles.lockTitle}>Rental Manager</Text>
          <Text style={styles.lockSubtitle}>
            Sign in to manage your listings, leads, and payments.
          </Text>
          <TouchableOpacity
            style={styles.signInBtn}
            onPress={() => requestLogin('Sign in to access dashboard')}
            activeOpacity={0.85}
          >
            <Text style={styles.signInBtnText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (userRole !== 'landlord' && userRole !== 'property_manager') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.lockScreen}>
          <View style={styles.lockIcon}>
            <Building2 size={36} color={COLORS.primary} strokeWidth={1.5} />
          </View>
          <Text style={styles.lockTitle}>Rental Manager</Text>
          <Text style={styles.lockSubtitle}>
            This dashboard is only available to landlords and property managers.
            {userRole === 'agent' ? ' Agents can track leads from the Agent Dashboard.' : ''}
          </Text>
          {userRole === 'agent' && (
            <TouchableOpacity
              style={styles.signInBtn}
              onPress={() => router.replace('/agent-dashboard' as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.signInBtnText}>Go to Agent Dashboard</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  const myProperties = properties.slice(0, 3);

  const roleLabel = userRole ? ROLE_INFO[userRole].title : 'Host';

  const showComingSoon = (label: string) => Alert.alert(label, 'This section is coming soon.');

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

  const menuItems = [
    { id: 'properties', label: 'Properties', icon: Building2, onPress: () => { setMenuVisible(false); router.push('/rental-manager/properties'); } },
    { id: 'leads', label: 'Leads', icon: UserPlus, onPress: () => { setMenuVisible(false); router.push('/rental-manager/leads'); } },
    { id: 'tenants', label: 'Tenants', icon: Users, onPress: () => { setMenuVisible(false); router.push('/rental-manager/tenants'); } },
    { id: 'payments', label: 'Payments', icon: CreditCard, onPress: () => { setMenuVisible(false); router.push('/rental-manager/payments'); } },
    { id: 'messages', label: 'Messages', icon: MessageSquare, onPress: () => { setMenuVisible(false); router.push('/(tabs)/messages'); } },
  ];

  const secondaryMenuItems = [
    { id: 'settings', label: 'Settings', icon: Settings, onPress: () => { setMenuVisible(false); showComingSoon('Settings'); } },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, onPress: () => { setMenuVisible(false); showComingSoon('Help'); } },
  ];

  const propertyCards = (
    <>
      {myProperties.map(p => {
        const meta = STATUS_META[p.status];
        const stats = PROPERTY_STATS[p.id] ?? { views: 0, leads: 0 };
        return (
          <TouchableOpacity
            key={p.id}
            style={styles.propertyCard}
            activeOpacity={0.9}
            onPress={() => router.push(`/property/${p.id}`)}
          >
            <View style={styles.propertyImageWrap}>
              <Image source={{ uri: p.images[0] }} style={styles.propertyImage} />
              <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
                <Circle size={6} color={meta.color} fill={meta.color} />
                <Text style={[styles.statusBadgeText, { color: meta.color }]}>{meta.label}</Text>
              </View>
            </View>
            <View style={styles.propertyInfo}>
              <Text style={styles.propertyTitle} numberOfLines={2}>{p.title}</Text>
              <Text style={styles.propertyRent}>{formatTZS(p.monthlyRent)}/mo</Text>
              <View style={styles.propertyMetrics}>
                <View style={styles.propertyMetricItem}>
                  <Eye size={12} color={COLORS.textSecondary} strokeWidth={2} />
                  <Text style={styles.propertyMetricText}>{stats.views}</Text>
                </View>
                <View style={styles.propertyMetricItem}>
                  <Users size={12} color={COLORS.textSecondary} strokeWidth={2} />
                  <Text style={styles.propertyMetricText}>{stats.leads} leads</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        style={styles.addPropertyCard}
        activeOpacity={0.85}
        onPress={() => router.push('/add-listing')}
      >
        <View style={styles.addPropertyIcon}>
          <Plus size={24} color={COLORS.primary} strokeWidth={2.5} />
        </View>
        <Text style={styles.addPropertyText}>List a new property</Text>
      </TouchableOpacity>
    </>
  );

  const leadsSection = (
    <View style={isDesktop ? styles.colItem : undefined}>
      <View style={[styles.sectionHeader, isDesktop && styles.sectionHeaderDesktop]}>
        <Text style={styles.sectionTitle}>Recent Leads</Text>
        <TouchableOpacity onPress={() => router.push('/rental-manager/leads')} activeOpacity={0.7}>
          <ChevronRight size={20} color={COLORS.textSecondary} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View style={[styles.listCard, isDesktop && styles.listCardDesktop]}>
        {MOCK_LEADS.map((lead, i) => {
          const meta = LEAD_STATUS_META[lead.status];
          return (
            <TouchableOpacity
              key={lead.id}
              style={[styles.leadRow, i === MOCK_LEADS.length - 1 && styles.lastRow]}
              activeOpacity={0.7}
              onPress={() => router.push('/(tabs)/messages')}
            >
              <Image source={{ uri: lead.avatar }} style={styles.leadAvatar} />
              <View style={styles.leadInfo}>
                <View style={styles.leadTopRow}>
                  <Text style={styles.leadName} numberOfLines={1}>{lead.name}</Text>
                  <Text style={styles.leadTime}>{lead.time}</Text>
                </View>
                <Text style={styles.leadProperty} numberOfLines={1}>{lead.propertyTitle}</Text>
                <Text style={styles.leadMessage} numberOfLines={1}>{lead.message}</Text>
              </View>
              <View style={[styles.leadStatusBadge, { backgroundColor: meta.bg }]}>
                <Text style={[styles.leadStatusText, { color: meta.color }]}>{meta.label}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const paymentsSection = (
    <View style={isDesktop ? styles.colItem : undefined}>
      <View style={[styles.sectionHeader, isDesktop && styles.sectionHeaderDesktop]}>
        <Text style={styles.sectionTitle}>Payments</Text>
        <TouchableOpacity onPress={() => router.push('/rental-manager/payments')} activeOpacity={0.7}>
          <ChevronRight size={20} color={COLORS.textSecondary} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View style={[styles.listCard, isDesktop && styles.listCardDesktop]}>
        {MOCK_PAYMENTS.map((payment, i) => {
          const meta = PAYMENT_STATUS_META[payment.status];
          const Icon = meta.icon;
          return (
            <View
              key={payment.id}
              style={[styles.paymentRow, i === MOCK_PAYMENTS.length - 1 && styles.lastRow]}
            >
              <View style={[styles.paymentIconWrap, { backgroundColor: meta.bg }]}>
                <Icon size={18} color={meta.color} strokeWidth={2} />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTenant} numberOfLines={1}>{payment.tenantName}</Text>
                <Text style={styles.paymentProperty} numberOfLines={1}>{payment.propertyTitle}</Text>
              </View>
              <View style={styles.paymentRight}>
                <Text style={styles.paymentAmount}>{formatTZS(payment.amount)}</Text>
                <Text style={[styles.paymentStatus, { color: meta.color }]}>
                  {meta.label === 'Paid' ? `Paid · ${payment.dueDate}` : `Due ${payment.dueDate}`}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, isDesktop && styles.headerDesktop]}>
          {!isDesktop && (
            <TouchableOpacity
              style={styles.menuBtn}
              onPress={() => setMenuVisible(true)}
              activeOpacity={0.7}
            >
              <Menu size={24} color={COLORS.text} strokeWidth={2} />
            </TouchableOpacity>
          )}
          <Text style={styles.greeting}>Rental Manager</Text>
          {!isDesktop && <View style={styles.menuBtn} />}
        </View>

        {/* Your Properties */}
        <View style={[styles.sectionHeader, isDesktop && styles.sectionHeaderDesktop]}>
          <Text style={styles.sectionTitle}>Properties</Text>
          <TouchableOpacity
            onPress={() => router.push('/rental-manager/properties')}
            activeOpacity={0.7}
          >
            <Text style={styles.seeAll}>View all</Text>
          </TouchableOpacity>
        </View>

        {isDesktop ? (
          <View style={styles.propertyGridDesktop}>
            {propertyCards}
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.propertyRow}
          >
            {propertyCards}
          </ScrollView>
        )}

        {/* Leads + Payments */}
        <View style={isDesktop ? styles.twoCol : undefined}>
          {leadsSection}
          {paymentsSection}
        </View>

        {/* Quick links */}
        <View style={[styles.sectionHeader, isDesktop && styles.sectionHeaderDesktop]}>
          <Text style={styles.sectionTitle}>Manage</Text>
        </View>
        <View style={[styles.menuSection, isDesktop && styles.menuSectionDesktop]}>
          <TouchableOpacity
            style={[styles.menuItem, isDesktop && styles.menuItemDesktop]}
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/messages')}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconWrap}>
                <MessageSquare size={22} color={COLORS.text} strokeWidth={2} />
              </View>
              <Text style={styles.menuLabel}>Messages</Text>
            </View>
            <ChevronRight size={20} color={COLORS.textSecondary} strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, isDesktop && styles.menuItemDesktop]}
            activeOpacity={0.7}
            onPress={() => showComingSoon('Alerts')}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconWrap}>
                <Bell size={22} color={COLORS.text} strokeWidth={2} />
              </View>
              <Text style={styles.menuLabel}>Alerts</Text>
            </View>
            <ChevronRight size={20} color={COLORS.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Hamburger Menu Modal (mobile only) */}
      <Modal
        visible={menuVisible}
        animationType="fade"
        transparent
        statusBarTranslucent
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.menuOverlay} onPress={() => setMenuVisible(false)}>
          <Pressable style={styles.menuDrawer} onPress={e => e.stopPropagation()}>
            {/* Menu Header */}
            <View style={styles.menuHeader}>
              <View>
                <Text style={styles.menuUserName}>{userName || 'User'}</Text>
                <Text style={styles.menuUserRole}>{roleLabel}</Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setMenuVisible(false)}
                activeOpacity={0.7}
              >
                <X size={22} color={COLORS.text} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* Menu Items */}
            <ScrollView style={styles.menuItems} showsVerticalScrollIndicator={false}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.drawerItem}
                    onPress={item.onPress}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuLeft}>
                      <Icon size={22} color={COLORS.text} strokeWidth={2} />
                      <Text style={styles.menuItemText}>{item.label}</Text>
                    </View>
                    {item.id === 'properties' && (
                      <TouchableOpacity
                        style={styles.menuAddBtn}
                        onPress={(e) => {
                          e.stopPropagation();
                          setMenuVisible(false);
                          router.push('/add-listing');
                        }}
                        activeOpacity={0.7}
                      >
                        <Plus size={18} color={COLORS.primary} strokeWidth={2.5} />
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Bottom Section: Settings, Help & Sign Out */}
            <View style={styles.menuBottomSection}>
              <View style={styles.menuDivider} />

              {secondaryMenuItems.map(item => {
                const Icon = item.icon;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.drawerItem}
                    onPress={item.onPress}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuLeft}>
                      <Icon size={22} color={COLORS.textSecondary} strokeWidth={2} />
                      <Text style={[styles.menuItemText, { color: COLORS.textSecondary }]}>{item.label}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}

              <View style={styles.menuDivider} />

              {/* Logout */}
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <View style={styles.menuLeft}>
                  <LogOut size={22} color={COLORS.danger} strokeWidth={2} />
                  <Text style={[styles.menuItemText, { color: COLORS.danger }]}>Sign Out</Text>
                </View>
              </TouchableOpacity>
            </View>
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
  contentDesktop: {
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 20,
  },
  headerDesktop: {
    paddingHorizontal: 0,
    justifyContent: 'flex-start',
    paddingTop: 24,
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

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionHeaderDesktop: { paddingHorizontal: 0 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, letterSpacing: -0.3 },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },

  propertyRow: { paddingHorizontal: 20, gap: 12, paddingBottom: 28 },
  propertyGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingBottom: 28,
  },
  propertyCard: {
    width: 220,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  propertyImageWrap: { width: '100%', height: 120, position: 'relative' },
  propertyImage: { width: '100%', height: '100%' },
  statusBadge: {
    position: 'absolute', top: 10, left: 10,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4,
  },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  propertyInfo: { padding: 12, gap: 4 },
  propertyTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text, lineHeight: 18 },
  propertyRent: { fontSize: 14, fontWeight: '800', color: COLORS.primary, marginTop: 2 },
  propertyMetrics: { flexDirection: 'row', gap: 14, marginTop: 4 },
  propertyMetricItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  propertyMetricText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  addPropertyCard: {
    width: 150,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 20,
  },
  addPropertyIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  addPropertyText: { fontSize: 12, fontWeight: '700', color: COLORS.primary, textAlign: 'center', paddingHorizontal: 12 },

  twoCol: { flexDirection: 'row', gap: 24, alignItems: 'flex-start' },
  colItem: { flex: 1 },

  listCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  listCardDesktop: { marginHorizontal: 0 },
  lastRow: { borderBottomWidth: 0 },

  leadRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  leadAvatar: { width: 44, height: 44, borderRadius: 22 },
  leadInfo: { flex: 1, gap: 2 },
  leadTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  leadName: { fontSize: 14, fontWeight: '700', color: COLORS.text, flex: 1 },
  leadTime: { fontSize: 11, color: COLORS.textSecondary, marginLeft: 8 },
  leadProperty: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  leadMessage: { fontSize: 12, color: COLORS.textSecondary },
  leadStatusBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start', marginTop: 2 },
  leadStatusText: { fontSize: 10, fontWeight: '700' },

  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  paymentIconWrap: {
    width: 38, height: 38, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  paymentInfo: { flex: 1, gap: 2 },
  paymentTenant: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  paymentProperty: { fontSize: 12, color: COLORS.textSecondary },
  paymentRight: { alignItems: 'flex-end', gap: 2 },
  paymentAmount: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  paymentStatus: { fontSize: 11, fontWeight: '700' },

  menuSection: { paddingHorizontal: 20, gap: 12 },
  menuSectionDesktop: { paddingHorizontal: 0, flexDirection: 'row' },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuItemDesktop: { flex: 1 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconWrap: {
    width: 42, height: 42, borderRadius: 12, backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { fontSize: 15, fontWeight: '600', color: COLORS.text },

  lockScreen: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 40, gap: 16,
  },
  lockIcon: {
    width: 84, height: 84, borderRadius: 28, backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  lockTitle: { fontSize: 24, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  lockSubtitle: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22 },
  signInBtn: {
    backgroundColor: COLORS.primary, borderRadius: 14,
    paddingVertical: 15, paddingHorizontal: 32, marginTop: 8,
  },
  signInBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },

  // Menu styles
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
    marginBottom: 2,
  },
  menuUserRole: {
    fontSize: 13,
    color: COLORS.textSecondary,
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
  menuBottomSection: {
    paddingBottom: Platform.OS === 'android' ? 16 : 24,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  menuAddBtn: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
    marginHorizontal: 20,
  },
});
