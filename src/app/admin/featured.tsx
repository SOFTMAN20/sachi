import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Platform, Image, TextInput, Switch, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft, Search, Star, MapPin, DollarSign, Eye, X, Plus, Trash2,
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
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#DC2626',
};

const MOCK_FEATURED = [
  {
    id: '1',
    title: 'Luxury Penthouse Sea View',
    image: 'https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 4500000,
    location: 'Oyster Bay, Dar es Salaam',
    type: 'Apartment',
    bedrooms: 3,
    views: 2450,
    featured: true,
    position: 1,
  },
  {
    id: '2',
    title: 'Modern Villa with Garden',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 2500000,
    location: 'Mikocheni, Dar es Salaam',
    type: 'House',
    bedrooms: 4,
    views: 1890,
    featured: true,
    position: 2,
  },
  {
    id: '3',
    title: 'Beachfront Luxury Condo',
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 3200000,
    location: 'Masaki, Dar es Salaam',
    type: 'Apartment',
    bedrooms: 2,
    views: 1670,
    featured: true,
    position: 3,
  },
];

const MOCK_AVAILABLE = [
  {
    id: '4',
    title: 'Spacious Family Home',
    image: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 1800000,
    location: 'Kinondoni, Dar es Salaam',
    type: 'House',
    bedrooms: 3,
    views: 890,
    featured: false,
  },
  {
    id: '5',
    title: 'Downtown Studio Apartment',
    image: 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 450000,
    location: 'CBD, Dar es Salaam',
    type: 'Studio',
    bedrooms: 1,
    views: 567,
    featured: false,
  },
];

