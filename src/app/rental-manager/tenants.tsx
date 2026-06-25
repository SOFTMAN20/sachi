import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Platform, Image, Alert, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft, Phone, Mail, MapPin, Calendar, AlertCircle,
  CheckCircle, Clock, DollarSign,
} from 'lucide-react-native';
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
  success: '#16A34A',
};

type TenantStatus = 'active' | 'pending' | 'former';
type PaymentStatus = 'paid' | 'due' | 'overdue';

const TENANT_STATUS_META: Record<TenantStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: COLORS.success, bg: COLORS.primaryLight },
  pending: { label: 'Pending', color: COLORS.secondary, bg: COLORS.secondaryLight },
  former: { label: 'Former', color: COLORS.textSecondary, bg: COLORS.bg },
};

const PAYMENT_STATUS_META: Record<PaymentStatus, { 
  label: string; color: string; bg: string; icon: typeof CheckCircle 
}> = {
  paid: { label: 'Paid', color: COLORS.success, bg: COLORS.primaryLight, icon: CheckCircle },
  due: { label: 'Due soon', color: COLORS.secondary, bg: COLORS.secondaryLight, icon: Clock },
  overdue: { label: 'Overdue', color: COLORS.danger, bg: COLORS.dangerLight, icon: AlertCircle },
};

const MOCK_TENANTS = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200',
    email: 'ahmed.hassan@email.com',
    phone: '+255 712 345 678',
    property: 'Modern 3BR Apartment in Masaki',
    rentAmount: 2500000,
    moveInDate: '01 Jan 2024',
    leaseEnd: '31 Dec 2024',
    status: 'active' as TenantStatus,
    paymentStatus: 'paid' as PaymentStatus,
  },
  {
    id: '2',
    name: 'Fatuma Mwangi',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200',
    email: 'fatuma.m@email.com',
    phone: '+255 755 789 012',
    property: 'Cozy 2BR in Mikocheni B',
    rentAmount: 750000,
    moveInDate: '15 Mar 2024',
    leaseEnd: '14 Mar 2025',
    status: 'active' as TenantStatus,
    paymentStatus: 'due' as PaymentStatus,
  },
  {
    id: '3',
    name: 'Grace Njoroge',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    email: 'grace.n@email.com',
    phone: '+255 767 234 567',
    property: 'Luxurious 2BR in Oyster Bay',
    rentAmount: 1800000,
    moveInDate: '01 Feb 2024',
    leaseEnd: '31 Jan 2025',
    status: 'active' as TenantStatus,
    paymentStatus: 'overdue' as PaymentStatus,
  },
  {
    id: '4',
    name: 'John Kimani',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200',
    email: 'john.k@email.com',
    phone: '+255 744 567 890',
    property: 'Studio Apartment in Masaki',
    rentAmount: 950000,
    moveInDate: '20 Jun 2024',
    leaseEnd: '19 Jun 2025',
    status: 'pending' as TenantStatus,
    paymentStatus: 'paid' as PaymentStatus,
  },
];

function formatTZS(amount: number) {
  return `TZS ${amount.toLocaleString('en-US')}`;
}

