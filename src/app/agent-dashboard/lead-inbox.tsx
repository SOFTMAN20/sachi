import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Platform, Image, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, MessageCircle, Phone, Calendar } from 'lucide-react-native';
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
};

type LeadStage = 'new' | 'contacted' | 'viewing_scheduled' | 'closed';

const STAGE_META: Record<LeadStage, { label: string; color: string; bg: string }> = {
  new: { label: 'New', color: COLORS.secondary, bg: COLORS.secondaryLight },
  contacted: { label: 'Contacted', color: COLORS.blue, bg: COLORS.blueLight },
  viewing_scheduled: { label: 'Viewing set', color: '#9333EA', bg: '#F3E8FF' },
  closed: { label: 'Closed', color: '#16A34A', bg: COLORS.primaryLight },
};

const MOCK_LEADS: {
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
  {
    id: 'a4',
    name: 'James Kimani',
    avatar: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=200',
    propertyTitle: 'Modern 3BR Apartment in Masaki',
    source: 'Walk-in',
    time: '2d ago',
    stage: 'closed',
  },
  {
    id: 'a5',
    name: 'Mary Wanjiku',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200',
    propertyTitle: 'Cozy Studio in Masaki',
    source: 'Sachi App',
    time: '3d ago',
    stage: 'new',
  },
];

export default function LeadInboxScreen() {
  const router = useRouter();
  const [activeStage, setActiveStage] = useState<'all' | LeadStage>('all');
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;

  const stages: LeadStage[] = ['new', 'contacted', 'viewing_scheduled', 'closed'];

  const filteredLeads = activeStage === 'all'
    ? MOCK_LEADS
    : MOCK_LEADS.filter(l => l.stage === activeStage);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <ChevronLeft size={24} color={COLORS.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Lead Inbox</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeStage === 'all' && styles.tabActive]}
            onPress={() => setActiveStage('all')}
          >
            <Text style={[styles.tabText, activeStage === 'all' && styles.tabTextActive]}>
              All ({MOCK_LEADS.length})
            </Text>
          </TouchableOpacity>
          {stages.map(stage => (
            <TouchableOpacity
              key={stage}
              style={[styles.tab, activeStage === stage && styles.tabActive]}
              onPress={() => setActiveStage(stage)}
            >
              <Text style={[styles.tabText, activeStage === stage && styles.tabTextActive]}>
                {STAGE_META[stage].label} ({MOCK_LEADS.filter(l => l.stage === stage).length})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
        showsVerticalScrollIndicator={false}
      >
        {filteredLeads.map(lead => {
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
    width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.text, letterSpacing: -0.5 },
  tabsWrapper: { backgroundColor: COLORS.bg, paddingVertical: 12 },
  tabsContainer: { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
  tab: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
  },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: '#FFFFFF' },
  scroll: { flex: 1 },
  content: { padding: 20, gap: 16 },
  contentDesktop: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 32 },
  leadCard: {
    backgroundColor: COLORS.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: COLORS.border, gap: 10,
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
});
