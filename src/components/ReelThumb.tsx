import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Play, MapPin } from 'lucide-react-native';
import { Property } from '@/types';

const DESKTOP_BREAKPOINT = 900;

const COLORS = {
  primary: '#1B6B3A',
  text: '#1A1A2E',
  surface: '#FFFFFF',
};

function formatRent(amount: number) {
  if (amount >= 1000000) return `TZS ${(amount / 1000000).toFixed(1)}M`;
  return `TZS ${(amount / 1000).toFixed(0)}K`;
}

interface Props {
  property: Property;
  onPress: () => void;
}

/** Vertical 9:16 "reel" preview tile shown in the trending row. */
export default function ReelThumb({ property, onPress }: Props) {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;
  const tileW = isDesktop ? 150 : 132;

  return (
    <TouchableOpacity
      style={[styles.tile, { width: tileW, height: tileW * 1.55 }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image source={{ uri: property.images[0] }} style={styles.img} resizeMode="cover" />
      <View style={styles.overlay} />

      <View style={styles.playPill}>
        <Play size={12} color="#FFFFFF" fill="#FFFFFF" strokeWidth={2} />
      </View>

      <View style={styles.bottom}>
        <Text style={styles.price}>{formatRent(property.monthlyRent)}</Text>
        <View style={styles.locRow}>
          <MapPin size={10} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.loc} numberOfLines={1}>{property.neighbourhood}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#000',
  },
  img: { width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  playPill: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
    gap: 2,
  },
  price: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  loc: { color: '#FFFFFF', fontSize: 11, fontWeight: '600', flex: 1 },
});
