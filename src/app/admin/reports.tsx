import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Platform, Image, TextInput, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft, Search, AlertCircle, Flag, User, Building2, MessageSquare, X, CheckCircle, Clock,
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';

const DESKTOP_BREAKPOINT = 900;

const COLORS = {
  primary: '#1B6B3A',
  primaryLight: '#E8F5E9',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  bg: '#F8F9FA',
  surface: '#FFFFFF',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  success: '#16A34A',
};

type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed';
type ReportCategory = 'property' | 'user' | 'content' | 'fraud';

const STATUS_META: Record<ReportStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: COLORS.warning, bg: COLORS.warningLight },
  reviewing: { label: 'Under Review', color: '#2563EB', bg: '#E0F2FE' },
  resolved: { label: 'Resolved', color: COLORS.success, bg: COLORS.primaryLight },
  dismissed: { label: 'Dismissed', color: COLORS.textSecondary, bg: COLORS.bg },
};

const CATEGORY_META: Record<ReportCategory, { label: string; icon: any }> = {
  property: { label: 'Property Issue', icon: Building2 },
  user: { label: 'User Report', icon: User },
  content: { label: 'Content Violation', icon: MessageSquare },
  fraud: { label: 'Fraud Alert', icon: AlertCircle },
};

const MOCK_REPORTS = [
  {
    id: '1',
    category: 'property' as ReportCategory,
    title: 'Misleading property photos',
    description: 'Photos shown do not match the actual property condition',
    reportedBy: 'John Kimani',
    reportedItem: 'Modern 2BR Apartment',
    status: 'pending' as ReportStatus,
    date: '18 Mar 2024',
    priority: 'high',
  },
  {
    id: '2',
    category: 'user' as ReportCategory,
    title: 'Harassment in messages',
    description: 'User sending inappropriate messages to multiple tenants',
    reportedBy: 'Sarah Ahmed',
    reportedItem: 'User: Mark Johnson',
    status: 'reviewing' as ReportStatus,
    date: '17 Mar 2024',
    priority: 'critical',
  },
  {
    id: '3',
    category: 'fraud' as ReportCategory,
    title: 'Payment scam attempt',
    description: 'Requesting payment outside platform',
    reportedBy: 'Grace Njoroge',
    reportedItem: 'Luxury Villa listing',
    status: 'resolved' as ReportStatus,
    date: '15 Mar 2024',
    priority: 'critical',
  },
  {
    id: '4',
    category: 'content' as ReportCategory,
    title: 'Inappropriate listing description',
    description: 'Contains discriminatory language',
    reportedBy: 'Ahmed Hassan',
    reportedItem: 'Studio Apartment',
    status: 'dismissed' as ReportStatus,
    date: '14 Mar 2024',
    priority: 'low',
  },
];

export default function AdminReportsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;
  const { userRole } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | ReportStatus>('all');

  if (userRole !== 'admin') {
    router.back();
    return null;
  }

  const filteredReports = MOCK_REPORTS.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || report.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: MOCK_REPORTS.length,
    pending: MOCK_REPORTS.filter(r => r.status === 'pending').length,
    reviewing: MOCK_REPORTS.filter(r => r.status === 'reviewing').length,
    resolved: MOCK_REPORTS.filter(r => r.status === 'resolved').length,
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color={COLORS.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Reports</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: COLORS.warning }]}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: '#2563EB' }]}>{stats.reviewing}</Text>
          <Text style={styles.statLabel}>Reviewing</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: COLORS.success }]}>{stats.resolved}</Text>
          <Text style={styles.statLabel}>Resolved</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={18} color={COLORS.textSecondary} strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reports..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color={COLORS.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'all' && styles.tabActive]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
              All ({stats.total})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
            onPress={() => setActiveTab('pending')}
          >
            <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>
              Pending ({stats.pending})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'reviewing' && styles.tabActive]}
            onPress={() => setActiveTab('reviewing')}
          >
            <Text style={[styles.tabText, activeTab === 'reviewing' && styles.tabTextActive]}>
              Reviewing ({stats.reviewing})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'resolved' && styles.tabActive]}
            onPress={() => setActiveTab('resolved')}
          >
            <Text style={[styles.tabText, activeTab === 'resolved' && styles.tabTextActive]}>
              Resolved ({stats.resolved})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Reports List */}
      <ScrollView 
        style={styles.scroll}
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
        showsVerticalScrollIndicator={false}
      >
        <View style={isDesktop ? styles.gridContainer : undefined}>
        {filteredReports.map(report => {
          const statusMeta = STATUS_META[report.status];
          const categoryMeta = CATEGORY_META[report.category];
          const CategoryIcon = categoryMeta.icon;
          
          return (
            <TouchableOpacity key={report.id} style={styles.reportCard} activeOpacity={0.9}>
              <View style={styles.reportHeader}>
                <View style={styles.categoryBadge}>
                  <CategoryIcon size={14} color={COLORS.danger} strokeWidth={2} />
                  <Text style={styles.categoryText}>{categoryMeta.label}</Text>
                </View>
                {report.priority === 'critical' && (
                  <View style={styles.priorityBadge}>
                    <Flag size={10} color='#FFFFFF' strokeWidth={2.5} fill='#FFFFFF' />
                  </View>
                )}
              </View>

              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportDescription} numberOfLines={2}>
                {report.description}
              </Text>

              <View style={styles.reportMeta}>
                <Text style={styles.metaText}>Reported by: {report.reportedBy}</Text>
                <Text style={styles.metaText}>Item: {report.reportedItem}</Text>
              </View>

              <View style={styles.reportFooter}>
                <View style={[styles.statusBadge, { backgroundColor: statusMeta.bg }]}>
                  <Text style={[styles.statusText, { color: statusMeta.color }]}>
                    {statusMeta.label}
                  </Text>
                </View>
                <View style={styles.dateContainer}>
                  <Clock size={12} color={COLORS.textSecondary} strokeWidth={2} />
                  <Text style={styles.dateText}>{report.date}</Text>
                </View>
              </View>

              {report.status === 'pending' && (
                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.reviewBtn} activeOpacity={0.8}>
                    <Text style={styles.reviewBtnText}>Start Review</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dismissBtn} activeOpacity={0.8}>
                    <Text style={styles.dismissBtnText}>Dismiss</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
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
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.text,
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
  content: { padding: 20, gap: 12 },
  contentDesktop: { alignItems: 'center' },
  gridContainer: { 
    width: '100%', 
    maxWidth: 1200, 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 12,
  },
  reportCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
    ...(Platform.OS === 'web' ? { flex: 1, minWidth: 350, maxWidth: 580 } : {}),
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.dangerLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.danger,
  },
  priorityBadge: {
    backgroundColor: COLORS.danger,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  reportDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  reportMeta: {
    gap: 4,
    paddingTop: 4,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  reviewBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  reviewBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dismissBtn: {
    flex: 1,
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dismissBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
});
