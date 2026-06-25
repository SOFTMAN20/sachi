import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Platform, Image, TextInput, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft, Search, MapPin, DollarSign, Eye, Clock, CheckCircle, AlertCircle, X,
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
  blue: '#2563EB',
  blueLight: '#E0F2FE',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  success: '#16A34A',
  warning: '#F59E0B',
};

type PropertyStatus = 'active' | 'pending' | 'rejected' | 'suspended';

const STATUS_META: Record<PropertyStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: COLORS.success, bg: COLORS.primaryLight },
  pending: { label: 'Pending Review', color: COLORS.warning, bg: '#FEF3C7' },
  rejected: { label: 'Rejected', color: COLORS.danger, bg: COLORS.dangerLight },
  suspended: { label: 'Suspended', color: COLORS.danger, bg: COLORS.dangerLight },
};

const MOCK_PROPERTIES = [
  {
    id: '1',
    title: 'Modern 2BR Apartment in Masaki',
    image: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 800000,
    location: 'Masaki, Dar es Salaam',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    status: 'active' as PropertyStatus,
    views: 342,
    owner: 'Ahmed Hassan',
    listedDate: '15 Jan 2024',
    verified: true,
  },
  {
    id: '2',
    title: 'Spacious Villa with Garden',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 2500000,
    location: 'Mikocheni, Dar es Salaam',
    type: 'House',
    bedrooms: 4,
    bathrooms: 3,
    status: 'pending' as PropertyStatus,
    views: 89,
    owner: 'Grace Njoroge',
    listedDate: '05 Mar 2024',
    verified: false,
  },
  {
    id: '3',
    title: 'Affordable Studio in Kinondoni',
    image: 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 350000,
    location: 'Kinondoni, Dar es Salaam',
    type: 'Studio',
    bedrooms: 1,
    bathrooms: 1,
    status: 'active' as PropertyStatus,
    views: 567,
    owner: 'John Kimani',
    listedDate: '28 Feb 2024',
    verified: true,
  },
  {
    id: '4',
    title: 'Luxury Penthouse Sea View',
    image: 'https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 4500000,
    location: 'Oyster Bay, Dar es Salaam',
    type: 'Apartment',
    bedrooms: 3,
    bathrooms: 3,
    status: 'rejected' as PropertyStatus,
    views: 123,
    owner: 'Fatuma Mwangi',
    listedDate: '12 Feb 2024',
    verified: false,
  },
];

export default function AdminPropertiesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;
  const { userRole } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | PropertyStatus>('all');

  if (userRole !== 'admin') {
    router.back();
    return null;
  }

  const filteredProperties = MOCK_PROPERTIES.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || property.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: MOCK_PROPERTIES.length,
    active: MOCK_PROPERTIES.filter(p => p.status === 'active').length,
    pending: MOCK_PROPERTIES.filter(p => p.status === 'pending').length,
    rejected: MOCK_PROPERTIES.filter(p => p.status === 'rejected').length,
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
        <Text style={styles.title}>Properties</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: COLORS.success }]}>{stats.active}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: COLORS.warning }]}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: COLORS.danger }]}>{stats.rejected}</Text>
          <Text style={styles.statLabel}>Rejected</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={18} color={COLORS.textSecondary} strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search properties..."
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
            style={[styles.tab, activeTab === 'active' && styles.tabActive]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
              Active ({stats.active})
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
            style={[styles.tab, activeTab === 'rejected' && styles.tabActive]}
            onPress={() => setActiveTab('rejected')}
          >
            <Text style={[styles.tabText, activeTab === 'rejected' && styles.tabTextActive]}>
              Rejected ({stats.rejected})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Properties List */}
      <ScrollView 
        style={styles.scroll}
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
        showsVerticalScrollIndicator={false}
      >
        <View style={isDesktop ? styles.gridContainer : undefined}>
        {filteredProperties.map(property => {
          const statusMeta = STATUS_META[property.status];
          
          return (
            <TouchableOpacity key={property.id} style={styles.propertyCard} activeOpacity={0.9}>
              <Image source={{ uri: property.image }} style={styles.propertyImage} />
              
              <View style={styles.propertyContent}>
                <View style={styles.propertyHeader}>
                  <Text style={styles.propertyTitle} numberOfLines={2}>{property.title}</Text>
                  {property.verified && (
                    <CheckCircle size={16} color={COLORS.blue} fill={COLORS.blueLight} strokeWidth={2} />
                  )}
                </View>

                <View style={styles.locationRow}>
                  <MapPin size={14} color={COLORS.textSecondary} strokeWidth={2} />
                  <Text style={styles.locationText}>{property.location}</Text>
                </View>

                <View style={styles.detailsRow}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{property.type}</Text>
                  </View>
                  <Text style={styles.detailText}>{property.bedrooms} Bed</Text>
                  <Text style={styles.detailText}>{property.bathrooms} Bath</Text>
                </View>

                <View style={styles.priceRow}>
                  <View style={styles.priceContainer}>
                    <DollarSign size={16} color={COLORS.primary} strokeWidth={2.5} />
                    <Text style={styles.price}>
                      {(property.price / 1000).toFixed(0)}K/mo
                    </Text>
                  </View>
                  <View style={styles.viewsContainer}>
                    <Eye size={14} color={COLORS.textSecondary} strokeWidth={2} />
                    <Text style={styles.viewsText}>{property.views}</Text>
                  </View>
                </View>

                <View style={styles.statusRow}>
                  <View style={[styles.statusBadge, { backgroundColor: statusMeta.bg }]}>
                    <Text style={[styles.statusText, { color: statusMeta.color }]}>
                      {statusMeta.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>Owner: {property.owner}</Text>
                  <View style={styles.dateContainer}>
                    <Clock size={12} color={COLORS.textSecondary} strokeWidth={2} />
                    <Text style={styles.dateText}>{property.listedDate}</Text>
                  </View>
                </View>

                {property.status === 'pending' && (
                  <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.approveBtn} activeOpacity={0.8}>
                      <CheckCircle size={16} color='#FFFFFF' strokeWidth={2} />
                      <Text style={styles.approveBtnText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rejectBtn} activeOpacity={0.8}>
                      <AlertCircle size={16} color='#FFFFFF' strokeWidth={2} />
                      <Text style={styles.rejectBtnText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
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
  content: { padding: 20, gap: 16 },
  contentDesktop: { alignItems: 'center' },
  gridContainer: { 
    width: '100%', 
    maxWidth: 1200, 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 16,
  },
  propertyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...(Platform.OS === 'web' ? { flex: 1, minWidth: 350, maxWidth: 580 } : {}),
  },
  propertyImage: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.bg,
  },
  propertyContent: {
    padding: 14,
    gap: 10,
  },
  propertyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  propertyTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 22,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  statusRow: {
    paddingTop: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
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
    marginTop: 6,
  },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.success,
    borderRadius: 12,
    paddingVertical: 12,
  },
  approveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.danger,
    borderRadius: 12,
    paddingVertical: 12,
  },
  rejectBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