export default function TenantsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;
  const [activeTab, setActiveTab] = useState<'all' | TenantStatus>('all');

  const filteredTenants = activeTab === 'all' 
    ? MOCK_TENANTS 
    : MOCK_TENANTS.filter(t => t.status === activeTab);

  const handleContact = (tenant: typeof MOCK_TENANTS[0], method: 'call' | 'email') => {
    if (method === 'call') {
      Alert.alert('Call Tenant', `Call ${tenant.name} at ${tenant.phone}?`);
    } else {
      Alert.alert('Email Tenant', `Send email to ${tenant.email}?`);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={[styles.header, isDesktop && styles.rowDesktop]}>
        {isDesktop ? (
          <View style={styles.backBtn} />
        ) : (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color={COLORS.text} strokeWidth={2} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Tenants</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.tabsContainer, isDesktop && styles.rowDesktop]}
        >
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'all' && styles.tabActive]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
              All ({MOCK_TENANTS.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'active' && styles.tabActive]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
              Active ({MOCK_TENANTS.filter(t => t.status === 'active').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
            onPress={() => setActiveTab('pending')}
          >
            <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>
              Pending ({MOCK_TENANTS.filter(t => t.status === 'pending').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'former' && styles.tabActive]}
            onPress={() => setActiveTab('former')}
          >
            <Text style={[styles.tabText, activeTab === 'former' && styles.tabTextActive]}>
              Former ({MOCK_TENANTS.filter(t => t.status === 'former').length})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Tenants List */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
        showsVerticalScrollIndicator={false}
      >
        {filteredTenants.map(tenant => {
          const statusMeta = TENANT_STATUS_META[tenant.status];
          const paymentMeta = PAYMENT_STATUS_META[tenant.paymentStatus];
          const PaymentIcon = paymentMeta.icon;
          
          return (
            <View key={tenant.id} style={styles.tenantCard}>
              {/* Header */}
              <View style={styles.tenantHeader}>
                <Image source={{ uri: tenant.avatar }} style={styles.avatar} />
                <View style={styles.tenantInfo}>
                  <Text style={styles.tenantName}>{tenant.name}</Text>
                  <View style={styles.statusRow}>
                    <View style={[styles.statusBadge, { backgroundColor: statusMeta.bg }]}>
                      <Text style={[styles.statusText, { color: statusMeta.color }]}>
                        {statusMeta.label}
                      </Text>
                    </View>
                    <View style={[styles.paymentBadge, { backgroundColor: paymentMeta.bg }]}>
                      <PaymentIcon size={10} color={paymentMeta.color} strokeWidth={2.5} />
                      <Text style={[styles.paymentText, { color: paymentMeta.color }]}>
                        {paymentMeta.label}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Property Info */}
              <View style={styles.propertyInfo}>
                <MapPin size={14} color={COLORS.primary} strokeWidth={2} />
                <Text style={styles.propertyText}>{tenant.property}</Text>
              </View>

              {/* Rent & Lease Info */}
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <DollarSign size={14} color={COLORS.textSecondary} strokeWidth={2} />
                  <Text style={styles.infoLabel}>Rent</Text>
                  <Text style={styles.infoValue}>{formatTZS(tenant.rentAmount)}/mo</Text>
                </View>
                <View style={styles.infoItem}>
                  <Calendar size={14} color={COLORS.textSecondary} strokeWidth={2} />
                  <Text style={styles.infoLabel}>Lease End</Text>
                  <Text style={styles.infoValue}>{tenant.leaseEnd}</Text>
                </View>
              </View>

              {/* Contact Actions */}
              <View style={styles.actions}>
                <TouchableOpacity 
                  style={styles.actionBtn}
                  onPress={() => handleContact(tenant, 'call')}
                  activeOpacity={0.7}
                >
                  <Phone size={16} color={COLORS.primary} strokeWidth={2} />
                  <Text style={styles.actionText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionBtn}
                  onPress={() => handleContact(tenant, 'email')}
                  activeOpacity={0.7}
                >
                  <Mail size={16} color={COLORS.primary} strokeWidth={2} />
                  <Text style={styles.actionText}>Email</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 16,
    backgroundColor: COLORS.bg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  tabsWrapper: {
    backgroundColor: COLORS.bg,
    paddingVertical: 12,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scroll: { flex: 1 },
  content: { padding: 20, gap: 16 },
  contentDesktop: { width: '100%', maxWidth: 860, alignSelf: 'center', paddingHorizontal: 32 },
  rowDesktop: { width: '100%', maxWidth: 860, alignSelf: 'center', paddingHorizontal: 32 },
  tenantCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 14,
  },
  tenantHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  tenantInfo: {
    flex: 1,
    gap: 6,
  },
  tenantName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  paymentText: {
    fontSize: 11,
    fontWeight: '700',
  },
  propertyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
  },
  propertyText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    flex: 1,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    flex: 1,
    gap: 4,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
