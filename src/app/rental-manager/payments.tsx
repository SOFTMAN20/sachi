import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Platform, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft, CheckCircle2, Clock, AlertCircle, TrendingUp,
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
};

type PaymentStatus = 'paid' | 'due' | 'overdue';

const PAYMENT_STATUS_META: Record<PaymentStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  paid: { label: 'Paid', color: '#16A34A', bg: COLORS.primaryLight, icon: CheckCircle2 },
  due: { label: 'Due soon', color: COLORS.secondary, bg: COLORS.secondaryLight, icon: Clock },
  overdue: { label: 'Overdue', color: COLORS.danger, bg: COLORS.dangerLight, icon: AlertCircle },
};

const MOCK_PAYMENTS: {
  id: string; tenantName: string; propertyTitle: string; amount: number;
  dueDate: string; method: string; status: PaymentStatus;
}[] = [
  { id: 'p1', tenantName: 'Ahmed Hassan', propertyTitle: 'Modern 3BR Apartment in Masaki', amount: 2500000, dueDate: '01 Jul', method: 'M-Pesa', status: 'paid' },
  { id: 'p2', tenantName: 'Fatuma Mwangi', propertyTitle: 'Cozy 2BR in Mikocheni B', amount: 750000, dueDate: '03 Jul', method: 'Bank transfer', status: 'due' },
  { id: 'p3', tenantName: 'Grace Njoroge', propertyTitle: 'Luxurious 2BR in Oyster Bay', amount: 1800000, dueDate: '28 Jun', method: 'M-Pesa', status: 'overdue' },
  { id: 'p4', tenantName: 'David Mushi', propertyTitle: 'Cozy Studio in Masaki', amount: 600000, dueDate: '05 Jun', method: 'Tigo Pesa', status: 'paid' },
  { id: 'p5', tenantName: 'Salma Juma', propertyTitle: 'Modern 3BR Apartment in Masaki', amount: 2500000, dueDate: '01 Jun', method: 'Bank transfer', status: 'paid' },
];

function formatTZS(amount: number) {
  return `TZS ${amount.toLocaleString('en-US')}`;
}

export default function PaymentsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;
  const [activeTab, setActiveTab] = useState<'all' | PaymentStatus>('all');

  const filteredPayments = activeTab === 'all'
    ? MOCK_PAYMENTS
    : MOCK_PAYMENTS.filter(p => p.status === activeTab);

  const collected = MOCK_PAYMENTS.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const outstanding = MOCK_PAYMENTS.filter(p => p.status !== 'paid').reduce((s, p) => s + p.amount, 0);
  const overdueCount = MOCK_PAYMENTS.filter(p => p.status === 'overdue').length;

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
        <Text style={styles.title}>Payments</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, styles.summaryPrimary]}>
            <View style={styles.summaryIconWrap}>
              <TrendingUp size={18} color="#FFFFFF" strokeWidth={2} />
            </View>
            <Text style={styles.summaryLabel}>Collected this month</Text>
            <Text style={styles.summaryValue}>{formatTZS(collected)}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatTZS(outstanding)}</Text>
            <Text style={styles.statLabel}>Outstanding</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, overdueCount > 0 && { color: COLORS.danger }]}>{overdueCount}</Text>
            <Text style={styles.statLabel}>Overdue</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={[styles.tabsWrapper, isDesktop && styles.tabsWrapperDesktop]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.tabsContainer, isDesktop && styles.tabsContainerDesktop]}
          >
            {([
              { key: 'all', label: `All (${MOCK_PAYMENTS.length})` },
              { key: 'paid', label: `Paid (${MOCK_PAYMENTS.filter(p => p.status === 'paid').length})` },
              { key: 'due', label: `Due (${MOCK_PAYMENTS.filter(p => p.status === 'due').length})` },
              { key: 'overdue', label: `Overdue (${MOCK_PAYMENTS.filter(p => p.status === 'overdue').length})` },
            ] as const).map(tab => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Payments list */}
        <View style={styles.list}>
          {filteredPayments.map(payment => {
            const meta = PAYMENT_STATUS_META[payment.status];
            const Icon = meta.icon;
            return (
              <View key={payment.id} style={styles.paymentCard}>
                <View style={[styles.paymentIconWrap, { backgroundColor: meta.bg }]}>
                  <Icon size={20} color={meta.color} strokeWidth={2} />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentTenant} numberOfLines={1}>{payment.tenantName}</Text>
                  <Text style={styles.paymentProperty} numberOfLines={1}>{payment.propertyTitle}</Text>
                  <Text style={styles.paymentMethod}>{payment.method}</Text>
                </View>
                <View style={styles.paymentRight}>
                  <Text style={styles.paymentAmount}>{formatTZS(payment.amount)}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
                    <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
                  </View>
                  <Text style={styles.paymentDate}>
                    {payment.status === 'paid' ? `Paid ${payment.dueDate}` : `Due ${payment.dueDate}`}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
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
  scroll: { flex: 1 },
  content: { padding: 20, gap: 16 },
  contentDesktop: { width: '100%', maxWidth: 860, alignSelf: 'center', paddingHorizontal: 32 },
  rowDesktop: { width: '100%', maxWidth: 860, alignSelf: 'center', paddingHorizontal: 32 },

  summaryRow: { flexDirection: 'row' },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 18,
    gap: 6,
  },
  summaryPrimary: { backgroundColor: COLORS.primary },
  summaryIconWrap: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  summaryLabel: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  summaryValue: { fontSize: 24, color: '#FFFFFF', fontWeight: '800', letterSpacing: -0.5 },

  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  statValue: { fontSize: 18, fontWeight: '800', color: COLORS.text, letterSpacing: -0.3 },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },

  tabsWrapper: { marginHorizontal: -20 },
  tabsWrapperDesktop: { marginHorizontal: 0 },
  tabsContainer: { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
  tabsContainerDesktop: { paddingHorizontal: 0 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: '#FFFFFF' },

  list: { gap: 12 },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  paymentIconWrap: {
    width: 42, height: 42, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  paymentInfo: { flex: 1, gap: 2 },
  paymentTenant: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  paymentProperty: { fontSize: 12, color: COLORS.textSecondary },
  paymentMethod: { fontSize: 11, color: COLORS.primary, fontWeight: '600', marginTop: 2 },
  paymentRight: { alignItems: 'flex-end', gap: 4 },
  paymentAmount: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  statusBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 10, fontWeight: '700' },
  paymentDate: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
});
