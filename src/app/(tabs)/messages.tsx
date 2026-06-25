import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Image, Platform, Alert,
} from 'react-native';
import { MessageCircle, LogIn } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { MOCK_MESSAGES } from '@/data/mockData';

const COLORS = {
  primary: '#1B6B3A',
  primaryLight: '#E8F5E9',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  bg: '#F8F9FA',
  border: '#E5E7EB',
  surface: '#FFFFFF',
  secondary: '#F5A623',
};

export default function MessagesScreen() {
  const { isLoggedIn, requestLogin } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'web' ? 24 : insets.bottom + 100;

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
          <Text style={styles.headerSub}>Chats with landlords & agents</Text>
        </View>
        <View style={styles.lockScreen}>
          <View style={styles.lockIcon}>
            <MessageCircle size={36} color={COLORS.primary} strokeWidth={1.5} />
          </View>
          <Text style={styles.lockTitle}>Stay in touch</Text>
          <Text style={styles.lockSubtitle}>
            Sign in to message landlords, agents, and track your conversations.
          </Text>
          <TouchableOpacity
            style={styles.signInBtn}
            onPress={() => requestLogin('Sign in to view your messages')}
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
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerSub}>
          {MOCK_MESSAGES.length} {MOCK_MESSAGES.length === 1 ? 'conversation' : 'conversations'}
        </Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]} showsVerticalScrollIndicator={false}>
        {MOCK_MESSAGES.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptySubtitle}>
              Contact a landlord or agent from a property to start chatting
            </Text>
          </View>
        ) : (
          MOCK_MESSAGES.map(m => (
            <TouchableOpacity
              key={m.id}
              style={styles.row}
              activeOpacity={0.8}
              onPress={() => Alert.alert(m.otherParty, m.lastMessage)}
            >
              <Image source={{ uri: m.otherPartyAvatar }} style={styles.avatar} />
              <View style={styles.rowInfo}>
                <View style={styles.rowTop}>
                  <Text style={styles.otherParty} numberOfLines={1}>{m.otherParty}</Text>
                  <Text style={styles.time}>{m.lastMessageTime}</Text>
                </View>
                <Text style={styles.propertyTitle} numberOfLines={1}>{m.propertyTitle}</Text>
                <Text
                  style={[styles.lastMessage, m.unreadCount > 0 && styles.lastMessageUnread]}
                  numberOfLines={1}
                >
                  {m.lastMessage}
                </Text>
              </View>
              {m.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{m.unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: COLORS.text, letterSpacing: -0.5 },
  headerSub: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  rowInfo: { flex: 1, gap: 2 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  otherParty: { fontSize: 15, fontWeight: '700', color: COLORS.text, flex: 1 },
  time: { fontSize: 12, color: COLORS.textSecondary, marginLeft: 8 },
  propertyTitle: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  lastMessage: { fontSize: 13, color: COLORS.textSecondary },
  lastMessageUnread: { color: COLORS.text, fontWeight: '600' },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  lockScreen: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 40, gap: 16, paddingBottom: 80,
  },
  lockIcon: {
    width: 84, height: 84, borderRadius: 28, backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  lockTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text, textAlign: 'center', letterSpacing: -0.3 },
  lockSubtitle: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22 },
  signInBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.primary,
    borderRadius: 14, paddingVertical: 15, paddingHorizontal: 32, marginTop: 8,
  },
  signInBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyEmoji: { fontSize: 48, marginBottom: 4 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  emptySubtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 21 },
});
