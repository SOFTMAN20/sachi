import React, { useRef, useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Platform,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft, Heart, MessageCircle, MapPin, BedDouble, Bath, ShieldCheck,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import PropertyVideo from '@/components/PropertyVideo';
import { Property } from '@/types';

const COLORS = { primary: '#1B6B3A' };

function formatRent(amount: number) {
  if (amount >= 1000000) return `TZS ${(amount / 1000000).toFixed(1)}M`;
  return `TZS ${(amount / 1000).toFixed(0)}K`;
}

export default function ReelsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { properties, savedProperties, toggleSave, requestLogin } = useApp();

  const reels = useMemo(() => properties.filter(p => p.videoUrl), [properties]);
  const initialIndex = Math.max(0, id ? reels.findIndex(p => p.id === id) : 0);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const onViewRef = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  });
  const viewConfigRef = useRef({ itemVisiblePercentThreshold: 80 });

  const renderItem = ({ item, index }: { item: Property; index: number }) => {
    const isSaved = savedProperties.has(item.id);
    return (
      <View style={{ width, height }}>
        <PropertyVideo
          uri={item.videoUrl!}
          poster={item.images[0]}
          active={index === activeIndex}
          contentFit="cover"
          showMute={false}
          startMuted={false}
          style={StyleSheet.absoluteFill}
        />
        {/* Dark gradient-ish scrim for legibility */}
        <View style={styles.scrim} pointerEvents="none" />

        {/* Right action rail */}
        <View style={[styles.rail, { bottom: insets.bottom + 120 }]}>
          <TouchableOpacity style={styles.railBtn} onPress={() => toggleSave(item.id)}>
            <Heart
              size={30}
              color="#FFFFFF"
              fill={isSaved ? '#EF4444' : 'transparent'}
              strokeWidth={2}
            />
            <Text style={styles.railLabel}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.railBtn}
            onPress={() => requestLogin(`Sign in to contact ${item.ownerName}`)}
          >
            <MessageCircle size={30} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.railLabel}>Contact</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom info */}
        <View style={[styles.info, { paddingBottom: insets.bottom + 28 }]}>
          <View style={styles.locRow}>
            <MapPin size={13} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.locText}>{item.neighbourhood}, {item.city}</Text>
            {item.verifiedPhone && (
              <View style={styles.verifiedPill}>
                <ShieldCheck size={11} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <BedDouble size={14} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.metaText}>{item.bedrooms} bed</Text>
            </View>
            <View style={styles.metaItem}>
              <Bath size={14} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.metaText}>{item.bathrooms} bath</Text>
            </View>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatRent(item.monthlyRent)}</Text>
            <Text style={styles.priceUnit}>/month</Text>
            <TouchableOpacity
              style={styles.viewBtn}
              onPress={() => router.push(`/property/${item.id}`)}
              activeOpacity={0.85}
            >
              <Text style={styles.viewBtnText}>View details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={reels}
        keyExtractor={p => p.id}
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        initialScrollIndex={initialIndex}
        getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        windowSize={3}
        maxToRenderPerBatch={2}
      />

      {/* Header */}
      <View style={[styles.header, { top: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reels</Text>
        <View style={styles.backBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  header: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  rail: {
    position: 'absolute',
    right: 14,
    alignItems: 'center',
    gap: 22,
  },
  railBtn: { alignItems: 'center', gap: 4 },
  railLabel: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  info: {
    position: 'absolute',
    left: 16,
    right: 80,
    bottom: 0,
    gap: 8,
  },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  locText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(22,163,74,0.9)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 4,
  },
  verifiedText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  title: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', lineHeight: 25 },
  metaRow: { flexDirection: 'row', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  price: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  priceUnit: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '500' },
  viewBtn: {
    marginLeft: 'auto',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  viewBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});
