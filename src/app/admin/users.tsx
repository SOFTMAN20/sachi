import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Platform, Image, TextInput, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft, Search, Shield, Ban, CheckCircle, AlertCircle, Mail, Phone,
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
  blue: '#2563EB',
  blueLight: '#E0F2FE',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  success: '#16A34A',
  warning: '#F59E0B',
};

type UserStatus = 'active' | 'suspended' | 'pending';

const STATUS_META: Record<UserStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: COLORS.success, bg: COLORS.primaryLight },
  suspended: { label: 'Suspended', color: COLORS.danger, bg: COLORS.dangerLight },
  pending: { label: 'Pending', color: COLORS.warning, bg: '#FEF3C7' },
};

const MOCK_USERS = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    email: 'ahmed.h@email.com',
    phone: '+255 712 345 678',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200',
    role: 'landlord',
    status: 'active' as UserStatus,
    properties: 3,
    joined: '15 Jan 2024',
    verified: true,
  },
  {
    id: '2',
    name: 'Fatuma Mwangi',
    email: 'fatuma.m@email.com',
    phone: '+255 755 789 012',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200',
    role: 'tenant',
    status: 'active' as UserStatus,
    properties: 0,
    joined: '22 Feb 2024',
    verified: true,
  },
  {
    id: '3',
    name: 'John Kimani',
    email: 'john.k@email.com',
    phone: '+255 744 567 890',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200',
    role: 'agent',
    status: 'pending' as UserStatus,
    properties: 1,
    joined: '05 Mar 2024',
    verified: false,
  },
  {
    id: '4',
    name: 'Grace Njoroge',
    email: 'grace.n@email.com',
    phone: '+255 767 234 567',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    role: 'landlord',
    status: 'suspended' as UserStatus,
    properties: 2,
    joined: '18 Dec 2023',
    verified: true,
  },
];

export default function AdminUsersScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;
  const { userRole } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | UserStatus>('all');

  if (userRole !== 'admin') {
    router.back();
    return null;
  }

  const filteredUsers = MOCK_USERS.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || user.status === activeTab;
    return matchesSearch && matchesTab;
  });

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
        <Text style={styles.title}>Users</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={18} color={COLORS.textSecondary} strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'all' && styles.tabActive]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
              All ({MOCK_USERS.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'active' && styles.tabActive]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
              Active ({MOCK_USERS.filter(u => u.status === 'active').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
            onPress={() => setActiveTab('pending')}
          >
            <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>
              Pending ({MOCK_USERS.filter(u => u.status === 'pending').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'suspended' && styles.tabActive]}
            onPress={() => setActiveTab('suspended')}
          >
            <Text style={[styles.tabText, activeTab === 'suspended' && styles.tabTextActive]}>
              Suspended ({MOCK_USERS.filter(u => u.status === 'suspended').length})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Users List */}
      <ScrollView 
        style={styles.scroll}
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
        showsVerticalScrollIndicator={false}
      >
        <View style={isDesktop ? styles.gridContainer : undefined}>
        {filteredUsers.map(user => {
          const statusMeta = STATUS_META[user.status];
          
          return (
            <TouchableOpacity key={user.id} style={styles.userCard} activeOpacity={0.9}>
              <View style={styles.userHeader}>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                <View style={styles.userInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.userName}>{user.name}</Text>
                    {user.verified && (
                      <CheckCircle size={16} color={COLORS.blue} fill={COLORS.blueLight} strokeWidth={2} />
                    )}
                  </View>
                  <Text style={styles.userRole}>{user.role}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusMeta.bg }]}>
                    <Text style={[styles.statusText, { color: statusMeta.color }]}>
                      {statusMeta.label}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.userDetails}>
                <View style={styles.detailRow}>
                  <Mail size={14} color={COLORS.textSecondary} strokeWidth={2} />
                  <Text style={styles.detailText}>{user.email}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Phone size={14} color={COLORS.textSecondary} strokeWidth={2} />
                  <Text style={styles.detailText}>{user.phone}</Text>
                </View>
              </View>

              <View style={styles.userStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user.properties}</Text>
                  <Text style={styles.statLabel}>Properties</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user.joined}</Text>
                  <Text style={styles.statLabel}>Joined</Text>
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
  searchSection: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.text,
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
  content: { padding: 20, gap: 12 },
  contentDesktop: { alignItems: 'center' },
  gridContainer: { 
    width: '100%', 
    maxWidth: 1200, 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 16,
  },
  userCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 14,
    ...(Platform.OS === 'web' ? { flex: 1, minWidth: 350, maxWidth: 580 } : {}),
  },
  userHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  userRole: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 2,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  userDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  userStats: {
    flexDirection: 'row',
    gap: 24,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statItem: {
    gap: 2,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
});
