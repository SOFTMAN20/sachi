import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Platform, Image, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft, Plus, Eye, Users, Circle, Search, SlidersHorizontal,
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { ListingStatus } from '@/types';
import { DESKTOP_BREAKPOINT } from './_layout';

const COLORS = {
  primary: '#1B6B3A',
  primaryLight: '#E8F5E9',
  secondary: '#F5A623',
  secondaryLight: '#FEF3E2',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  bg: '#F8F9FA',
  surface: '#FFFFFF',
  blue: '#2563EB',
  blueLight: '#E0F2FE',
};

const STATUS_META: Record<ListingStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: '#16A34A', bg: COLORS.primaryLight },
  rented: { label: 'Rented', color: COLORS.blue, bg: COLORS.blueLight },
  pending_review: { label: 'Pending', color: COLORS.secondary, bg: COLORS.secondaryLight },
};

const PROPERTY_STATS: Record<string, { views: number; leads: number }> = {
  '1': { views: 482, leads: 9 },
  '2': { views: 211, leads: 4 },
  '3': { views: 96, leads: 1 },
  '4': { views: 357, leads: 6 },
  '5': { views: 174, leads: 3 },
};

function formatTZS(amount: number) {
  return `TZS ${amount.toLocaleString('en-US')}`;
}

export default function PropertiesScreen() {
  const router = useRouter();
  const { properties } = useApp();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;

  const [activeTab, setActiveTab] = useState<'all' | ListingStatus>('all');

  const myProperties = properties.slice(0, 5);
  
  const filteredProperties = activeTab === 'all' 
    ? myProperties 
    : myProperties.filter(p => p.status === activeTab);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={[styles.header, isDesktop && styles.rowDesktop]}>
        {isDesktop ? (
          <View style={styles.backBtn} />
        ) : (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color={COLORS.text} strokeWidth={2} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Properties</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/add-listing')}
          activeOpacity={0.7}
        >
          <Plus size={24} color={COLORS.primary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.tabsContainer, isDesktop && styles.rowDesktop]}
        >
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'all' && styles.tabActive]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
              All ({myProperties.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'active' && styles.tabActive]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
              Active ({myProperties.filter(p => p.status === 'active').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'rented' && styles.tabActive]}
            onPress={() => setActiveTab('rented')}
          >
            <Text style={[styles.tabText, activeTab === 'rented' && styles.tabTextActive]}>
              Rented ({myProperties.filter(p => p.status === 'rented').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'pending_review' && styles.tabActive]}
            onPress={() => setActiveTab('pending_review')}
          >
            <Text style={[styles.tabText, activeTab === 'pending_review' && styles.tabTextActive]}>
              Pending ({myProperties.filter(p => p.status === 'pending_review').length})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Properties List */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.grid, isDesktop && styles.gridDesktop]}>
        {filteredProperties.map(property => {
          const meta = STATUS_META[property.status];
          const stats = PROPERTY_STATS[property.id] ?? { views: 0, leads: 0 };

          return (
            <TouchableOpacity
              key={property.id}
              style={[styles.propertyCard, isDesktop && styles.propertyCardDesktop]}
              activeOpacity={0.9}
              onPress={() => router.push(`/property/${property.id}`)}
            >
              <Image source={{ uri: property.images[0] }} style={styles.propertyImage} />
              <View style={styles.propertyInfo}>
                <View style={styles.propertyHeader}>
                  <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
                    <Circle size={6} color={meta.color} fill={meta.color} />
                    <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
                  </View>
                </View>
                <Text style={styles.propertyTitle} numberOfLines={2}>{property.title}</Text>
                <Text style={styles.propertyLocation}>{property.neighbourhood}</Text>
                <Text style={styles.propertyRent}>{formatTZS(property.monthlyRent)}/month</Text>
                <View style={styles.propertyStats}>
                  <View style={styles.statItem}>
                    <Eye size={14} color={COLORS.textSecondary} strokeWidth={2} />
                    <Text style={styles.statText}>{stats.views} views</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Users size={14} color={COLORS.textSecondary} strokeWidth={2} />
                    <Text style={styles.statText}>{stats.leads} leads</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        </View>
      </ScrollView>
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
  tabsWrapper: {
    backgroundColor: COLORS.bg,
    paddingVertical: 12,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scroll: { flex: 1 },
  content: { padding: 20, gap: 16 },
  contentDesktop: { width: '100%', maxWidth: 1140, alignSelf: 'center', paddingHorizontal: 32 },
  rowDesktop: { width: '100%', maxWidth: 1140, alignSelf: 'center', paddingHorizontal: 32 },
  grid: { gap: 16 },
  gridDesktop: { flexDirection: 'row', flexWrap: 'wrap' },
  propertyCardDesktop: { width: '32%', marginRight: '2%', marginBottom: 16 },
  propertyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  propertyImage: {
    width: '100%',
    height: 200,
  },
  propertyInfo: {
    padding: 16,
    gap: 8,
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 22,
  },
  propertyLocation: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  propertyRent: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 4,
  },
  propertyStats: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});
