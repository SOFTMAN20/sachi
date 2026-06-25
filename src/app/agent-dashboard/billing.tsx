import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft, Wallet, TrendingUp, CheckCircle2, Clock, ArrowDownToLine,
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
  danger: '#DC2626',
};

type CommissionStatus = 'paid' | 'pending';

const COMMISSION_STATUS_META: Record<CommissionStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  paid: { label: 'Paid', color: '#16A34A', bg: COLORS.primaryLight, icon: CheckCircle2 },
  pending: { label: 'Pending', color: COLORS.secondary, bg: COLORS.secondaryLight, icon: Clock },
};

const MOCK_COMMISSIONS: {
  id: string; propertyTitle: string; clientName: string; amount: number;
  date: string; status: CommissionStatus;
}[] = [
  { id: 'c1', propertyTitle: 'Modern 3BR Apartment in Masaki', clientName: 'James Kimani', amount: 375000, date: '20 Jun', status: 'paid' },
  { id: 'c2', propertyTitle: 'Cozy 2BR in Mikocheni B', clientName: 'Halima Said', amount: 112500, date: '15 Jun', status: 'pending' },
  { id: 'c3', propertyTitle: 'Luxurious 2BR in Oyster Bay', clientName: 'Grace Njoroge', amount: 270000, date: '02 Jun', status: 'paid' },
  { id: 'c4', propertyTitle: 'Cozy Studio in Masaki', clientName: 'David Mushi', amount: 90000, date: '28 May', status: 'paid' },
];

function formatTZS(amount: number) {
  return `TZS ${amount.toLocaleString('en-US')}`;
}

export default function BillingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;

  const totalEarned = MOCK_COMMISSIONS.filter(c => c.status === 'paid').reduce((s, c) => s + c.amount, 0);
  const pendingAmount = MOCK_COMMISSIONS.filter(c => c.status === 'pending').reduce((s, c) => s + c.amount, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <ChevronLeft size={24} color={COLORS.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Billing</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconWrap}>
            <Wallet size={18} color="#FFFFFF" strokeWidth={2} />
          </View>
          <Text style={styles.summaryLabel}>Total Commission Earned</Text>
          <Text style={styles.summaryValue}>{formatTZS(totalEarned)}</Text>
          <TouchableOpacity style={styles.payoutBtn} activeOpacity={0.85}>
            <ArrowDownToLine size={15} color={COLORS.primary} strokeWidth={2} />
            <Text style={styles.payoutBtnText}>Request Payout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: COLORS.secondary }]}>{formatTZS(pendingAmount)}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{MOCK_COMMISSIONS.length}</Text>
            <Text style={styles.statLabel}>Total Deals</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Commission History</Text>
        <View style={styles.list}>
          {MOCK_COMMISSIONS.map(c => {
            const meta = COMMISSION_STATUS_META[c.status];
            const Icon = meta.icon;
            return (
              <View key={c.id} style={styles.commissionCard}>
                <View style={[styles.commissionIconWrap, { backgroundColor: meta.bg }]}>
                  <Icon size={18} color={meta.color} strokeWidth={2} />
                </View>
                <View style={styles.commissionInfo}>
                  <Text style={styles.commissionProperty} numberOfLines={1}>{c.propertyTitle}</Text>
                  <Text style={styles.commissionClient}>{c.clientName} · {c.date}</Text>
                </View>
                <View style={styles.commissionRight}>
                  <Text style={styles.commissionAmount}>{formatTZS(c.amount)}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
                    <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
                  </View>
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
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 48 : 16, paddingBottom: 16,
    backgroundColor: COLORS.bg,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.text, letterSpacing: -0.5 },
  scroll: { flex: 1 },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  contentDesktop: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 32 },

  summaryCard: { backgroundColor: COLORS.primary, borderRadius: 18, padding: 20, gap: 6 },
  summaryIconWrap: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  summaryLabel: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  summaryValue: { fontSize: 26, color: '#FFFFFF', fontWeight: '800', letterSpacing: -0.5 },
  payoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#FFFFFF', borderRadius: 12, paddingVertical: 12, marginTop: 10,
  },
  payoutBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },

  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: COLORS.border, gap: 4,
  },
  statValue: { fontSize: 17, fontWeight: '800', color: COLORS.text, letterSpacing: -0.3 },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, letterSpacing: -0.2 },
  list: { gap: 12 },
  commissionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.surface, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  commissionIconWrap: {
    width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  commissionInfo: { flex: 1, gap: 2 },
  commissionProperty: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  commissionClient: { fontSize: 12, color: COLORS.textSecondary },
  commissionRight: { alignItems: 'flex-end', gap: 4 },
  commissionAmount: { fontSize: 14, fontWeight: '800', color: COLORS.text },
  statusBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 10, fontWeight: '700' },
});
