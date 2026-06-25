import React, { useEffect, useState } from 'react';
import {
  View, Text, Modal, TouchableOpacity, StyleSheet,
  ScrollView, Platform, useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Building2, Briefcase, Settings, ArrowRight, CheckCircle, X } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';

const DESKTOP_BREAKPOINT = 900;

const ROLES: { id: UserRole; title: string; subtitle: string; desc: string; icon: React.FC<any> }[] = [
  {
    id: 'tenant',
    title: 'Tenant',
    subtitle: 'Renter',
    desc: 'Find your perfect home to rent',
    icon: Search,
  },
  {
    id: 'landlord',
    title: 'Landlord',
    subtitle: 'Property Owner',
    desc: 'List and manage your properties',
    icon: Building2,
  },
  {
    id: 'agent',
    title: 'Agent',
    subtitle: 'Broker',
    desc: 'Connect tenants and property owners',
    icon: Briefcase,
  },
  {
    id: 'property_manager',
    title: 'Manager',
    subtitle: 'Property Manager',
    desc: 'Manage properties on behalf of owners',
    icon: Settings,
  },
  {
    id: 'admin',
    title: 'Admin',
    subtitle: 'Administrator',
    desc: 'Manage platform users and properties',
    icon: Settings,
  },
];

export default function RoleModal() {
  const { showRoleModal, userRole, setUserRole, dismissRoleModal } = useApp();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;
  const [selected, setSelected] = useState<UserRole | null>(null);

  useEffect(() => {
    if (showRoleModal) {
      setSelected(userRole);
    }
  }, [showRoleModal, userRole]);

  const handleContinue = () => {
    if (!selected) return;
    setUserRole(selected);
    dismissRoleModal();
  };

  return (
    <Modal
      visible={showRoleModal}
      animationType="fade"
      transparent={false}
      statusBarTranslucent
    >
      <LinearGradient
        colors={['#0D3D20', '#1B6B3A', '#2D8A52']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, isDesktop && styles.scrollContentDesktop]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {userRole && (
            <TouchableOpacity style={styles.closeBtn} onPress={dismissRoleModal} hitSlop={8}>
              <X size={20} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          )}

          {/* Brand Header */}
          <View style={[styles.header, isDesktop && styles.blockDesktop]}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>S</Text>
            </View>
            <Text style={styles.brandName}>Sachi</Text>
            <Text style={styles.tagline}>Africa's Intelligent Property Marketplace</Text>
          </View>

          {/* Prompt */}
          <View style={[styles.promptSection, isDesktop && styles.blockDesktop]}>
            <Text style={styles.promptTitle}>
              {userRole ? 'Change your role' : 'Welcome! How will you\nuse Sachi?'}
            </Text>
            <Text style={styles.promptSubtitle}>
              Choose your role to get a personalized experience
            </Text>
          </View>

          {/* Role Cards */}
          <View style={[styles.rolesGrid, isDesktop && styles.blockDesktop]}>
            {ROLES.map((role) => {
              const IconComponent = role.icon;
              const isSelected = selected === role.id;
              return (
                <TouchableOpacity
                  key={role.id}
                  style={[styles.roleCard, isSelected && styles.roleCardSelected]}
                  onPress={() => setSelected(role.id)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.roleIconWrap, isSelected && styles.roleIconWrapSelected]}>
                    <IconComponent
                      size={22}
                      color={isSelected ? '#1B6B3A' : '#FFFFFF'}
                      strokeWidth={2}
                    />
                  </View>
                  <View style={styles.roleTextWrap}>
                    <Text style={[styles.roleTitle, isSelected && styles.roleTitleSelected]}>
                      {role.title}
                    </Text>
                    <Text style={[styles.roleSubtitle, isSelected && styles.roleSubtitleSelected]}>
                      {role.desc}
                    </Text>
                  </View>
                  {isSelected && (
                    <CheckCircle size={20} color="#1B6B3A" strokeWidth={2.5} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* CTA */}
          <View style={[styles.ctaSection, isDesktop && styles.blockDesktop]}>
            <TouchableOpacity
              style={[styles.ctaButton, !selected && styles.ctaButtonDisabled]}
              onPress={handleContinue}
              disabled={!selected}
              activeOpacity={0.85}
            >
              <Text style={[styles.ctaText, !selected && styles.ctaTextDisabled]}>
                Get Started
              </Text>
              <ArrowRight size={20} color={selected ? '#1B6B3A' : '#9CA3AF'} strokeWidth={2.5} />
            </TouchableOpacity>

            <Text style={styles.footerNote}>
              You can change your role anytime in Settings
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: 40,
  },
  scrollContentDesktop: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockDesktop: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 48,
    right: 24,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  promptSection: {
    marginBottom: 32,
  },
  promptTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  promptSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.72)',
    textAlign: 'center',
    lineHeight: 22,
  },
  rolesGrid: {
    gap: 12,
    marginBottom: 32,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    gap: 14,
  },
  roleCardSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  roleIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleIconWrapSelected: {
    backgroundColor: '#E8F5E9',
  },
  roleTextWrap: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  roleTitleSelected: {
    color: '#1A1A2E',
  },
  roleSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 18,
  },
  roleSubtitleSelected: {
    color: '#6B7280',
  },
  ctaSection: {
    alignItems: 'center',
    gap: 16,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 10,
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    shadowOpacity: 0,
    elevation: 0,
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1B6B3A',
  },
  ctaTextDisabled: {
    color: '#9CA3AF',
  },
  footerNote: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
});
