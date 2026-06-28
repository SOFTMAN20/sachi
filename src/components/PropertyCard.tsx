import React from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet, useWindowDimensions, Platform,
} from 'react-native';
import { Heart, BedDouble, Bath, ShieldCheck, Play, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Property } from '@/types';
import PropertyVideo from '@/components/PropertyVideo';
import ImageCarousel from '@/components/ImageCarousel';

const DESKTOP_BREAKPOINT = 900;

const COLORS = {
  primary: '#1B6B3A',
  primaryLight: '#E8F5E9',
  secondary: '#F5A623',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  surface: '#FFFFFF',
  verified: '#16A34A',
};

function formatRent(amount: number) {
  if (amount >= 1000000) {
    return `TZS ${(amount / 1000000).toFixed(1)}M`;
  }
  return `TZS ${(amount / 1000).toFixed(0)}K`;
}

interface Props {
  property: Property;
  horizontal?: boolean;
  /** When true and the card has a video, it autoplays (Instagram-feed style). */
  active?: boolean;
}

export default function PropertyCard({ property, horizontal = false, active = false }: Props) {
  const router = useRouter();
  const { savedProperties, toggleSave } = useApp();
  const isSaved = savedProperties.has(property.id);
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;
  const horizontalWidth = isDesktop ? 320 : width * 0.68;
  const hasVideo = !!property.videoUrl;

  return (
    <TouchableOpacity
      style={[styles.card, horizontal && styles.cardHorizontal, horizontal && { width: horizontalWidth }]}
      onPress={() => router.push(`/property/${property.id}`)}
      activeOpacity={0.9}
    >
      {/* Media — autoplaying video when available, else image */}
      <View style={[styles.imageWrap, horizontal && styles.imageWrapHorizontal]}>
        {hasVideo ? (
          <PropertyVideo
            uri={property.videoUrl!}
            poster={property.images[0]}
            active={active}
            style={styles.image}
            showMute={!horizontal}
          />
        ) : property.images.length > 1 ? (
          <ImageCarousel images={property.images} style={styles.image} />
        ) : (
          <Image
            source={{ uri: property.images[0] }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        {/* Video indicator */}
        {hasVideo && !active && (
          <View style={styles.videoBadge}>
            <Play size={11} color="#FFFFFF" fill="#FFFFFF" strokeWidth={2} />
          </View>
        )}

        {/* Save button */}
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={() => toggleSave(property.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Heart
            size={26}
            color="#FFFFFF"
            fill={isSaved ? '#FF385C' : 'rgba(0,0,0,0.4)'}
            strokeWidth={2}
          />
        </TouchableOpacity>

        {/* Trending badge */}
        {property.isTrending && (
          <View style={styles.trendingBadge}>
            <Text style={styles.trendingText}>★ Trending</Text>
          </View>
        )}

        {/* Verification badge */}
        {property.verifiedPhone && (
          <View style={styles.verifiedBadge}>
            <ShieldCheck size={12} color={COLORS.verified} strokeWidth={2.5} />
            <Text style={styles.verifiedBadgeText}>Verified</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.location} numberOfLines={1}>
            {property.neighbourhood}, {property.city}
          </Text>
          <View style={styles.ratingRow}>
            <Star size={13} color={COLORS.text} fill={COLORS.text} strokeWidth={0} />
            <Text style={styles.ratingText}>{property.ownerRating.toFixed(1)}</Text>
          </View>
        </View>

        <Text style={styles.subtitle} numberOfLines={1}>{property.title}</Text>

        <View style={styles.detailsRow}>
          <BedDouble size={13} color={COLORS.textSecondary} strokeWidth={1.8} />
          <Text style={styles.detailText}>{property.bedrooms} bd</Text>
          <View style={styles.dot} />
          <Bath size={13} color={COLORS.textSecondary} strokeWidth={1.8} />
          <Text style={styles.detailText}>{property.bathrooms} ba</Text>
          <View style={styles.dot} />
          <Text style={styles.detailText} numberOfLines={1}>
            {property.furnishing === 'furnished' ? 'Furnished'
              : property.furnishing === 'semi_furnished' ? 'Semi-furnished'
              : 'Unfurnished'}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatRent(property.monthlyRent)}</Text>
          <Text style={styles.priceUnit}> /month</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    marginBottom: 24,
  },
  cardHorizontal: {
    marginBottom: 0,
    marginRight: 14,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1.18,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#ECEEF0',
  },
  imageWrapHorizontal: {
    aspectRatio: 1.3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  trendingText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  videoBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.verified,
  },
  info: {
    paddingTop: 11,
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  location: {
    flex: 1,
    fontSize: 15.5,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.textSecondary,
    marginHorizontal: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  priceUnit: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});
