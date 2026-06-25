import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft, Pencil, Phone, MessageCircle, Mail, Briefcase, Shield,
  ChevronRight, Star,
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { ROLE_INFO } from '@/data/mockData';
import { DESKTOP_BREAKPOINT } from './_layout';

const COLORS = {
  primary: '#1B6B3A',
  primaryLight: '#E8F5E9',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  bg: '#F8F9FA',
  border: '#E5E7EB',
  surface: '#FFFFFF',
};

export default function AgentProfileScreen() {
  const router = useRouter();
  const { userName, businessName, userPhone, whatsappPhone, userEmail, userRole, properties } = useApp();

  const roleInfo = userRole ? ROLE_INFO[userRole] : null;
  const activeListings = properties.slice(0, 5).length;
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <ChevronLeft size={24} color={COLORS.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Agent Profile</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{(userName || 'A').charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>{userName || 'Agent'}</Text>
          {!!businessName && <Text style={styles.businessName}>{businessName}</Text>}
          {roleInfo && (
            <View style={styles.roleBadge}>
              <Shield size={13} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.roleBadgeText}>{roleInfo.title}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/edit-profile')} activeOpacity={0.7}>
            <Pencil size={13} color={COLORS.primary} strokeWidth={2} />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{activeListings}</Text>
            <Text style={styles.statLabel}>Active Listings</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.ratingRow}>
              <Star size={16} color={COLORS.primary} fill={COLORS.primary} strokeWidth={0} />
              <Text style={styles.statValue}>4.8</Text>
            </View>
            <Text style={styles.statLabel}>Client Rating</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Contact Details</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailIconWrap}>
              <Phone size={16} color={COLORS.primary} strokeWidth={2} />
            </View>
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{userPhone || 'Not set'}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailIconWrap}>
              <MessageCircle size={16} color={COLORS.primary} strokeWidth={2} />
            </View>
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>WhatsApp</Text>
              <Text style={styles.detailValue}>{whatsappPhone || 'Not set'}</Text>
            </View>
          </View>
          <View style={[styles.detailRow, styles.lastRow]}>
            <View style={styles.detailIconWrap}>
              <Mail size={16} color={COLORS.primary} strokeWidth={2} />
            </View>
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{userEmail || 'Not set'}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/agent-dashboard/billing')} activeOpacity={0.7}>
          <View style={styles.detailIconWrap}>
            <Briefcase size={16} color={COLORS.primary} strokeWidth={2} />
          </View>
          <Text style={styles.linkText}>View Billing & Commission</Text>
          <ChevronRight size={18} color={COLORS.textSecondary} strokeWidth={2} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 48 : 16, paddingBottom: 16,
    backgroundColor: COLORS.bg,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.text, letterSpacing: -0.5 },
  scroll: { flex: 1 },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  contentDesktop: { width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: 32 },

  profileCard: { alignItems: 'center', gap: 6, paddingVertical: 8 },
  avatarCircle: {
    width: 76, height: 76, borderRadius: 38, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  avatarInitial: { fontSize: 30, fontWeight: '800', color: '#FFFFFF' },
  userName: { fontSize: 19, fontWeight: '800', color: COLORS.text },
  businessName: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  roleBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.primaryLight, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 6, marginTop: 8,
  },
  roleBadgeText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 12, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: COLORS.primary,
  },
  editBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },

  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: COLORS.border, gap: 4, alignItems: 'center',
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statValue: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, letterSpacing: -0.2 },
  detailsCard: {
    backgroundColor: COLORS.surface, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  lastRow: { borderBottomWidth: 0 },
  detailIconWrap: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  detailInfo: { flex: 1 },
  detailLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  detailValue: { fontSize: 14, color: COLORS.text, fontWeight: '700', marginTop: 1 },

  linkRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.surface, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  linkText: { flex: 1, fontSize: 14, fontWeight: '700', color: COLORS.text },
});
