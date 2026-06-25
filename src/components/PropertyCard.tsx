import React from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet, useWindowDimensions, Platform,
} from 'react-native';
import { Heart, MapPin, BedDouble, Bath, ShieldCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Property } from '@/types';

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
}

export default function PropertyCard({ property, horizontal = false }: Props) {
  const router = useRouter();
  const { savedProperties, toggleSave } = useApp();
  const isSaved = savedProperties.has(property.id);
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;
  const horizontalWidth = isDesktop ? 320 : width * 0.68;

  return (
    <TouchableOpacity
      style={[styles.card, horizontal && styles.cardHorizontal, horizontal && { width: horizontalWidth }]}
      onPress={() => router.push(`/property/${property.id}`)}
      activeOpacity={0.9}
    >
      {/* Image */}
      <View style={[styles.imageWrap, horizontal && styles.imageWrapHorizontal]}>
        <Image
          source={{ uri: property.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Save button */}
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={() => toggleSave(property.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Heart
            size={18}
            color={isSaved ? '#EF4444' : '#FFFFFF'}
            fill={isSaved ? '#EF4444' : 'transparent'}
            strokeWidth={2}
          />
        </TouchableOpacity>

        {/* Trending badge */}
        {property.isTrending && (
          <View style={styles.trendingBadge}>
            <Text style={styles.trendingText}>Trending</Text>
          </View>
        )}

        {/* Verification badge */}
        {property.verifiedPhone && (
          <View style={styles.verifiedBadge}>
            <ShieldCheck size={12} color="#FFFFFF" fill="#16A34A" strokeWidth={2} />
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.locationRow}>
          <MapPin size={12} color={COLORS.textSecondary} strokeWidth={2} />
          <Text style={styles.locationText} numberOfLines={1}>
            {property.neighbourhood}, {property.city}
          </Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>{property.title}</Text>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <BedDouble size={13} color={COLORS.textSecondary} strokeWidth={1.8} />
            <Text style={styles.detailText}>{property.bedrooms} bed</Text>
          </View>
          <View style={styles.dot} />
          <View style={styles.detailItem}>
            <Bath size={13} color={COLORS.textSecondary} strokeWidth={1.8} />
            <Text style={styles.detailText}>{property.bathrooms} bath</Text>
          </View>
          <View style={styles.dot} />
          <Text style={styles.detailText}>
            {property.furnishing === 'furnished' ? 'Furnished'
              : property.furnishing === 'semi_furnished' ? 'Semi-furnished'
              : 'Unfurnished'}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatRent(property.monthlyRent)}</Text>
          <Text style={styles.priceUnit}>/mo</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16,
  },
  cardHorizontal: {
    marginBottom: 0,
    marginRight: 14,
  },
  imageWrap: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  imageWrapHorizontal: {
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#F5A623',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  trendingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    padding: 14,
    gap: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 21,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.border,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
    marginTop: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.3,
  },
  priceUnit: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});
