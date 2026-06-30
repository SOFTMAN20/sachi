import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, Platform, Image, Alert, KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  X, ChevronLeft, Building2, Home as HomeIcon, BedSingle, Briefcase,
  Building, Plus, Minus, Check,
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { NEIGHBOURHOODS } from '@/data/mockData';
import { Property, PropertyType, FurnishingStatus, UserRole } from '@/types';

const COLORS = {
  primary: '#1B6B3A',
  primaryLight: '#E8F5E9',
  secondary: '#F5A623',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  bg: '#F8F9FA',
  surface: '#FFFFFF',
  danger: '#DC2626',
};

const STEPS = ['Role', 'Type', 'Basics', 'Location', 'Amenities', 'Photos', 'Pricing', 'Details', 'Review'] as const;

const TYPE_OPTIONS: { label: string; value: PropertyType; icon: typeof Building2 }[] = [
  { label: 'Apartment', value: 'apartment', icon: Building2 },
  { label: 'House', value: 'house', icon: HomeIcon },
  { label: 'Room', value: 'room', icon: BedSingle },
  { label: 'Hostel', value: 'hostel', icon: Building },
  { label: 'Office', value: 'office', icon: Briefcase },
  { label: 'Commercial', value: 'commercial', icon: Building },
];

const FURNISHING_OPTIONS: { label: string; value: FurnishingStatus }[] = [
  { label: 'Furnished', value: 'furnished' },
  { label: 'Semi-furnished', value: 'semi_furnished' },
  { label: 'Unfurnished', value: 'unfurnished' },
];

const HOST_ROLE_OPTIONS: { label: string; value: UserRole; description: string }[] = [
  { label: 'Landlord', value: 'landlord', description: 'I own this property' },
  { label: 'Agent', value: 'agent', description: 'I represent the owner' },
  { label: 'Property Manager', value: 'property_manager', description: 'I manage this property' },
];

const AMENITY_OPTIONS = [
  'Swimming Pool', 'Gym', 'Security', 'Generator', 'Parking', 'WiFi',
  'Elevator', 'CCTV', 'Water Tank', 'Garden', 'Balcony', 'Air Conditioning',
];

const SAMPLE_IMAGES = [
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=800',
];

const NEIGHBOURHOOD_OPTIONS = NEIGHBOURHOODS.filter(n => n !== 'All Areas');

function formatTZS(value: string) {
  const digits = value.replace(/[^0-9]/g, '');
  if (!digits) return '';
  return Number(digits).toLocaleString('en-US');
}

