import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Platform, Image, Modal, Pressable, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Menu, X, LayoutGrid, Building2, Plus, Inbox, User, Wallet,
  Users, TrendingUp, CheckCircle2, ChevronRight,
  MessageCircle, Phone, Calendar,
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
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

type LeadStage = 'new' | 'contacted' | 'viewing_scheduled' | 'closed';

const STAGE_META: Record<LeadStage, { label: string; color: string; bg: string }> = {
  new: { label: 'New', color: COLORS.secondary, bg: COLORS.secondaryLight },
  contacted: { label: 'Contacted', color: COLORS.blue, bg: COLORS.blueLight },
  viewing_scheduled: { label: 'Viewing set', color: '#9333EA', bg: '#F3E8FF' },
  closed: { label: 'Closed', color: '#16A34A', bg: COLORS.primaryLight },
};

const PIPELINE: { stage: LeadStage; count: number }[] = [
  { stage: 'new', count: 6 },
  { stage: 'contacted', count: 9 },
  { stage: 'viewing_scheduled', count: 5 },
  { stage: 'closed', count: 4 },
];

const totalLeads = PIPELINE.reduce((s, p) => s + p.count, 0);
const conversionRate = Math.round((PIPELINE.find(p => p.stage === 'closed')!.count / totalLeads) * 100);

const RECENT_LEADS: {
  id: string; name: string; avatar: string; propertyTitle: string;
  source: string; time: string; stage: LeadStage;
}[] = [
  {
    id: 'a1',
    name: 'Christina Mbatia',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    propertyTitle: 'Modern 3BR Apartment in Masaki',
    source: 'Sachi App',
    time: '12m ago',
    stage: 'new',
  },
  {
    id: 'a2',
    name: 'Brian Otieno',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    propertyTitle: 'Luxurious 2BR in Oyster Bay',
    source: 'Referral',
    time: '1h ago',
    stage: 'contacted',
  },
  {
    id: 'a3',
    name: 'Halima Said',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    propertyTitle: 'Cozy 2BR in Mikocheni B',
    source: 'Sachi App',
    time: 'Yesterday',
    stage: 'viewing_scheduled',
  },
];

function formatTZS(amount: number) {
  return `TZS ${amount.toLocaleString('en-US')}`;
}

