import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, TextInput, Platform, Modal, Pressable, useWindowDimensions,
} from 'react-native';
import { Search, MapPin, Home as HomeIcon, Wallet, ChevronUp, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;
  // Clear the floating filter dock + native tab bar so the last card is reachable.
  const listBottomPad = Platform.OS === 'web' ? 120 : insets.bottom + 160;
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

      <ScrollView style={styles.scroll} contentContainerStyle={[styles.resultsSection, isDesktop && styles.resultsSectionDesktop, { paddingBottom: listBottomPad }]} showsVerticalScrollIndicator={false}>
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
      </ScrollView>

      {/* Bolt-style bottom dock */}
      <TouchableOpacity style={[styles.dock, isDesktop && styles.dockDesktop, Platform.OS !== 'web' && { bottom: insets.bottom + 12 }]} onPress={() => setShowFilters(true)} activeOpacity={0.9}>
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
  blockDesktop: {
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
  },
  resultsSectionDesktop: {
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
  dockDesktop: {
    width: 680,
    left: '50%',
    right: 'auto',
    marginLeft: -340,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 12,
    backgroundColor: COLORS.bg,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  searchRow: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: COLORS.bg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  scroll: {
    flex: 1,
  },
  resultsSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 120,
  },
  resultsMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  clearFilters: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
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
  emptySub: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  // Bottom dock (Bolt-style)
  dock: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: Platform.OS === 'ios' ? 12 : 10,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingTop: 6,
    paddingBottom: 12,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 8,
  },
  dockHandleRow: { alignItems: 'center', marginBottom: 6 },
  dockHandle: { width: 32, height: 4, borderRadius: 2, backgroundColor: COLORS.border },
  dockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dockField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dockFieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    flexShrink: 1,
  },
  dockDivider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.border,
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
