import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Platform, Alert, KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, User, Briefcase, Phone, MessageCircle, Mail } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';

const COLORS = {
  primary: '#1B6B3A',
  primaryLight: '#E8F5E9',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  bg: '#F8F9FA',
  border: '#E5E7EB',
  surface: '#FFFFFF',
};

export default function EditProfileScreen() {
  const router = useRouter();
  const { userName, businessName, userPhone, whatsappPhone, userEmail, updateProfile } = useApp();

  const [name, setName] = useState(userName);
  const [business, setBusiness] = useState(businessName);
  const [phone, setPhone] = useState(userPhone);
  const [whatsapp, setWhatsapp] = useState(whatsappPhone);
  const [email, setEmail] = useState(userEmail);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter your name.');
      return;
    }
    updateProfile({
      name: name.trim(),
      businessName: business.trim(),
      phone: phone.trim(),
      whatsappPhone: whatsapp.trim(),
      email: email.trim(),
    });
    Alert.alert('Profile updated', 'Your changes have been saved.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <ChevronLeft size={24} color={COLORS.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <View style={styles.backBtn} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrap}>
              <User size={18} color={COLORS.textSecondary} strokeWidth={2} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. John Mwangi"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Business Name (optional)</Text>
            <View style={styles.inputWrap}>
              <Briefcase size={18} color={COLORS.textSecondary} strokeWidth={2} />
              <TextInput
                style={styles.input}
                value={business}
                onChangeText={setBusiness}
                placeholder="e.g. Mwangi Properties"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputWrap}>
              <Phone size={18} color={COLORS.textSecondary} strokeWidth={2} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="+255 7XX XXX XXX"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>WhatsApp Number</Text>
            <View style={styles.inputWrap}>
              <MessageCircle size={18} color={COLORS.textSecondary} strokeWidth={2} />
              <TextInput
                style={styles.input}
                value={whatsapp}
                onChangeText={setWhatsapp}
                placeholder="+255 7XX XXX XXX"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrap}>
              <Mail size={18} color={COLORS.textSecondary} strokeWidth={2} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  title: { fontSize: 20, fontWeight: '800', color: COLORS.text, letterSpacing: -0.5 },
  scroll: { flex: 1 },
  content: { padding: 20, gap: 18, paddingBottom: 40 },
  field: { gap: 8 },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
  },
  input: { flex: 1, fontSize: 15, color: COLORS.text },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
