import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Platform, Image, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Users, MessageCircle, Phone, Calendar } from 'lucide-react-native';
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

type LeadStatus = 'new' | 'contacted' | 'viewing_scheduled';

const LEAD_STATUS_META: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  new: { label: 'New', color: COLORS.secondary, bg: COLORS.secondaryLight },
  contacted: { label: 'Contacted', color: COLORS.blue, bg: COLORS.blueLight },
  viewing_scheduled: { label: 'Viewing set', color: '#16A34A', bg: COLORS.primaryLight },
};

const MOCK_LEADS = [
  {
    id: '1',
    name: 'Christina Mbatia',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    propertyTitle: 'Modern 3BR Apartment in Masaki',
    message: 'Is this still available? I can move in next week.',
    time: '12m ago',
    status: 'new' as LeadStatus,
  },
  {
    id: '2',
    name: 'Brian Otieno',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    propertyTitle: 'Luxurious 2BR in Oyster Bay',
    message: 'Would you consider a 1-year lease at this rate?',
    time: '1h ago',
    status: 'contacted' as LeadStatus,
  },
  {
    id: '3',
    name: 'Halima Said',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    propertyTitle: 'Cozy 2BR in Mikocheni B',
    message: 'Confirmed for a viewing this Saturday at 10am.',
    time: 'Yesterday',
    status: 'viewing_scheduled' as LeadStatus,
  },
  {
    id: '4',
    name: 'James Kimani',
    avatar: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=200',
    propertyTitle: 'Modern 3BR Apartment in Masaki',
    message: 'What utilities are included in the rent?',
    time: '2d ago',
    status: 'contacted' as LeadStatus,
  },
  {
    id: '5',
    name: 'Mary Wanjiku',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200',
    propertyTitle: 'Cozy Studio in Masaki',
    message: 'I\'m interested in viewing this property. When can I come?',
    time: '3d ago',
    status: 'new' as LeadStatus,
  },
];

export default function LeadsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;
  const [activeTab, setActiveTab] = useState<'all' | LeadStatus>('all');

  const filteredLeads = activeTab === 'all' 
    ? MOCK_LEADS 
    : MOCK_LEADS.filter(l => l.status === activeTab);

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
        <Text style={styles.title}>Leads</Text>
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
              All ({MOCK_LEADS.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'new' && styles.tabActive]}
            onPress={() => setActiveTab('new')}
          >
            <Text style={[styles.tabText, activeTab === 'new' && styles.tabTextActive]}>
              New ({MOCK_LEADS.filter(l => l.status === 'new').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'contacted' && styles.tabActive]}
            onPress={() => setActiveTab('contacted')}
          >
            <Text style={[styles.tabText, activeTab === 'contacted' && styles.tabTextActive]}>
              Contacted ({MOCK_LEADS.filter(l => l.status === 'contacted').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'viewing_scheduled' && styles.tabActive]}
            onPress={() => setActiveTab('viewing_scheduled')}
          >
            <Text style={[styles.tabText, activeTab === 'viewing_scheduled' && styles.tabTextActive]}>
              Scheduled ({MOCK_LEADS.filter(l => l.status === 'viewing_scheduled').length})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Leads List */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
        showsVerticalScrollIndicator={false}
      >
        {filteredLeads.map(lead => {
          const meta = LEAD_STATUS_META[lead.status];
          
          return (
            <View key={lead.id} style={styles.leadCard}>
              <View style={styles.leadHeader}>
                <Image source={{ uri: lead.avatar }} style={styles.avatar} />
                <View style={styles.leadInfo}>
                  <Text style={styles.leadName}>{lead.name}</Text>
                  <Text style={styles.leadTime}>{lead.time}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
                  <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
                </View>
              </View>
              
              <Text style={styles.propertyTitle}>{lead.propertyTitle}</Text>
              <Text style={styles.message}>{lead.message}</Text>
              
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                  <MessageCircle size={18} color={COLORS.primary} strokeWidth={2} />
                  <Text style={styles.actionText}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                  <Phone size={18} color={COLORS.primary} strokeWidth={2} />
                  <Text style={styles.actionText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                  <Calendar size={18} color={COLORS.primary} strokeWidth={2} />
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
  leadCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  leadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  leadInfo: {
    flex: 1,
  },
  leadName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  leadTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  propertyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  message: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
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
