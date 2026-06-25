import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Platform,
} from 'react-native';
import { Heart, LogIn } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import PropertyCard from '@/components/PropertyCard';

const COLORS = {
  primary: '#1B6B3A',
  primaryLight: '#E8F5E9',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  bg: '#F8F9FA',
  border: '#E5E7EB',
  surface: '#FFFFFF',
};

export default function SavedScreen() {
  const { isLoggedIn, savedProperties, requestLogin, properties } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'web' ? 24 : insets.bottom + 100;

  const saved = properties.filter(p => savedProperties.has(p.id));

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Saved</Text>
          <Text style={styles.headerSub}>Your wishlist</Text>
        </View>
        <View style={styles.lockScreen}>
          <View style={styles.lockIcon}>
            <Heart size={36} color={COLORS.primary} strokeWidth={1.5} />
          </View>
          <Text style={styles.lockTitle}>Save properties you love</Text>
          <Text style={styles.lockSubtitle}>
            Sign in to save properties and access them anytime from any device.
          </Text>
          <TouchableOpacity
            style={styles.signInBtn}
            onPress={() => requestLogin('Sign in to save properties to your wishlist')}
            activeOpacity={0.85}
          >
            <LogIn size={18} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.signInBtnText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved</Text>
        <Text style={styles.headerSub}>
          {saved.length} {saved.length === 1 ? 'property' : 'properties'} saved
        </Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]} showsVerticalScrollIndicator={false}>
        {saved.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>💚</Text>
            <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
            <Text style={styles.emptySubtitle}>
              Bonyeza moyo kupenda nyumba{'\n'}Tap the heart icon on any property to save it here
            </Text>
          </View>
        ) : (
          saved.map(p => <PropertyCard key={p.id} property={p} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 16,
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  lockScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 16,
    paddingBottom: 80,
  },
  lockIcon: {
    width: 84,
    height: 84,
    borderRadius: 28,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  lockTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  lockSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  signInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  signInBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 10,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },
});
