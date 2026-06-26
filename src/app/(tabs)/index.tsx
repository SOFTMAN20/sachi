import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, FlatList, useWindowDimensions, Platform,
  Modal, Pressable, SafeAreaView,
} from 'react-native';
import { Search, Bell, SlidersHorizontal, MapPin, TrendingUp, X, Wallet } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { NEIGHBOURHOODS } from '@/data/mockData';
import PropertyCard from '@/components/PropertyCard';
import { PropertyType } from '@/types';

const DESKTOP_BREAKPOINT = 900;

const COLORS = {
  primary: '#1B6B3A',
  primaryLight: '#E8F5E9',
  secondary: '#F5A623',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  bg: '#F8F9FA',
  surface: '#FFFFFF',
};

const TYPE_FILTERS: { label: string; value: PropertyType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Apartments', value: 'apartment' },
  { label: 'Houses', value: 'house' },
  { label: 'Rooms', value: 'room' },
  { label: 'Hostels', value: 'hostel' },
  { label: 'Offices', value: 'office' },
];

const PRICE_RANGES = [
  { label: 'Any budget', min: 0, max: Infinity },
  { label: 'Under 300K', min: 0, max: 300000 },
  { label: '300K–800K', min: 300000, max: 800000 },
  { label: '800K–2M', min: 800000, max: 2000000 },
  { label: 'Above 2M', min: 2000000, max: Infinity },
];

