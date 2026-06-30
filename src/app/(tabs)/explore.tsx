import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Platform, Modal, Pressable, useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import { Search, X, SlidersHorizontal, LayoutGrid, Building2, Home, BedDouble, Hotel, Briefcase } from 'lucide-react-native';
import { NEIGHBOURHOODS } from '@/data/mockData';
import PropertyCard from '@/components/PropertyCard';
import BottomSheet from '@/components/BottomSheet';
import { useApp } from '@/context/AppContext';
import { PropertyType } from '@/types';

const DESKTOP_BREAKPOINT = 900;

const COLORS = {
  primary: '#1B6B3A',
  primaryLight: '#E8F5E9',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  bg: '#F8F9FA',
  surface: '#FFFFFF',
  secondary: '#F5A623',
};

const PRICE_RANGES = [
  { label: 'Any budget', min: 0, max: Infinity },
  { label: 'Under 300K', min: 0, max: 300000 },
  { label: '300K–800K', min: 300000, max: 800000 },
  { label: '800K–2M', min: 800000, max: 2000000 },
  { label: 'Above 2M', min: 2000000, max: Infinity },
];

const TYPE_OPTIONS: { label: string; value: PropertyType | 'all' }[] = [
  { label: 'All Types', value: 'all' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'House', value: 'house' },
  { label: 'Room', value: 'room' },
  { label: 'Hostel', value: 'hostel' },
  { label: 'Office', value: 'office' },
];

// Airbnb-style category bar shown under the search pill.
const CATEGORIES: { label: string; value: PropertyType | 'all'; icon: React.FC<any> }[] = [
  { label: 'All', value: 'all', icon: LayoutGrid },
  { label: 'Apartments', value: 'apartment', icon: Building2 },
  { label: 'Houses', value: 'house', icon: Home },
  { label: 'Rooms', value: 'room', icon: BedDouble },
  { label: 'Hostels', value: 'hostel', icon: Hotel },
  { label: 'Offices', value: 'office', icon: Briefcase },
];

