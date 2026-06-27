import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet,
  Platform, useWindowDimensions, Modal, FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft, Heart, MapPin, BedDouble, Bath, ShieldCheck,
  Phone, MessageCircle, Calendar, Calculator, Images, X,
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropertyVideo from '@/components/PropertyVideo';

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

function formatRent(amount: number) {
  if (amount >= 1000000) return `TZS ${(amount / 1000000).toFixed(1)}M`;
  return `TZS ${(amount / 1000).toFixed(0)}K`;
}

function formatFull(amount: number) {
  return `TZS ${amount.toLocaleString('en-US')}`;
}

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { savedProperties, toggleSave, requestLogin, properties } = useApp();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;
  const [galleryOpen, setGalleryOpen] = useState(false);
  // null = photo grid is showing; a number = full-screen viewer open at that image index
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const property = properties.find(p => p.id === id);

  if (!property) {
    return (
      <View style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Property not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
            <Text style={styles.backLinkText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const isSaved = savedProperties.has(property.id);

  const handleContactOwner = () => {
    requestLogin(`Sign in to contact ${property.ownerName}`);
  };

  const handleRequestViewing = () => {
    requestLogin('Sign in to request a property viewing');
  };

  const costCardEl = (
    <View style={styles.costCard}>
      <View style={styles.costCardHeader}>
        <Calculator size={16} color={COLORS.primary} strokeWidth={2} />
        <Text style={styles.costCardTitle}>True Cost Calculator</Text>
      </View>
      <View style={styles.costRow}>
        <Text style={styles.costLabel}>Monthly rent</Text>
        <Text style={styles.costValue}>{formatFull(property.monthlyRent)}</Text>
      </View>
      <View style={styles.costRow}>
        <Text style={styles.costLabel}>Deposit</Text>
        <Text style={styles.costValue}>{formatFull(property.depositAmount)}</Text>
      </View>
      <View style={styles.costRow}>
        <Text style={styles.costLabel}>Estimated utilities</Text>
        <Text style={styles.costValue}>{formatFull(property.estimatedUtilities)}/mo</Text>
      </View>
      <View style={styles.costDivider} />
      <View style={styles.costRow}>
        <Text style={styles.costTotalLabel}>Total move-in cost</Text>
        <Text style={styles.costTotalValue}>
          {formatFull(property.depositAmount + property.monthlyRent)}
        </Text>
      </View>
      <Text style={styles.costNote}>Deposit + first month's rent</Text>
    </View>
  );

  const actionButtons = (
    <View style={[styles.actionsContainer, !isDesktop && { gap: 10 }]}>
      <TouchableOpacity
        style={[styles.secondaryAction, isDesktop && styles.actionBtnDesktop]}
        onPress={handleRequestViewing}
        activeOpacity={0.85}
      >
        <Calendar size={18} color={COLORS.primary} strokeWidth={2} />
        <Text style={styles.secondaryActionText}>Request Viewing</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.primaryAction, isDesktop && styles.actionBtnDesktop]}
        onPress={handleContactOwner}
        activeOpacity={0.85}
      >
        <MessageCircle size={18} color="#FFFFFF" strokeWidth={2} />
        <Text style={styles.primaryActionText}>Contact Owner</Text>
      </TouchableOpacity>
    </View>
  );

  const detailsBlock = (
    <>
      <View style={styles.locationRow}>
        <MapPin size={14} color={COLORS.textSecondary} strokeWidth={2} />
        <Text style={styles.locationText}>{property.neighbourhood}, {property.city}</Text>
      </View>

      <Text style={styles.title}>{property.title}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.price}>{formatRent(property.monthlyRent)}</Text>
        <Text style={styles.priceUnit}>/month</Text>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <BedDouble size={16} color={COLORS.primary} strokeWidth={2} />
          <Text style={styles.detailText}>{property.bedrooms} bed</Text>
        </View>
        <View style={styles.detailItem}>
          <Bath size={16} color={COLORS.primary} strokeWidth={2} />
          <Text style={styles.detailText}>{property.bathrooms} bath</Text>
        </View>
        {property.verifiedPhone && (
          <View style={styles.detailItem}>
            <ShieldCheck size={16} color={COLORS.primary} strokeWidth={2} />
            <Text style={styles.detailText}>Verified</Text>
          </View>
        )}
      </View>

      {!isDesktop && costCardEl}

      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>{property.description}</Text>

      <Text style={styles.sectionTitle}>Amenities</Text>
      <View style={styles.amenitiesGrid}>
        {property.amenities.map(a => (
          <View key={a} style={styles.amenityChip}>
            <Text style={styles.amenityText}>{a}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Listed by</Text>
      <View style={styles.ownerRow}>
        <Image source={{ uri: property.ownerAvatar }} style={styles.ownerAvatar} />
        <View style={styles.ownerInfo}>
          <Text style={styles.ownerName}>{property.ownerName}</Text>
          <Text style={styles.ownerRating}>★ {property.ownerRating.toFixed(1)} rating</Text>
        </View>
      </View>
    </>
  );

  const imageEl = (
    <View style={[styles.imageWrap, isDesktop && styles.imageWrapDesktop]}>
      {property.videoUrl ? (
        <PropertyVideo
          uri={property.videoUrl}
          poster={property.images[0]}
          active
          style={styles.image}
          showMute
        />
      ) : (
        <Image source={{ uri: property.images[0] }} style={styles.image} resizeMode="cover" />
      )}
      <TouchableOpacity style={[styles.backBtn, { top: insets.top + 8 }]} onPress={() => router.back()}>
        <ChevronLeft size={22} color="#FFFFFF" strokeWidth={2.5} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.heartBtn, { top: insets.top + 8 }]} onPress={() => toggleSave(property.id)}>
        <Heart
          size={20}
          color={isSaved ? '#EF4444' : '#FFFFFF'}
          fill={isSaved ? '#EF4444' : 'transparent'}
          strokeWidth={2}
        />
      </TouchableOpacity>

      {/* View photos — opens the full gallery if images are available */}
      {property.images.length > 0 && (
        <TouchableOpacity
          style={styles.viewPhotosBtn}
          onPress={() => { setViewerIndex(null); setGalleryOpen(true); }}
          activeOpacity={0.85}
        >
          <Images size={15} color={COLORS.text} strokeWidth={2} />
          <Text style={styles.viewPhotosText}>View photos ({property.images.length})</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Photo grid: a large hero (first photo) above a balanced 2-column grid of the rest.
  // Content is capped and centered so it stays tidy on wide web/desktop screens.
  const GALLERY_PAD = 12;
  const GALLERY_GAP = 8;
  const galleryContentW = Math.min(width, 760);
  const galleryInnerW = galleryContentW - GALLERY_PAD * 2;
  const galleryHalfW = (galleryInnerW - GALLERY_GAP) / 2;
  const galleryHeroH = Math.min(galleryInnerW * 0.62, 440);

  const galleryModal = (
    <Modal
      visible={galleryOpen}
      animationType="fade"
      transparent={false}
      statusBarTranslucent
      onRequestClose={() => {
        // Android hardware back: from the viewer, step back to the grid; from the grid, close.
        if (viewerIndex !== null) setViewerIndex(null);
        else setGalleryOpen(false);
      }}
    >
      {viewerIndex === null ? (
        /* ---- Grid: all photos on one screen ---- */
        <View style={[styles.gridRoot, { paddingTop: insets.top }]}>
          <View style={styles.galleryBar}>
            <TouchableOpacity style={styles.galleryBarBtn} onPress={() => setGalleryOpen(false)}>
              <X size={22} color={COLORS.text} strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={styles.galleryBarTitle}>All photos ({property.images.length})</Text>
            <View style={styles.galleryBarBtn} />
          </View>
          <ScrollView
            contentContainerStyle={{
              paddingVertical: GALLERY_PAD,
              paddingBottom: insets.bottom + GALLERY_PAD,
              alignItems: 'center',
            }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ width: galleryInnerW, gap: GALLERY_GAP }}>
              {/* Hero — first photo, full width */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setViewerIndex(0)}
                style={[styles.gridHero, { height: galleryHeroH }]}
              >
                <Image source={{ uri: property.images[0] }} style={styles.gridCellImg} resizeMode="cover" />
              </TouchableOpacity>

              {/* Remaining photos — balanced 2-column grid */}
              {property.images.length > 1 && (
                <View style={styles.gridWrap}>
                  {property.images.slice(1).map((uri, i) => (
                    <TouchableOpacity
                      key={`${i}-${uri}`}
                      activeOpacity={0.9}
                      onPress={() => setViewerIndex(i + 1)}
                      style={{ width: galleryHalfW, height: galleryHalfW }}
                    >
                      <Image source={{ uri }} style={styles.gridCellImg} resizeMode="cover" />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      ) : (
        /* ---- Full-screen swipeable viewer, opened at the tapped photo ---- */
        <View style={styles.galleryRoot}>
          <FlatList
            data={property.images}
            keyExtractor={(uri, i) => `${i}-${uri}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={viewerIndex}
            getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
            onMomentumScrollEnd={e =>
              setViewerIndex(Math.round(e.nativeEvent.contentOffset.x / width))
            }
            renderItem={({ item }) => (
              <View style={{ width, height, justifyContent: 'center' }}>
                <Image source={{ uri: item }} style={styles.galleryImage} resizeMode="contain" />
              </View>
            )}
          />
          {/* Back to the grid */}
          <TouchableOpacity
            style={[styles.galleryClose, { top: insets.top + 8 }]}
            onPress={() => setViewerIndex(null)}
          >
            <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={[styles.galleryCounter, { bottom: insets.bottom + 20 }]}>
            <Text style={styles.galleryCounterText}>
              {viewerIndex + 1} / {property.images.length}
            </Text>
          </View>
        </View>
      )}
    </Modal>
  );

  return (
    <View style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.scrollContentDesktop,
          !isDesktop && { paddingBottom: 24 }
        ]}
      >
        {isDesktop ? (
          <View style={styles.twoCol}>
            <View style={styles.leftCol}>
              {imageEl}
              <View style={[styles.content, styles.contentDesktop]}>
                {detailsBlock}
              </View>
            </View>
            <View style={styles.rightCol}>
              {costCardEl}
              <View style={styles.actionsCol}>
                {actionButtons}
              </View>
            </View>
          </View>
        ) : (
          <>
            {imageEl}
            <View style={styles.content}>
              {detailsBlock}
            </View>
          </>
        )}
      </ScrollView>

      {/* Sticky bottom action bar - mobile only */}
      {!isDesktop && (
        <View style={[styles.stickyBar, { paddingBottom: insets.bottom + 12 }]}>
          {actionButtons}
        </View>
      )}

      {galleryModal}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 0 },
  scrollContentDesktop: {
    width: '100%',
    maxWidth: 1040,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  twoCol: { flexDirection: 'row', gap: 24, alignItems: 'flex-start' },
  leftCol: { flex: 1, minWidth: 0 },
  rightCol: { width: 340, gap: 16 },
  contentDesktop: { paddingHorizontal: 0, paddingTop: 16 },
  actionsCol: { gap: 10 },
  actionsContainer: { flexDirection: 'row' },
  actionBtnDesktop: { flex: 0, alignSelf: 'stretch' },
  stickyBar: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    boxShadow: '0 -2px 12px rgba(0, 0, 0, 0.06)',
  },
  imageWrap: { width: '100%', height: 420, position: 'relative' },
  viewPhotosBtn: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  viewPhotosText: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  gridRoot: { flex: 1, backgroundColor: COLORS.surface },
  galleryBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  galleryBarBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryBarTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  gridCellImg: { width: '100%', height: '100%', borderRadius: 14, backgroundColor: '#ECEEF0' },
  gridHero: { width: '100%', borderRadius: 14, overflow: 'hidden', backgroundColor: '#ECEEF0' },
  gridWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  galleryRoot: { flex: 1, backgroundColor: '#000' },
  galleryImage: { width: '100%', height: '100%' },
  galleryClose: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryCounter: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  galleryCounterText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  imageWrapDesktop: { height: 400, borderRadius: 18, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  backBtn: {
    position: 'absolute', left: 16,
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  heartBtn: {
    position: 'absolute', right: 16,
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  content: { padding: 20, gap: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  locationText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text, lineHeight: 28, marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 16 },
  price: { fontSize: 26, fontWeight: '800', color: COLORS.primary, letterSpacing: -0.3 },
  priceUnit: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
  detailsRow: { flexDirection: 'row', gap: 20, marginBottom: 20 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 14, color: COLORS.text, fontWeight: '600' },
  costCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    gap: 10,
    borderCurve: 'continuous',
  },
  costCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  costCardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  costRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  costLabel: { fontSize: 13, color: COLORS.textSecondary },
  costValue: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  costDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 2 },
  costTotalLabel: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  costTotalValue: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  costNote: { fontSize: 11, color: COLORS.textSecondary, marginTop: -4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginTop: 16, marginBottom: 8 },
  description: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 21 },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenityChip: {
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    borderCurve: 'continuous',
  },
  amenityText: { fontSize: 12, fontWeight: '600', color: COLORS.primary },
  ownerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ownerAvatar: { width: 48, height: 48, borderRadius: 24 },
  ownerInfo: { gap: 2 },
  ownerName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  ownerRating: { fontSize: 13, color: COLORS.secondary, fontWeight: '600' },
  secondaryAction: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 14, paddingVertical: 14,
    borderCurve: 'continuous',
  },
  secondaryActionText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  primaryAction: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 14,
    borderCurve: 'continuous',
    boxShadow: '0 2px 8px rgba(27, 107, 58, 0.2)',
  },
  primaryActionText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundText: { fontSize: 16, color: COLORS.textSecondary },
  backLink: { paddingVertical: 8, paddingHorizontal: 16 },
  backLinkText: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
});