export default function AddListingScreen() {
  const router = useRouter();
  const { isLoggedIn, userName, requestLogin, addProperty, setUserRole } = useApp();

  const [step, setStep] = useState(0);
  const [hostRole, setHostRole] = useState<UserRole | null>(null);
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [furnishing, setFurnishing] = useState<FurnishingStatus>('unfurnished');
  const [address, setAddress] = useState('');
  const [neighbourhood, setNeighbourhood] = useState('');
  const [city, setCity] = useState('Dar es Salaam');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [monthlyRent, setMonthlyRent] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [estimatedUtilities, setEstimatedUtilities] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.lockScreen}>
          <View style={styles.lockIcon}>
            <Building2 size={36} color={COLORS.primary} strokeWidth={1.5} />
          </View>
          <Text style={styles.lockTitle}>Sign in to list a property</Text>
          <Text style={styles.lockSubtitle}>
            Create an account to post your property and reach thousands of renters.
          </Text>
          <TouchableOpacity
            style={styles.signInBtn}
            onPress={() => requestLogin('Sign in to add a new listing')}
            activeOpacity={0.85}
          >
            <Text style={styles.signInBtnText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/profile'))}
            style={{ marginTop: 8 }}
          >
            <Text style={styles.backLinkText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleAmenity = (a: string) => {
    setAmenities(prev => (prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]));
  };

  const toggleImage = (uri: string) => {
    setImages(prev => (prev.includes(uri) ? prev.filter(x => x !== uri) : [...prev, uri]));
  };

  const canProceed = (): boolean => {
    switch (STEPS[step]) {
      case 'Role':
        return hostRole !== null;
      case 'Type':
        return propertyType !== null;
      case 'Location':
        return address.trim().length > 0 && neighbourhood.trim().length > 0;
      case 'Photos':
        return images.length > 0;
      case 'Pricing':
        return monthlyRent.trim().length > 0;
      case 'Details':
        return title.trim().length > 0 && description.trim().length > 0;
      default:
        return true;
    }
  };

  const exitScreen = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/profile');
    }
  };

  const hasProgress =
    hostRole !== null || propertyType !== null || address.trim().length > 0 || neighbourhood.length > 0 ||
    amenities.length > 0 || images.length > 0 || monthlyRent.length > 0 ||
    title.trim().length > 0 || description.trim().length > 0;

  const handleClose = () => {
    if (!hasProgress) {
      exitScreen();
      return;
    }
    Alert.alert('Discard listing?', 'Your progress will be lost.', [
      { text: 'Keep editing', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: exitScreen },
    ]);
  };

  const handleBack = () => {
    if (step === 0) {
      handleClose();
    } else {
      setStep(s => s - 1);
    }
  };

  const handleNext = () => {
    if (!canProceed()) return;
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      handlePublish();
    }
  };

  const handlePublish = () => {
    const id = Date.now().toString();
    const newProperty: Property = {
      id,
      title: title.trim(),
      description: description.trim(),
      propertyType: propertyType ?? 'apartment',
      furnishing,
      bedrooms,
      bathrooms,
      monthlyRent: Number(monthlyRent.replace(/[^0-9]/g, '')) || 0,
      depositAmount: Number(depositAmount.replace(/[^0-9]/g, '')) || 0,
      estimatedUtilities: Number(estimatedUtilities.replace(/[^0-9]/g, '')) || 0,
      address: address.trim(),
      neighbourhood,
      city: city.trim() || 'Dar es Salaam',
      amenities,
      status: 'active',
      verifiedPhone: true,
      verifiedId: false,
      images,
      lat: -6.7924,
      lng: 39.2083,
      ownerName: userName || 'You',
      ownerAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200',
      ownerRating: 5.0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    // Persist the role the user chose while hosting so their account reflects
    // it (e.g. unlocks the matching dashboard on the profile screen).
    if (hostRole) {
      setUserRole(hostRole);
    }
    addProperty(newProperty);
    router.replace(`/property/${id}`);
  };

  const renderStep = () => {
    switch (STEPS[step]) {
      case 'Role':
        return (
          <View>
            <Text style={styles.stepTitle}>Start hosting as...</Text>
            <Text style={styles.stepSubtitle}>Choose how you're listing this property.</Text>
            <View style={styles.roleOptionsWrap}>
              {HOST_ROLE_OPTIONS.map(opt => {
                const active = hostRole === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.roleOption, active && styles.roleOptionActive]}
                    onPress={() => setHostRole(opt.value)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.roleOptionHeader}>
                      <Text style={[styles.roleOptionLabel, active && styles.roleOptionLabelActive]}>
                        {opt.label}
                      </Text>
                      {active && (
                        <View style={styles.roleCheck}>
                          <Check size={14} color="#FFFFFF" strokeWidth={3} />
                        </View>
                      )}
                    </View>
                    <Text style={[styles.roleOptionDesc, active && styles.roleOptionDescActive]}>
                      {opt.description}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      case 'Type':
        return (
          <View>
            <Text style={styles.stepTitle}>What type of property is this?</Text>
            <Text style={styles.stepSubtitle}>Choose the option that best describes your listing.</Text>
            <View style={styles.typeGrid}>
              {TYPE_OPTIONS.map(opt => {
                const Icon = opt.icon;
                const active = propertyType === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.typeCard, active && styles.typeCardActive]}
                    onPress={() => setPropertyType(opt.value)}
                    activeOpacity={0.85}
                  >
                    <Icon size={26} color={active ? COLORS.primary : COLORS.textSecondary} strokeWidth={1.8} />
                    <Text style={[styles.typeCardLabel, active && styles.typeCardLabelActive]}>{opt.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      case 'Basics':
        return (
          <View>
            <Text style={styles.stepTitle}>Tell us the basics</Text>
            <Text style={styles.stepSubtitle}>How many rooms, and how is it furnished?</Text>

            <Text style={styles.fieldLabel}>Bedrooms</Text>
            <View style={styles.stepperRow}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setBedrooms(n => Math.max(0, n - 1))}
              >
                <Minus size={18} color={COLORS.primary} strokeWidth={2.5} />
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{bedrooms}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setBedrooms(n => Math.min(20, n + 1))}
              >
                <Plus size={18} color={COLORS.primary} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Bathrooms</Text>
            <View style={styles.stepperRow}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setBathrooms(n => Math.max(0, n - 1))}
              >
                <Minus size={18} color={COLORS.primary} strokeWidth={2.5} />
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{bathrooms}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setBathrooms(n => Math.min(20, n + 1))}
              >
                <Plus size={18} color={COLORS.primary} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Furnishing</Text>
            <View style={styles.chipWrap}>
              {FURNISHING_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.chip, furnishing === opt.value && styles.chipActive]}
                  onPress={() => setFurnishing(opt.value)}
                >
                  <Text style={[styles.chipText, furnishing === opt.value && styles.chipTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'Location':
        return (
          <View>
            <Text style={styles.stepTitle}>Where is it located?</Text>
            <Text style={styles.stepSubtitle}>Renters will see the neighbourhood, not your exact address.</Text>

            <Text style={styles.fieldLabel}>Street address</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Toure Drive, Masaki"
              placeholderTextColor={COLORS.textSecondary}
              value={address}
              onChangeText={setAddress}
            />

            <Text style={styles.fieldLabel}>Neighbourhood</Text>
            <View style={styles.chipWrap}>
              {NEIGHBOURHOOD_OPTIONS.map(n => (
                <TouchableOpacity
                  key={n}
                  style={[styles.chip, neighbourhood === n && styles.chipActive]}
                  onPress={() => setNeighbourhood(n)}
                >
                  <Text style={[styles.chipText, neighbourhood === n && styles.chipTextActive]}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>City</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
        );

      case 'Amenities':
        return (
          <View>
            <Text style={styles.stepTitle}>What does this place offer?</Text>
            <Text style={styles.stepSubtitle}>Select all the amenities that apply.</Text>
            <View style={styles.chipWrap}>
              {AMENITY_OPTIONS.map(a => {
                const active = amenities.includes(a);
                return (
                  <TouchableOpacity
                    key={a}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => toggleAmenity(a)}
                  >
                    {active && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{a}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      case 'Photos':
        return (
          <View>
            <Text style={styles.stepTitle}>Add some photos</Text>
            <Text style={styles.stepSubtitle}>Tap to select photos for your listing ({images.length} selected).</Text>
            <View style={styles.photoGrid}>
              {SAMPLE_IMAGES.map(uri => {
                const active = images.includes(uri);
                return (
                  <TouchableOpacity key={uri} style={styles.photoTile} onPress={() => toggleImage(uri)} activeOpacity={0.85}>
                    <Image source={{ uri }} style={styles.photoImage} />
                    <View style={[styles.photoCheck, active && styles.photoCheckActive]}>
                      {active && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      case 'Pricing':
        return (
          <View>
            <Text style={styles.stepTitle}>Set your price</Text>
            <Text style={styles.stepSubtitle}>You can change this anytime.</Text>

            <Text style={styles.fieldLabel}>Monthly rent (TZS)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 750,000"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="number-pad"
              value={monthlyRent}
              onChangeText={t => setMonthlyRent(formatTZS(t))}
            />

            <Text style={styles.fieldLabel}>Deposit amount (TZS)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 1,500,000"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="number-pad"
              value={depositAmount}
              onChangeText={t => setDepositAmount(formatTZS(t))}
            />

            <Text style={styles.fieldLabel}>Estimated utilities (TZS)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 80,000"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="number-pad"
              value={estimatedUtilities}
              onChangeText={t => setEstimatedUtilities(formatTZS(t))}
            />
          </View>
        );

      case 'Details':
        return (
          <View>
            <Text style={styles.stepTitle}>Describe your place</Text>
            <Text style={styles.stepSubtitle}>A good title and description help renters decide faster.</Text>

            <Text style={styles.fieldLabel}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Cozy 2BR in Mikocheni B"
              placeholderTextColor={COLORS.textSecondary}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the property, nearby landmarks, and what makes it special..."
              placeholderTextColor={COLORS.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>
        );

      case 'Review': {
        const typeLabel = TYPE_OPTIONS.find(t => t.value === propertyType)?.label ?? '—';
        return (
          <View>
            <Text style={styles.stepTitle}>Review your listing</Text>
            <Text style={styles.stepSubtitle}>Make sure everything looks right before publishing.</Text>

            {images.length > 0 && (
              <Image source={{ uri: images[0] }} style={styles.reviewImage} />
            )}

            <Text style={styles.reviewListingTitle}>{title || 'Untitled listing'}</Text>
            <Text style={styles.reviewListingLocation}>{neighbourhood}, {city}</Text>

            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Listing as</Text>
              <Text style={styles.reviewValue}>
                {HOST_ROLE_OPTIONS.find(r => r.value === hostRole)?.label}
              </Text>
            </View>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Type</Text>
              <Text style={styles.reviewValue}>{typeLabel}</Text>
            </View>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Bedrooms / Bathrooms</Text>
              <Text style={styles.reviewValue}>{bedrooms} bed · {bathrooms} bath</Text>
            </View>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Furnishing</Text>
              <Text style={styles.reviewValue}>
                {FURNISHING_OPTIONS.find(f => f.value === furnishing)?.label}
              </Text>
            </View>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Monthly rent</Text>
              <Text style={styles.reviewValue}>TZS {monthlyRent || '0'}</Text>
            </View>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Deposit</Text>
              <Text style={styles.reviewValue}>TZS {depositAmount || '0'}</Text>
            </View>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Amenities</Text>
              <Text style={styles.reviewValue}>{amenities.length ? amenities.join(', ') : 'None'}</Text>
            </View>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Photos</Text>
              <Text style={styles.reviewValue}>{images.length} selected</Text>
            </View>
          </View>
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            if (step === 0) {
              handleClose();
            } else {
              handleBack();
            }
          }} 
          style={styles.headerBtn} 
          activeOpacity={0.6}
        >
          {step === 0
            ? <X size={22} color={COLORS.text} strokeWidth={2} />
            : <ChevronLeft size={24} color={COLORS.text} strokeWidth={2} />}
        </TouchableOpacity>
        <Text style={styles.headerStepText}>
          {step === 0 ? 'Step 0: Choose Role' : `Step ${step} of ${STEPS.length - 1}`}
        </Text>
        <View style={styles.headerBtn} />
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${(step / (STEPS.length - 1)) * 100}%` }]} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderStep()}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextBtn, !canProceed() && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!canProceed()}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {step === STEPS.length - 1 ? 'Publish listing' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 8,
    paddingBottom: 8,
  },
  headerBtn: { 
    width: 44, 
    height: 44, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  headerStepText: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  progressTrack: {
    height: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: 4, backgroundColor: COLORS.primary, borderRadius: 2 },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  stepTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text, letterSpacing: -0.3, marginBottom: 6 },
  stepSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 20, lineHeight: 20 },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
  },
  textArea: { height: 120, paddingTop: 14 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  typeCard: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingVertical: 22,
    alignItems: 'center',
    gap: 10,
  },
  typeCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  typeCardLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  typeCardLabelActive: { color: COLORS.primary, fontWeight: '700' },
  roleOptionsWrap: { gap: 12 },
  roleOption: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
  },
  roleOptionActive: { 
    borderColor: COLORS.primary, 
    backgroundColor: COLORS.primaryLight 
  },
  roleOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  roleOptionLabel: { 
    fontSize: 17, 
    fontWeight: '700', 
    color: COLORS.text 
  },
  roleOptionLabelActive: { 
    color: COLORS.primary 
  },
  roleCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleOptionDesc: { 
    fontSize: 14, 
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  roleOptionDescActive: { 
    color: COLORS.primary,
    fontWeight: '500',
  },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  stepperBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  stepperValue: { fontSize: 18, fontWeight: '700', color: COLORS.text, minWidth: 24, textAlign: 'center' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  chipTextActive: { color: '#FFFFFF' },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  photoTile: { width: '31%', aspectRatio: 1, borderRadius: 12, overflow: 'hidden' },
  photoImage: { width: '100%', height: '100%' },
  photoCheck: {
    position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center',
  },
  photoCheckActive: { backgroundColor: COLORS.primary },
  reviewImage: { width: '100%', height: 180, borderRadius: 16, marginBottom: 16 },
  reviewListingTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  reviewListingLocation: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2, marginBottom: 16 },
  reviewRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 12,
  },
  reviewLabel: { fontSize: 13, color: COLORS.textSecondary, flexShrink: 0 },
  reviewValue: { fontSize: 13, fontWeight: '600', color: COLORS.text, flex: 1, textAlign: 'right' },
  footer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  nextBtn: {
    backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center',
  },
  nextBtnDisabled: { opacity: 0.4 },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  lockScreen: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 16,
  },
  lockIcon: {
    width: 84, height: 84, borderRadius: 28, backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  lockTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text, textAlign: 'center', letterSpacing: -0.3 },
  lockSubtitle: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22 },
  signInBtn: {
    backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 15, paddingHorizontal: 32, marginTop: 8,
  },
  signInBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  backLinkText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
});
