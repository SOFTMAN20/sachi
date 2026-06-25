import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Platform, Modal, Pressable, useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import { Search, MapPin, Hop as HomeIcon, Wallet, ChevronUp, X } from 'lucide-react-native';
import { NEIGHBOURHOODS } from '@/data/mockData';
import PropertyCard from '@/components/PropertyCard';
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

export default function ExploreScreen() {
  const { properties } = useApp();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;
  const listBottomPad = Platform.OS === 'web' ? 120 : 0;
  const [search, setSearch] = useState('');
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState('All Areas');
  const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);
  const [selectedType, setSelectedType] = useState<PropertyType | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtersActive = selectedNeighbourhood !== 'All Areas' || selectedPriceIndex !== 0 || selectedType !== 'all';

  const filtered = useMemo(() => {
    const priceRange = PRICE_RANGES[selectedPriceIndex];
    return properties.filter(p => {
      if (selectedNeighbourhood !== 'All Areas' && p.neighbourhood !== selectedNeighbourhood) return false;
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
  }, [search, selectedNeighbourhood, selectedPriceIndex, selectedType, properties]);

  const clearFilters = () => {
    setSelectedNeighbourhood('All Areas');
    setSelectedPriceIndex(0);
    setSelectedType('all');
  };

  const typeLabel = TYPE_OPTIONS.find(t => t.value === selectedType)?.label ?? 'All Types';
  const priceLabel = PRICE_RANGES[selectedPriceIndex].label;

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
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: listBottomPad }]}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        >
          <View style={[styles.header, isDesktop && styles.blockDesktop]}>
            <Text style={styles.headerTitle}>Explore</Text>
            <Text style={styles.headerSub}>Find properties across Tanzania</Text>
          </View>

          <View style={[styles.searchRow, isDesktop && styles.blockDesktop]}>
            <View style={styles.searchBar}>
              <Search size={16} color={COLORS.textSecondary} strokeWidth={2} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search area or property..."
                placeholderTextColor={COLORS.textSecondary}
                value={search}
                onChangeText={setSearch}
              />
            </View>
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

        {/* Bolt-style bottom dock */}
        <TouchableOpacity style={[styles.dock, isDesktop && styles.dockDesktop]} onPress={() => setShowFilters(true)} activeOpacity={0.9}>
          <View style={styles.dockHandleRow}>
            <View style={styles.dockHandle} />
          </View>
          <View style={styles.dockRow}>
            <View style={styles.dockField}>
              <HomeIcon size={15} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.dockFieldLabel} numberOfLines={1}>{typeLabel}</Text>
            </View>
            <View style={styles.dockDivider} />
            <View style={styles.dockField}>
              <MapPin size={15} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.dockFieldLabel} numberOfLines={1}>{selectedNeighbourhood}</Text>
            </View>
            <View style={styles.dockDivider} />
            <View style={styles.dockField}>
              <Wallet size={15} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.dockFieldLabel} numberOfLines={1}>{priceLabel}</Text>
            </View>
            <ChevronUp size={18} color={COLORS.textSecondary} strokeWidth={2.5} />
          </View>
        </TouchableOpacity>
      </View>

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
              <Text style={styles.sheetTitle}>What are you looking for?</Text>
              <TouchableOpacity style={styles.sheetCloseBtn} onPress={() => setShowFilters(false)}>
                <X size={18} color={COLORS.textSecondary} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.sheetScroll}>
              <Text style={styles.filterLabelText}>Type</Text>
              <View style={styles.chipWrap}>
                {TYPE_OPTIONS.map(t => (
                  <TouchableOpacity
                    key={t.value}
                    style={[styles.chip, selectedType === t.value && styles.chipActive]}
                    onPress={() => setSelectedType(t.value)}
                  >
                    <Text style={[styles.chipText, selectedType === t.value && styles.chipTextActive]}>
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.filterLabelText, styles.filterLabelSpaced]}>Where</Text>
              <View style={styles.chipWrap}>
                {NEIGHBOURHOODS.map(n => (
                  <TouchableOpacity
                    key={n}
                    style={[styles.chip, selectedNeighbourhood === n && styles.chipActive]}
                    onPress={() => setSelectedNeighbourhood(n)}
                  >
                    <Text style={[styles.chipText, selectedNeighbourhood === n && styles.chipTextActive]}>
                      {n}
                    </Text>
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
                <Text style={styles.sheetApplyText}>Show {filtered.length} properties</Text>
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