export default function HomeScreen() {
  const { userRole, userName, isLoggedIn, properties } = useApp();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;
  const listBottomPad = Platform.OS === 'web' ? 24 : 80; // Add space for tabs on mobile
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<PropertyType | 'all'>('all');
  const [whereQuery, setWhereQuery] = useState('');
  const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const displayName = isLoggedIn && userName ? userName.split(' ')[0] : null;
  const greeting = displayName ? `Karibu, ${displayName}` : 'Karibu Sachi';

  const filtersActive = whereQuery.trim().length > 0 || selectedPriceIndex !== 0;

  const whereSuggestions = useMemo(() => {
    const q = whereQuery.trim().toLowerCase();
    return NEIGHBOURHOODS.filter(n => n !== 'All Areas' && n.toLowerCase().includes(q));
  }, [whereQuery]);

  const clearFilters = () => {
    setWhereQuery('');
    setSelectedPriceIndex(0);
  };

  const trendingProperties = useMemo(
    () => properties.filter(p => p.isTrending),
    [properties]
  );

  const filteredProperties = useMemo(() => {
    let list = properties;
    const priceRange = PRICE_RANGES[selectedPriceIndex];
    if (activeFilter !== 'all') {
      list = list.filter(p => p.propertyType === activeFilter);
    }
    if (whereQuery.trim()) {
      const wq = whereQuery.trim().toLowerCase();
      list = list.filter(p => p.neighbourhood.toLowerCase().includes(wq));
    }
    list = list.filter(p => p.monthlyRent >= priceRange.min && p.monthlyRent <= priceRange.max);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.neighbourhood.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeFilter, searchQuery, whereQuery, selectedPriceIndex, properties]);

  const isSearching = searchQuery.trim().length > 0;

  const renderCardList = (list: typeof properties) =>
    isDesktop ? (
      <View style={styles.grid}>
        {list.map(p => (
          <View key={p.id} style={styles.gridItem}>
            <PropertyCard property={p} />
          </View>
        ))}
      </View>
    ) : (
      list.map(p => <PropertyCard key={p.id} property={p} />)
    );

  return (
    <SafeAreaView style={styles.safe}>
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop, { paddingBottom: listBottomPad }]}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      stickyHeaderIndices={Platform.OS === 'web' ? [1] : undefined}
    >
        {/* Header */}
        <View style={[styles.header, isDesktop && styles.blockDesktop]}>
          <View>
            <Text style={styles.greeting}>{greeting} 👋</Text>
            <View style={styles.locationRow}>
              <MapPin size={13} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.locationText}>Dar es Salaam, Tanzania</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Bell size={22} color={COLORS.text} strokeWidth={1.8} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Search Bar — sticky on web only. On native it's a normal column child
            so it stretches to the safe-area width and keeps search + filter on one row. */}
        <View style={[styles.searchSection, isDesktop && styles.searchSectionDesktop]}>
          <View style={styles.searchBar}>
            <Search size={18} color={COLORS.textSecondary} strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search nyumba, area, neighbourhood..."
              placeholderTextColor={COLORS.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearSearch}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilters(true)}>
            <SlidersHorizontal size={20} color={COLORS.primary} strokeWidth={2} />
            {filtersActive && <View style={styles.filterBtnDot} />}
          </TouchableOpacity>
        </View>

        {/* Type filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
          style={[styles.filterRow, isDesktop && styles.blockDesktop]}
        >
          {TYPE_FILTERS.map(f => (
            <TouchableOpacity
              key={f.value}
              style={[styles.filterChip, activeFilter === f.value && styles.filterChipActive]}
              onPress={() => setActiveFilter(f.value)}
            >
              <Text style={[styles.filterChipText, activeFilter === f.value && styles.filterChipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {isSearching ? (
          /* Search results */
          <View style={[styles.section, isDesktop && styles.blockDesktop]}>
            <Text style={styles.sectionTitle}>
              {filteredProperties.length} result{filteredProperties.length !== 1 ? 's' : ''} for "{searchQuery}"
            </Text>
            {filteredProperties.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🔍</Text>
                <Text style={styles.emptyTitle}>Hakuna matokeo</Text>
                <Text style={styles.emptySubtitle}>No properties found for "{searchQuery}"</Text>
              </View>
            ) : (
              renderCardList(filteredProperties)
            )}
          </View>
        ) : (
          <>
            {/* Trending section */}
            <View style={[styles.section, isDesktop && styles.blockDesktop]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <TrendingUp size={16} color={COLORS.secondary} strokeWidth={2.5} />
                  <Text style={styles.sectionTitle}>Trending Now</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/explore')} activeOpacity={0.7}>
                  <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={trendingProperties}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={p => p.id}
                renderItem={({ item }) => <PropertyCard property={item} horizontal />}
                contentContainerStyle={styles.horizontalList}
                scrollEnabled
              />
            </View>

            {/* All listings */}
            <View style={[styles.section, isDesktop && styles.blockDesktop]}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {activeFilter === 'all' ? 'All Listings' : TYPE_FILTERS.find(f => f.value === activeFilter)?.label}
                </Text>
                <Text style={styles.sectionCount}>{filteredProperties.length} properties</Text>
              </View>

              {filteredProperties.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyEmoji}>🏠</Text>
                  <Text style={styles.emptyTitle}>Hakuna mali</Text>
                  <Text style={styles.emptySubtitle}>No properties available in this category</Text>
                </View>
              ) : (
                renderCardList(filteredProperties)
              )}
            </View>
          </>
        )}
    </ScrollView>

    <Modal
        visible={showFilters}
        animationType="slide"
        transparent
        statusBarTranslucent
        onRequestClose={() => setShowFilters(false)}
      >
        <Pressable style={[styles.overlay, isDesktop && styles.overlayDesktop]} onPress={() => setShowFilters(false)}>
          <Pressable style={[styles.sheet, isDesktop && styles.sheetDesktop]} onPress={e => e.stopPropagation()}>
            {!isDesktop && <View style={styles.sheetHandle} />}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Filters</Text>
              <TouchableOpacity style={styles.sheetCloseBtn} onPress={() => setShowFilters(false)}>
                <X size={18} color={COLORS.textSecondary} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.sheetScroll}>
              <Text style={styles.filterLabelText}>Type</Text>
              <View style={styles.chipWrap}>
                {TYPE_FILTERS.map(f => (
                  <TouchableOpacity
                    key={f.value}
                    style={[styles.chip, activeFilter === f.value && styles.chipActive]}
                    onPress={() => setActiveFilter(f.value)}
                  >
                    <Text style={[styles.chipText, activeFilter === f.value && styles.chipTextActive]}>
                      {f.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.filterLabelRow}>
                <MapPin size={13} color={COLORS.textSecondary} strokeWidth={2} />
                <Text style={[styles.filterLabelText, styles.filterLabelRowText]}>Where</Text>
              </View>
              <View style={styles.whereInputWrap}>
                <Search size={16} color={COLORS.textSecondary} strokeWidth={2} />
                <TextInput
                  style={styles.whereInput}
                  placeholder="Where to live?"
                  placeholderTextColor={COLORS.textSecondary}
                  value={whereQuery}
                  onChangeText={setWhereQuery}
                />
                {whereQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setWhereQuery('')}>
                    <Text style={styles.clearSearch}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.chipWrap}>
                {whereSuggestions.map(n => (
                  <TouchableOpacity
                    key={n}
                    style={[styles.chip, whereQuery === n && styles.chipActive]}
                    onPress={() => setWhereQuery(n)}
                  >
                    <Text style={[styles.chipText, whereQuery === n && styles.chipTextActive]}>
                      {n}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.filterLabelRow}>
                <Wallet size={13} color={COLORS.textSecondary} strokeWidth={2} />
                <Text style={[styles.filterLabelText, styles.filterLabelRowText]}>Budget</Text>
              </View>
              <View style={styles.chipWrap}>
                {PRICE_RANGES.map((pr, i) => (
                  <TouchableOpacity
                    key={pr.label}
                    style={[styles.chip, selectedPriceIndex === i && styles.chipActive]}
                    onPress={() => setSelectedPriceIndex(i)}
                  >
                    <Text style={[styles.chipText, selectedPriceIndex === i && styles.chipTextActive]}>
                      {pr.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.sheetFooter}>
              <TouchableOpacity onPress={clearFilters} style={styles.sheetClearBtn}>
                <Text style={styles.sheetClearText}>Clear all</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sheetApplyBtn}
                onPress={() => setShowFilters(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.sheetApplyText}>Show {filteredProperties.length} properties</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  content: {
    paddingBottom: 24,
  },
  contentDesktop: {
    alignItems: 'center',
    paddingTop: 12,
  },
  blockDesktop: {
    width: '100%',
    maxWidth: 1180,
  },
  searchSectionDesktop: {
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 16,
  },
  gridItem: {
    width: '31.5%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 16,
    backgroundColor: COLORS.bg,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginLeft: 4,
  },
  notifBtn: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
    borderWidth: 1.5,
    borderColor: COLORS.surface,
  },
  searchSection: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: COLORS.bg,
  },
  searchBar: {
    flex: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.text,
    paddingVertical: 0,
  },
  clearSearch: {
    fontSize: 14,
    color: COLORS.textSecondary,
    paddingHorizontal: 8,
  },
  filterBtn: {
    position: 'relative',
    flexShrink: 0,
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
  },
  filterRow: {
    backgroundColor: COLORS.bg,
    paddingBottom: 4,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  sectionCount: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  horizontalList: {
    paddingRight: 20,
    paddingBottom: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  // Filter sheet modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  overlayDesktop: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    maxHeight: '78%',
  },
  sheetDesktop: {
    width: '100%',
    maxWidth: 480,
    borderRadius: 24,
    paddingTop: 24,
    paddingBottom: 24,
    maxHeight: '85%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  sheetCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetScroll: {
    marginBottom: 8,
  },
  filterLabelText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  filterLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
    marginBottom: 10,
  },
  filterLabelRowText: {
    marginTop: 0,
    marginBottom: 0,
  },
  filterLabelRowSpaced: {
    marginTop: 20,
  },
  whereInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
    marginBottom: 12,
  },
  whereInput: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    color: COLORS.text,
    paddingVertical: 0,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  sheetFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  sheetClearBtn: {
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  sheetClearText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  sheetApplyBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  sheetApplyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
