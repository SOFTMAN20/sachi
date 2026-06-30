import React, { useState, useRef } from 'react';
import {
  View, Text, Modal, TouchableOpacity, StyleSheet,
  TextInput, KeyboardAvoidingView, Platform, Pressable,
  Animated, useWindowDimensions,
} from 'react-native';
import { X, Phone, Shield, ArrowRight } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import GoogleIcon from '@/components/icons/GoogleIcon';
import PhoneIcon from '@/components/icons/PhoneIcon';

type Step = 'method' | 'phone' | 'otp';

const DESKTOP_BREAKPOINT = 900;

const COLORS = {
  primary: '#1B6B3A',
  primaryLight: '#E8F5E9',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  bg: '#F8F9FA',
  surface: '#FFFFFF',
  danger: '#DC2626',
};

export default function LoginModal() {
  const { showLoginModal, loginPromptMessage, dismissLoginModal, login } = useApp();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;
  const [step, setStep] = useState<Step>('method');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef<Array<TextInput | null>>([]);

  const handleClose = () => {
    dismissLoginModal();
    setTimeout(() => {
      setStep('method');
      setPhone('');
      setOtp(['', '', '', '', '', '']);
      setPhoneError('');
    }, 300);
  };

  const validatePhone = (num: string) => {
    const cleaned = num.replace(/\s/g, '');
    return cleaned.length >= 9;
  };

  const handleSendOtp = () => {
    const cleaned = phone.replace(/\s/g, '');
    if (!validatePhone(cleaned)) {
      setPhoneError('Enter a valid Tanzania phone number');
      return;
    }
    setPhoneError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1200);
  };

  const handleOtpChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
    if (newOtp.every(d => d !== '') && digit) {
      setTimeout(() => handleVerify(newOtp.join('')), 100);
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (code?: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const fullPhone = `+255${phone.replace(/\s/g, '').replace(/^0/, '')}`;
      login(fullPhone, '');
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    // TODO: Implement actual Google Sign-In
    setTimeout(() => {
      setLoading(false);
      // Mock Google login with sample data
      login('google@example.com', 'Google User');
    }, 1500);
  };

  const maskedPhone = `+255 *** *** ${phone.slice(-3) || '***'}`;

  return (
    <Modal
      visible={showLoginModal}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <Pressable style={[styles.overlay, isDesktop && styles.overlayDesktop]} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[styles.keyboardView, isDesktop && styles.keyboardViewDesktop]}
        >
          <Pressable style={[styles.sheet, isDesktop && styles.sheetDesktop]} onPress={e => e.stopPropagation()}>
            {/* Handle */}
            {!isDesktop && <View style={styles.handle} />}

            {/* Header */}
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>
                  {step === 'method' ? 'Sign In to Continue' : step === 'phone' ? 'Enter Phone Number' : 'Verify Phone'}
                </Text>
                <Text style={styles.sheetSubtitle} numberOfLines={2}>
                  {step === 'method' 
                    ? loginPromptMessage 
                    : step === 'phone' 
                    ? 'We\'ll send you a verification code' 
                    : `We sent a 6-digit code to ${maskedPhone}`}
                </Text>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                <X size={20} color={COLORS.textSecondary} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {step === 'method' ? (
              <View style={styles.stepContent}>
                {/* Login method selection */}
                <View style={styles.iconBanner}>
                  <Shield size={28} color={COLORS.primary} strokeWidth={1.8} />
                </View>

                <Text style={styles.methodHeading}>Choose how to sign in</Text>

                {/* Phone Login Button */}
                <TouchableOpacity
                  style={styles.methodBtn}
                  onPress={() => setStep('phone')}
                  activeOpacity={0.85}
                >
                  <View style={styles.methodIconWrap}>
                    <PhoneIcon size={22} />
                  </View>
                  <View style={styles.methodTextWrap}>
                    <Text style={styles.methodTitle}>Continue with Phone</Text>
                    <Text style={styles.methodSubtitle}>Sign in with phone number & OTP</Text>
                  </View>
                  <ArrowRight size={18} color={COLORS.textSecondary} strokeWidth={2} />
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Google Login Button */}
                <TouchableOpacity
                  style={[styles.methodBtn, styles.googleBtn]}
                  onPress={handleGoogleLogin}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <View style={[styles.methodIconWrap, styles.googleIconWrap]}>
                    <GoogleIcon size={22} />
                  </View>
                  <View style={styles.methodTextWrap}>
                    <Text style={styles.methodTitle}>
                      {loading ? 'Signing in...' : 'Continue with Google'}
                    </Text>
                    <Text style={styles.methodSubtitle}>Fast & secure sign in</Text>
                  </View>
                  <ArrowRight size={18} color={COLORS.textSecondary} strokeWidth={2} />
                </TouchableOpacity>

                <Text style={styles.termsText}>
                  By continuing, you agree to Sachi's{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>
            ) : step === 'phone' ? (
              <View style={styles.stepContent}>
                {/* Phone icon banner */}
                <View style={styles.iconBanner}>
                  <Phone size={28} color={COLORS.primary} strokeWidth={1.8} />
                </View>

                {/* Phone input */}
                <View style={[styles.phoneInputWrap, phoneError ? styles.phoneInputError : null]}>
                  <View style={styles.prefix}>
                    <Text style={styles.prefixFlag}>🇹🇿</Text>
                    <Text style={styles.prefixCode}>+255</Text>
                  </View>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="7XX XXX XXX"
                    placeholderTextColor={COLORS.textSecondary}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={t => {
                      setPhone(t);
                      setPhoneError('');
                    }}
                    maxLength={12}
                    autoFocus
                  />
                </View>
                {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

                <TouchableOpacity
                  style={[styles.primaryBtn, loading && styles.primaryBtnLoading]}
                  onPress={handleSendOtp}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>
                    {loading ? 'Sending...' : 'Send OTP'}
                  </Text>
                  {!loading && <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />}
                </TouchableOpacity>

                <Text style={styles.termsText}>
                  By continuing, you agree to Sachi's{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>
            ) : (
              <View style={styles.stepContent}>
                {/* Shield icon banner */}
                <View style={styles.iconBanner}>
                  <Shield size={28} color={COLORS.primary} strokeWidth={1.8} />
                </View>

                {/* OTP inputs */}
                <View style={styles.otpRow}>
                  {otp.map((digit, i) => (
                    <TextInput
                      key={i}
                      ref={r => { otpRefs.current[i] = r; }}
                      style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                      value={digit}
                      onChangeText={t => handleOtpChange(t, i)}
                      onKeyPress={e => handleOtpKeyPress(e, i)}
                      keyboardType="number-pad"
                      maxLength={1}
                      textAlign="center"
                      autoFocus={i === 0}
                      selectTextOnFocus
                    />
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.primaryBtn, (loading || !otp.every(d => d)) && styles.primaryBtnLoading]}
                  onPress={() => handleVerify()}
                  disabled={loading || !otp.every(d => d)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>
                    {loading ? 'Verifying...' : 'Verify & Continue'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setStep('method')} style={styles.resendBtn}>
                  <Text style={styles.resendText}>
                    Wrong number?{' '}
                    <Text style={styles.resendLink}>Change it</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  overlayDesktop: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  keyboardView: {
    justifyContent: 'flex-end',
  },
  keyboardViewDesktop: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  sheetDesktop: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 24,
    paddingBottom: 28,
    paddingTop: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    maxWidth: 260,
    lineHeight: 20,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 16,
  },
  iconBanner: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 4,
  },
  phoneInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  phoneInputError: {
    borderColor: '#DC2626',
  },
  prefix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
  },
  prefixFlag: {
    fontSize: 18,
  },
  prefixCode: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 16,
    fontSize: 17,
    color: '#1A1A2E',
    fontWeight: '500',
    letterSpacing: 1,
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
    marginTop: -8,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1B6B3A',
    borderRadius: 14,
    paddingVertical: 17,
  },
  primaryBtnLoading: {
    backgroundColor: '#9CA3AF',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  termsText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#1B6B3A',
    fontWeight: '600',
  },
  methodHeading: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 4,
  },
  methodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  googleBtn: {
    borderColor: '#DADCE0',
  },
  methodIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconWrap: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  methodTextWrap: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  methodSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  otpRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  otpBox: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A2E',
    backgroundColor: '#F9FAFB',
    textAlign: 'center',
  },
  otpBoxFilled: {
    borderColor: '#1B6B3A',
    backgroundColor: '#E8F5E9',
  },
  resendBtn: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  resendText: {
    fontSize: 14,
    color: '#6B7280',
  },
  resendLink: {
    color: '#1B6B3A',
    fontWeight: '600',
  },
});