export default function AgentDashboardScreen() {
  const router = useRouter();
  const { userName } = useApp();
  const [menuVisible, setMenuVisible] = useState(false);
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;

  const commissionEarned = 1450000;

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid, onPress: () => { setMenuVisible(false); } },
    { id: 'listings', label: 'My Listings', icon: Building2, onPress: () => { setMenuVisible(false); router.push('/agent-dashboard/listings'); } },
    { id: 'add', label: 'Add Listing', icon: Plus, onPress: () => { setMenuVisible(false); router.push('/add-listing'); } },
    { id: 'leads', label: 'Lead Inbox', icon: Inbox, onPress: () => { setMenuVisible(false); router.push('/agent-dashboard/lead-inbox'); } },
    { id: 'profile', label: 'Agent Profile', icon: User, onPress: () => { setMenuVisible(false); router.push('/agent-dashboard/profile'); } },
    { id: 'billing', label: 'Billing', icon: Wallet, onPress: () => { setMenuVisible(false); router.push('/agent-dashboard/billing'); } },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        {!isDesktop && (
          <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuVisible(true)} activeOpacity={0.7}>
            <Menu size={24} color={COLORS.text} strokeWidth={2} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Agent Dashboard</Text>
        {!isDesktop && <View style={styles.menuBtn} />}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
        showsVerticalScrollIndicator={false}
      >
        {/* KPI Grid */}
        <View style={[styles.kpiGrid, isDesktop && styles.kpiGridDesktop]}>
          <View style={[styles.kpiCard, isDesktop && styles.kpiCardDesktop]}>
            <View style={[styles.kpiIconWrap, { backgroundColor: COLORS.blueLight }]}>
              <Users size={18} color={COLORS.blue} strokeWidth={2} />
            </View>
            <Text style={styles.kpiValue}>{totalLeads}</Text>
            <Text style={styles.kpiLabel}>Total Leads</Text>
          </View>
          <View style={[styles.kpiCard, isDesktop && styles.kpiCardDesktop]}>
            <View style={[styles.kpiIconWrap, { backgroundColor: COLORS.primaryLight }]}>
              <TrendingUp size={18} color={COLORS.primary} strokeWidth={2} />
            </View>
            <Text style={styles.kpiValue}>{conversionRate}%</Text>
            <Text style={styles.kpiLabel}>Conversion Rate</Text>
          </View>
          <View style={[styles.kpiCard, isDesktop && styles.kpiCardDesktop]}>
            <View style={[styles.kpiIconWrap, { backgroundColor: '#F3E8FF' }]}>
              <CheckCircle2 size={18} color="#9333EA" strokeWidth={2} />
            </View>
            <Text style={styles.kpiValue}>{PIPELINE.find(p => p.stage === 'closed')!.count}</Text>
            <Text style={styles.kpiLabel}>Deals Closed</Text>
          </View>
          <View style={[styles.kpiCard, isDesktop && styles.kpiCardDesktop]}>
            <View style={[styles.kpiIconWrap, { backgroundColor: COLORS.secondaryLight }]}>
              <Wallet size={18} color={COLORS.secondary} strokeWidth={2} />
            </View>
            <Text style={styles.kpiValue} numberOfLines={1}>{formatTZS(commissionEarned)}</Text>
            <Text style={styles.kpiLabel}>Commission Earned</Text>
          </View>
        </View>

        {/* Pipeline */}
        <Text style={styles.sectionTitle}>Lead Pipeline</Text>
        <View style={styles.pipelineCard}>
          {PIPELINE.map(p => {
            const meta = STAGE_META[p.stage];
            const pct = Math.round((p.count / totalLeads) * 100);
            return (
              <View key={p.stage} style={styles.pipelineRow}>
                <View style={styles.pipelineLabelRow}>
                  <View style={[styles.pipelineDot, { backgroundColor: meta.color }]} />
                  <Text style={styles.pipelineLabel}>{meta.label}</Text>
                  <Text style={styles.pipelineCount}>{p.count}</Text>
                </View>
                <View style={styles.pipelineBarTrack}>
                  <View style={[styles.pipelineBarFill, { width: `${pct}%`, backgroundColor: meta.color }]} />
                </View>
              </View>
            );
          })}
        </View>

        {/* Recent Leads */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Leads</Text>
          <TouchableOpacity onPress={() => router.push('/agent-dashboard/lead-inbox')} activeOpacity={0.7}>
            <ChevronRight size={20} color={COLORS.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.list}>
          {RECENT_LEADS.map(lead => {
            const meta = STAGE_META[lead.stage];
            return (
              <View key={lead.id} style={styles.leadCard}>
                <View style={styles.leadHeader}>
                  <Image source={{ uri: lead.avatar }} style={styles.avatar} />
                  <View style={styles.leadInfo}>
                    <Text style={styles.leadName}>{lead.name}</Text>
                    <Text style={styles.leadTime}>{lead.source} · {lead.time}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
                    <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
                  </View>
                </View>

                <Text style={styles.propertyTitle}>{lead.propertyTitle}</Text>

                <View style={styles.actions}>
                  <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                    <MessageCircle size={16} color={COLORS.primary} strokeWidth={2} />
                    <Text style={styles.actionText}>Message</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                    <Phone size={16} color={COLORS.primary} strokeWidth={2} />
                    <Text style={styles.actionText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                    <Calendar size={16} color={COLORS.primary} strokeWidth={2} />
                    <Text style={styles.actionText}>Schedule</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
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
                <Text style={styles.menuUserName}>{userName || 'Agent'}</Text>
                <Text style={styles.menuUserRole}>Manage your listings and leads</Text>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setMenuVisible(false)} activeOpacity={0.7}>
                <X size={22} color={COLORS.text} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.menuItems} showsVerticalScrollIndicator={false}>
              {menuItems.map(item => {
                const Icon = item.icon;
                const isActive = item.id === 'overview';
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.drawerItem, isActive && styles.drawerItemActive]}
                    onPress={item.onPress}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuLeft}>
                      <Icon size={20} color={isActive ? '#FFFFFF' : COLORS.text} strokeWidth={2} />
                      <Text style={[styles.menuItemText, isActive && { color: '#FFFFFF' }]}>{item.label}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
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
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.text, letterSpacing: -0.5 },
  scroll: { flex: 1 },
  content: { padding: 20, paddingTop: 4, gap: 16, paddingBottom: 40 },
  contentDesktop: { width: '100%', maxWidth: 1100, alignSelf: 'center', paddingHorizontal: 32 },

  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  kpiGridDesktop: { flexWrap: 'nowrap' },
  kpiCard: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  kpiCardDesktop: { flex: 1, width: undefined },
  kpiIconWrap: {
    width: 36, height: 36, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 2,
  },
  kpiValue: { fontSize: 18, fontWeight: '800', color: COLORS.text, letterSpacing: -0.3 },
  kpiLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, letterSpacing: -0.3, marginTop: 4 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },

  pipelineCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 14,
  },
  pipelineRow: { gap: 6 },
  pipelineLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pipelineDot: { width: 8, height: 8, borderRadius: 4 },
  pipelineLabel: { flex: 1, fontSize: 13, fontWeight: '600', color: COLORS.text },
  pipelineCount: { fontSize: 13, fontWeight: '800', color: COLORS.text },
  pipelineBarTrack: {
    height: 6, borderRadius: 3, backgroundColor: COLORS.bg, overflow: 'hidden',
  },
  pipelineBarFill: { height: '100%', borderRadius: 3 },

  list: { gap: 12 },
  leadCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  leadHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  leadInfo: { flex: 1 },
  leadName: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  leadTime: { fontSize: 12, color: COLORS.textSecondary },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: '700' },
  propertyTitle: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
  actions: { flexDirection: 'row', gap: 10, marginTop: 2 },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 9, borderRadius: 10, backgroundColor: COLORS.primaryLight,
  },
  actionText: { fontSize: 12, fontWeight: '600', color: COLORS.primary },

  // Drawer menu
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  menuDrawer: {
    width: '78%',
    maxWidth: 300,
    height: '100%',
    backgroundColor: COLORS.surface,
    paddingTop: Platform.OS === 'android' ? 48 : 60,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuUserName: { fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  menuUserRole: { fontSize: 12, color: COLORS.textSecondary, maxWidth: 180 },
  closeBtn: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  menuItems: { flex: 1, paddingTop: 8, paddingHorizontal: 12 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 12,
    marginBottom: 4,
  },
  drawerItemActive: { backgroundColor: COLORS.primary },
  menuItemText: { fontSize: 15, fontWeight: '600', color: COLORS.text },
});