export default function AdminFeaturedScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;
  const { userRole } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState(MOCK_FEATURED);
  const [availableProperties] = useState(MOCK_AVAILABLE);
  const [showAddModal, setShowAddModal] = useState(false);

  if (userRole !== 'admin') {
    router.back();
    return null;
  }

  const filteredAvailable = availableProperties.filter(property =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveFeatured = (id: string) => {
    setFeaturedProperties(prev => prev.filter(p => p.id !== id));
  };

  const handleAddFeatured = (property: typeof MOCK_AVAILABLE[0]) => {
    const newPosition = featuredProperties.length + 1;
    setFeaturedProperties(prev => [...prev, { ...property, featured: true, position: newPosition }]);
    setShowAddModal(false);
    setSearchQuery('');
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
        <Text style={styles.title}>Featured Properties</Text>
        <TouchableOpacity 
          style={styles.addBtn}
          onPress={() => setShowAddModal(true)}
          activeOpacity={0.7}
        >
          <Plus size={20} color={COLORS.primary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Star size={16} color={COLORS.warning} strokeWidth={2} fill={COLORS.warning} />
        <Text style={styles.infoBannerText}>
          Featured properties appear at the top of search results
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{featuredProperties.length}</Text>
          <Text style={styles.statLabel}>Featured</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: COLORS.primary }]}>
            {featuredProperties.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Total Views</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: COLORS.warning }]}>Top 3</Text>
          <Text style={styles.statLabel}>Positions</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scroll}
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
        showsVerticalScrollIndicator={false}
      >
        <View style={isDesktop ? styles.innerDesktop : undefined}>
        <Text style={styles.sectionTitle}>Currently Featured ({featuredProperties.length})</Text>
        
        <View style={isDesktop ? styles.gridContainer : undefined}>
        {featuredProperties.length === 0 ? (
          <View style={styles.emptyState}>
            <Star size={48} color={COLORS.textSecondary} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No Featured Properties</Text>
            <Text style={styles.emptyText}>
              Add properties to feature them at the top of search results
            </Text>
            <TouchableOpacity 
              style={styles.emptyBtn}
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.85}
            >
              <Plus size={16} color='#FFFFFF' strokeWidth={2.5} />
              <Text style={styles.emptyBtnText}>Add Featured Property</Text>
            </TouchableOpacity>
          </View>
        ) : (
          featuredProperties.map((property, index) => (
            <View key={property.id} style={styles.featuredCard}>
              <View style={styles.positionBadge}>
                <Text style={styles.positionText}>#{index + 1}</Text>
              </View>
              
              <Image source={{ uri: property.image }} style={styles.propertyImage} />
              
              <View style={styles.propertyContent}>
                <View style={styles.propertyHeader}>
                  <Text style={styles.propertyTitle} numberOfLines={2}>
                    {property.title}
                  </Text>
                  <Star size={18} color={COLORS.warning} strokeWidth={2} fill={COLORS.warning} />
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
                  <View style={styles.viewsBadge}>
                    <Eye size={12} color={COLORS.textSecondary} strokeWidth={2} />
                    <Text style={styles.viewsText}>{property.views}</Text>
                  </View>
                </View>

                <View style={styles.priceRow}>
                  <View style={styles.priceContainer}>
                    <DollarSign size={16} color={COLORS.primary} strokeWidth={2.5} />
                    <Text style={styles.price}>
                      {(property.price / 1000).toFixed(0)}K/mo
                    </Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.removeBtn}
                  onPress={() => handleRemoveFeatured(property.id)}
                  activeOpacity={0.8}
                >
                  <Trash2 size={14} color={COLORS.danger} strokeWidth={2} />
                  <Text style={styles.removeBtnText}>Remove from Featured</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        </View>
        </View>
      </ScrollView>

      {/* Add Property Modal */}
      {showAddModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Featured Property</Text>
              <TouchableOpacity 
                onPress={() => {
                  setShowAddModal(false);
                  setSearchQuery('');
                }}
                activeOpacity={0.7}
              >
                <X size={24} color={COLORS.text} strokeWidth={2} />
              </TouchableOpacity>
            </View>

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

            <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
              {filteredAvailable.map(property => (
                <TouchableOpacity 
                  key={property.id}
                  style={styles.availableCard}
                  onPress={() => handleAddFeatured(property)}
                  activeOpacity={0.9}
                >
                  <Image source={{ uri: property.image }} style={styles.availableImage} />
                  <View style={styles.availableContent}>
                    <Text style={styles.availableTitle} numberOfLines={1}>
                      {property.title}
                    </Text>
                    <View style={styles.availableLocation}>
                      <MapPin size={12} color={COLORS.textSecondary} strokeWidth={2} />
                      <Text style={styles.availableLocationText} numberOfLines={1}>
                        {property.location}
                      </Text>
                    </View>
                    <View style={styles.availableMeta}>
                      <Text style={styles.availablePrice}>
                        {(property.price / 1000).toFixed(0)}K/mo
                      </Text>
                      <View style={styles.availableViews}>
                        <Eye size={10} color={COLORS.textSecondary} strokeWidth={2} />
                        <Text style={styles.availableViewsText}>{property.views}</Text>
                      </View>
                    </View>
                  </View>
                  <Plus size={20} color={COLORS.primary} strokeWidth={2.5} />
                </TouchableOpacity>
              ))}
              
              {filteredAvailable.length === 0 && (
                <View style={styles.noResults}>
                  <Text style={styles.noResultsText}>No properties found</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}
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
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.warningLight,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.warning,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
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
  scroll: { flex: 1 },
  content: { padding: 20, gap: 16 },
  contentDesktop: { alignItems: 'center' },
  innerDesktop: { width: '100%', maxWidth: 1200 },
  gridContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  featuredCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.warning,
    position: 'relative',
    ...(Platform.OS === 'web' ? { flex: 1, minWidth: 350, maxWidth: 580 } : {}),
  },
  positionBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
    backgroundColor: COLORS.warning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  positionText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
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
    gap: 8,
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
  viewsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  priceRow: {
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
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  removeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.danger,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  emptyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.text,
  },
  modalList: {
    maxHeight: 400,
  },
  availableCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.bg,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  availableImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: COLORS.border,
  },
  availableContent: {
    flex: 1,
    gap: 4,
  },
  availableTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  availableLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  availableLocationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  availableMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  availablePrice: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  availableViews: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  availableViewsText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  noResults: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