export default function ExploreScreen() {
  const { properties } = useApp();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;
  const listBottomPad = Platform.OS === 'web' ? 120 : 0;
  const [search, setSearch] = useState('');
  const [whereQuery, setWhereQuery] = useState('');
  const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);
  const [selectedType, setSelectedType] = useState<PropertyType | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtersActive = whereQuery.trim().length > 0 || selectedPriceIndex !== 0 || selectedType !== 'all';

  const whereSuggestions = useMemo(() => {
    const q = whereQuery.trim().toLowerCase();
    return NEIGHBOURHOODS.filter(n => n !== 'All Areas' && n.toLowerCase().includes(q));
  }, [whereQuery]);

  const filtered = useMemo(() => {
    const priceRange = PRICE_RANGES[selectedPriceIndex];
    const wq = whereQuery.trim().toLowerCase();
    return properties.filter(p => {
      if (wq && !p.neighbourhood.toLowerCase().includes(wq)) return false;
      if (p.monthlyRent < priceRange.min || p.monthlyRent > priceRange.max) return false;
      if (selectedType !== 'all' && p.propertyType !== selectedType) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.neighbourhood.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, whereQuery, selectedPriceIndex, selectedType, properties]);

  const clearFilters = () => {
    setWhereQuery('');
    setSelectedPriceIndex(0);
    setSelectedType('all');
  };

  const typeLabel = TYPE_OPTIONS.find(t => t.value === selectedType)?.label ?? 'All Types';
  const priceLabel = PRICE_RANGES[selectedPriceIndex].label;

  const renderCardList = (list: typeof properties) => (
    // Every visible listing with a video autoplays (muted) in the grid.
    <View style={isDesktop ? styles.grid : styles.gridMobile}>
      {list.map(p => (
        <View key={p.id} style={isDesktop ? styles.gridItem : styles.gridItemMobile}>
          <PropertyCard property={p} active={!!p.videoUrl} showAmenities={false} />
        </View>
      ))}
    </View>
  );

  // ---- Filter sheet building blocks (shared by mobile sheet + desktop modal) ----
  const filterHeader = (
    <View style={styles.sheetHeader}>
      <Text style={styles.sheetTitle}>Filters</Text>
      <TouchableOpacity style={styles.sheetCloseBtn} onPress={() => setShowFilters(false)}>
        <X size={18} color={COLORS.textSecondary} strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );

  const filterSections = (
    <>
      <Text style={styles.filterLabelText}>Type</Text>
      <View style={styles.chipWrap}>
        {CATEGORIES.map(c => {
          const Icon = c.icon;
          const active = selectedType === c.value;
          return (
            <TouchableOpacity
              key={c.value}
              style={[styles.chip, styles.chipIcon, active && styles.chipActive]}
              onPress={() => setSelectedType(c.value)}
            >
              <Icon size={14} color={active ? '#FFFFFF' : COLORS.textSecondary} strokeWidth={2} />
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{c.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.filterLabelText, styles.filterLabelSpaced]}>Where</Text>
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
          <TouchableOpacity onPress={() => setWhereQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <X size={16} color={COLORS.textSecondary} strokeWidth={2} />
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
            <Text style={[styles.chipText, whereQuery === n && styles.chipTextActive]}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.filterLabelText, styles.filterLabelSpaced]}>Budget</Text>
      <View style={styles.chipWrap}>
        {PRICE_RANGES.map((pr, i) => (
          <TouchableOpacity
            key={pr.label}
            style={[styles.chip, selectedPriceIndex === i && styles.chipActive]}
            onPress={() => setSelectedPriceIndex(i)}
          >
            <Text style={[styles.chipText, selectedPriceIndex === i && styles.chipTextActive]}>{pr.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const filterFooter = (
    <View style={styles.sheetFooter}>
      <TouchableOpacity onPress={clearFilters} style={styles.sheetClearBtn}>
        <Text style={styles.sheetClearText}>Clear all</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.sheetApplyBtn}
        onPress={() => setShowFilters(false)}
        activeOpacity={0.85}
      >
        <Text style={styles.sheetApplyText}>Show {filtered.length} properties</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: listBottomPad }]}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        >
          <View style={[styles.headerWrap, styles.searchRowTop, isDesktop && styles.blockDesktop]}>
            {/* Airbnb-style search pill + filter button */}
            <View style={styles.searchRowFlex}>
              <View style={styles.searchPill}>
                <View style={styles.searchIconCircle}>
                  <Search size={16} color="#FFFFFF" strokeWidth={2.5} />
                </View>
                <TextInput
                  style={styles.searchPillInput}
                  placeholder="Start your search"
                  placeholderTextColor={COLORS.text}
                  value={search}
                  onChangeText={setSearch}
                />
                {search.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <X size={16} color={COLORS.textSecondary} strokeWidth={2} />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilters(true)} activeOpacity={0.8}>
                <SlidersHorizontal size={18} color={COLORS.text} strokeWidth={2} />
                {filtersActive && <View style={styles.filterDot} />}
              </TouchableOpacity>
            </View>

            {/* Category bar */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.catScroll}
            >
              {CATEGORIES.map(c => {
                const Icon = c.icon;
                const active = selectedType === c.value;
                return (
                  <TouchableOpacity
                    key={c.value}
                    style={[styles.catChip, active && styles.catChipActive]}
                    onPress={() => setSelectedType(c.value)}
                    activeOpacity={0.8}
                  >
                    <Icon size={16} color={active ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
                    <Text style={[styles.catChipText, active && styles.catChipTextActive]}>{c.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={[styles.resultsSection, isDesktop && styles.resultsSectionDesktop]}>
            <View style={styles.resultsMeta}>
              <Text style={styles.resultsCount}>{filtered.length} properties found</Text>
              {filtersActive && (
                <TouchableOpacity onPress={clearFilters}>
                  <Text style={styles.clearFilters}>Clear filters</Text>
                </TouchableOpacity>
              )}
            </View>

            {filtered.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyEmoji}>🏘️</Text>
                <Text style={styles.emptyTitle}>Hakuna mali</Text>
                <Text style={styles.emptySub}>No properties match your filters</Text>
              </View>
            ) : (
              renderCardList(filtered)
            )}
          </View>
        </ScrollView>
      </View>

      {showFilters && (
        isDesktop ? (
          <Modal
            visible={showFilters}
            animationType="fade"
            transparent
            statusBarTranslucent
            onRequestClose={() => setShowFilters(false)}
          >
            <Pressable style={[styles.overlay, styles.overlayDesktop]} onPress={() => setShowFilters(false)}>
              <Pressable style={[styles.sheet, styles.sheetDesktop]} onPress={e => e.stopPropagation()}>
                {filterHeader}
                <ScrollView showsVerticalScrollIndicator={false} style={styles.sheetScroll}>
                  {filterSections}
                </ScrollView>
                {filterFooter}
              </Pressable>
            </Pressable>
          </Modal>
        ) : (
          <BottomSheet visible={showFilters} onClose={() => setShowFilters(false)} initialFull>
            {filterHeader}
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.sheetScrollFlex}
              contentContainerStyle={styles.sheetScrollContent}
            >
              {filterSections}
            </ScrollView>
            {filterFooter}
          </BottomSheet>
        )
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  searchRow: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchRowTop: {
    paddingTop: Platform.OS === 'android' ? 48 : 16,
  },
  headerWrap: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchRowFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    paddingLeft: 8,
    paddingRight: 18,
    paddingVertical: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  searchIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchPillInput: {
    flex: 1,
    minWidth: 0,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    paddingVertical: 4,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    borderWidth: 1.5,
    borderColor: COLORS.surface,
  },
  catScroll: {
    gap: 10,
    paddingTop: 14,
    paddingBottom: 12,
    paddingRight: 8,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  catChipActive: {
    borderColor: COLORS.text,
    borderWidth: 1.5,
  },
  catChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  catChipTextActive: {
    color: COLORS.text,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: COLORS.text,
  },
  resultsSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  resultsSectionDesktop: {
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
  },
  resultsMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  clearFilters: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptySub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 16,
  },
  gridItem: {
    width: '31.5%',
  },
  gridMobile: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItemMobile: {
    width: '48%',
  },
  blockDesktop: {
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
  },
  // Bottom dock (Bolt-style)
  dock: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dockDesktop: {
    left: '50%',
    right: undefined,
    marginLeft: -220,
    width: 440,
  },
  dockHandleRow: { alignItems: 'center', marginBottom: 6 },
  dockHandle: { width: 32, height: 4, borderRadius: 2, backgroundColor: COLORS.border },
  dockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dockField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  dockFieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  dockDivider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.border,
    marginHorizontal: 8,
  },
  // Modal / Sheet
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  overlayDesktop: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '85%',
  },
  sheetDesktop: {
    width: 480,
    borderRadius: 20,
    maxHeight: '80%',
    paddingBottom: 24,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  sheetCloseBtn: {
    padding: 4,
  },
  sheetScroll: {
    maxHeight: '60%',
  },
  filterLabelText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  filterLabelSpaced: {
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
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  chipIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 12,
  },
  sheetScrollFlex: {
    flex: 1,
  },
  sheetScrollContent: {
    paddingBottom: 8,
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
