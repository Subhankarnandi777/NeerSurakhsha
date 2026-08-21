import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Image, 
  useWindowDimensions, 
  ActivityIndicator,
  Modal,
  FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { useAppStore } from '../../store/main.store';
import { useAuthStore } from '../../store/auth.store';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';

const AVAILABLE_ROLES = [
  'ASHA Worker',
  'Jal Sahi',
  'PHED Officer',
  'Village Lead',
  'Citizen'
];

export default function Login() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isDesktop = width > 768;

  const setUserRole = useAppStore(state => state.setUserRole);
  const setUserName = useAppStore(state => state.setUserName);
  const setUserPhone = useAppStore(state => state.setUserPhone);

  const { signIn, signUp, isLoading, error, clearError, isConfigured, profile } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  // Login fields
  const [loginRole, setLoginRole] = useState('ASHA Worker');
  const [loginId, setLoginId] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [showLoginPin, setShowLoginPin] = useState(false);
  
  // Signup fields
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState('ASHA Worker');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Role selection modal
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectingRoleFor, setSelectingRoleFor] = useState<'login' | 'signup'>('login');

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setFormError(null);
    clearError();
  }, [activeTab]);

  const handleRoleSelect = (role: string) => {
    if (selectingRoleFor === 'login') {
      setLoginRole(role);
    } else {
      setSignupRole(role);
    }
    setRoleModalVisible(false);
  };

  const handleLoginSubmit = async () => {
    setFormError(null);
    clearError();

    if (!loginId.trim()) {
      setFormError('Please enter your mobile number or email address.');
      return;
    }

    if (!loginPin.trim()) {
      setFormError('Please enter your password or PIN.');
      return;
    }

    const res = await signIn(loginId, loginPin);

    if (res.success) {
      const activeRole = profile?.role || loginRole;
      setUserRole(activeRole);
      if (profile?.full_name) setUserName(profile.full_name);
      if (profile?.phone) setUserPhone(profile.phone);
      router.replace('/(tabs)/home');
    }
  };

  const handleSignupSubmit = async () => {
    setFormError(null);
    clearError();

    if (!signupName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    if (!signupPhone.trim()) {
      setFormError('Please enter your 10-digit mobile number.');
      return;
    }

    if (!signupEmail.trim() && !signupPhone.trim()) {
      setFormError('Please enter a valid email or phone number.');
      return;
    }

    if (!signupPassword.trim() || signupPassword.length < 6) {
      setFormError('Password / PIN must be at least 6 characters long.');
      return;
    }

    const targetEmail = signupEmail.trim() || `${signupPhone.trim()}@neersurakhsha.org`;

    const res = await signUp({
      email: targetEmail,
      password: signupPassword,
      fullName: signupName,
      phone: signupPhone,
      role: signupRole,
      villageName: 'Brahmapur Char',
    });

    if (res.success) {
      setUserRole(signupRole);
      setUserName(signupName);
      setUserPhone(signupPhone);
      router.replace('/(tabs)/home');
    }
  };

  const activeError = formError || error;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={[styles.splitLayout, !isDesktop && { flexDirection: 'column' }]}>
        {/* Left/Top Decor Image Area (Visible on larger screens) */}
        {isDesktop && (
          <View style={styles.imageHalf}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClvyaCj9n2OpA8CQAlTJfVuVvf9lu4Z9nAhCXr1aANVS5rzc0qUjIVeaqLsBUfm3IeruN_U6wkLJQjKiQ0GNBygfC3QHXv-yEihG56Sr9_RbOmq3nYVyDTR1Tme0M3JBBezdR6wV4krqjMHh97eozwaXixQeXLcj2EdY_YKHS-JuX0WPlD6GkDgEWDDrgmAQZ3si0UNx2ToD6mBgXGnMDRuyZApIgY3H-LLD8zecIg3-26-A4_uXY' }}
              style={styles.bgImage}
              resizeMode="cover"
            />
            <View style={styles.bgOverlay} />
            <View style={styles.bgTextContainer}>
              <Text style={styles.bgTitle}>Community Stewardship{"\n"}Through Technology</Text>
              <Text style={styles.bgDesc}>Secure access to vital water management and health resources.</Text>
            </View>
          </View>
        )}

        {/* Right/Bottom Login Area */}
        <View style={styles.formHalf}>
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.formInner}>
              
              <View style={styles.brandHeader}>
                <MaterialIcons name="water-drop" size={40} color={colors.primary} />
                <Text style={styles.brandText}>NEERSURAKSHA</Text>
              </View>

              {/* Supabase status notice */}
              {!isConfigured && (
                <View style={styles.demoNotice}>
                  <MaterialIcons name="info" size={18} color={colors.primary} />
                  <Text style={styles.demoNoticeText}>
                    Running in Demo Mode. Connect your Supabase keys in <Text style={{ fontFamily: 'Inter_700Bold' }}>.env</Text> for live auth.
                  </Text>
                </View>
              )}

              <View style={styles.cardBox}>
                {/* Segmented Toggle */}
                <View style={styles.toggleContainer}>
                  <TouchableOpacity 
                    style={[styles.toggleBtn, activeTab === 'login' && styles.toggleBtnActive]}
                    onPress={() => setActiveTab('login')}
                  >
                    <Text style={[styles.toggleText, activeTab === 'login' && styles.toggleTextActive]}>LOGIN</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.toggleBtn, activeTab === 'signup' && styles.toggleBtnActive]}
                    onPress={() => setActiveTab('signup')}
                  >
                    <Text style={[styles.toggleText, activeTab === 'signup' && styles.toggleTextActive]}>SIGN UP</Text>
                  </TouchableOpacity>
                </View>

                {/* Error Banner */}
                {activeError && (
                  <View style={styles.errorBanner}>
                    <MaterialIcons name="error-outline" size={20} color={colors.error} />
                    <Text style={styles.errorBannerText}>{activeError}</Text>
                  </View>
                )}

                {/* Login Form */}
                {activeTab === 'login' && (
                  <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Role</Text>
                      <TouchableOpacity 
                        style={styles.inputWrapper} 
                        onPress={() => { setSelectingRoleFor('login'); setRoleModalVisible(true); }}
                      >
                        <TextInput 
                          style={styles.input} 
                          value={loginRole} 
                          editable={false}
                          pointerEvents="none"
                        />
                        <MaterialIcons name="arrow-drop-down" size={24} color={colors.onSurfaceVariant} style={styles.inputIconRight} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Mobile Number / Email</Text>
                      <View style={styles.inputWrapper}>
                        <MaterialIcons name="person" size={20} color={colors.onSurfaceVariant} style={styles.inputIconLeft} />
                        <TextInput 
                          style={[styles.input, { paddingLeft: 40 }]} 
                          placeholder="Enter mobile or email" 
                          placeholderTextColor="rgba(67, 71, 76, 0.5)"
                          value={loginId}
                          onChangeText={setLoginId}
                          autoCapitalize="none"
                          keyboardType="email-address"
                        />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <View style={styles.labelRow}>
                        <Text style={styles.label}>PIN / Password</Text>
                      </View>
                      <View style={styles.inputWrapper}>
                        <MaterialIcons name="lock" size={20} color={colors.onSurfaceVariant} style={styles.inputIconLeft} />
                        <TextInput 
                          style={[styles.input, { paddingLeft: 40, paddingRight: 40 }]} 
                          placeholder="Enter PIN / Password" 
                          placeholderTextColor="rgba(67, 71, 76, 0.5)"
                          secureTextEntry={!showLoginPin}
                          value={loginPin}
                          onChangeText={setLoginPin}
                        />
                        <TouchableOpacity 
                          style={styles.inputIconRight} 
                          onPress={() => setShowLoginPin(!showLoginPin)}
                        >
                          <MaterialIcons 
                            name={showLoginPin ? 'visibility' : 'visibility-off'} 
                            size={20} 
                            color={colors.onSurfaceVariant} 
                          />
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity onPress={() => setFormError('Please contact your administrator to reset your PIN.')}>
                        <Text style={styles.forgotText}>Forgot PIN?</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity 
                      style={[styles.submitBtn, isLoading && { opacity: 0.7 }]} 
                      onPress={handleLoginSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator color={colors.onSecondary} size="small" />
                      ) : (
                        <Text style={styles.submitBtnText}>LOGIN</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}

                {/* Sign Up Form */}
                {activeTab === 'signup' && (
                  <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Full Name</Text>
                      <View style={styles.inputWrapper}>
                        <MaterialIcons name="badge" size={20} color={colors.onSurfaceVariant} style={styles.inputIconLeft} />
                        <TextInput 
                          style={[styles.input, { paddingLeft: 40 }]} 
                          placeholder="Enter your name" 
                          placeholderTextColor="rgba(67, 71, 76, 0.5)"
                          value={signupName}
                          onChangeText={setSignupName}
                        />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Mobile Number</Text>
                      <View style={styles.inputWrapper}>
                        <MaterialIcons name="call" size={20} color={colors.onSurfaceVariant} style={styles.inputIconLeft} />
                        <TextInput 
                          style={[styles.input, { paddingLeft: 40 }]} 
                          placeholder="10-digit number" 
                          placeholderTextColor="rgba(67, 71, 76, 0.5)"
                          keyboardType="phone-pad"
                          value={signupPhone}
                          onChangeText={setSignupPhone}
                        />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Email Address (Optional)</Text>
                      <View style={styles.inputWrapper}>
                        <MaterialIcons name="email" size={20} color={colors.onSurfaceVariant} style={styles.inputIconLeft} />
                        <TextInput 
                          style={[styles.input, { paddingLeft: 40 }]} 
                          placeholder="user@example.com" 
                          placeholderTextColor="rgba(67, 71, 76, 0.5)"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          value={signupEmail}
                          onChangeText={setSignupEmail}
                        />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Role Request</Text>
                      <TouchableOpacity 
                        style={styles.inputWrapper}
                        onPress={() => { setSelectingRoleFor('signup'); setRoleModalVisible(true); }}
                      >
                        <TextInput 
                          style={styles.input} 
                          value={signupRole} 
                          editable={false}
                          pointerEvents="none"
                        />
                        <MaterialIcons name="arrow-drop-down" size={24} color={colors.onSurfaceVariant} style={styles.inputIconRight} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>PIN / Password</Text>
                      <View style={styles.inputWrapper}>
                        <MaterialIcons name="lock" size={20} color={colors.onSurfaceVariant} style={styles.inputIconLeft} />
                        <TextInput 
                          style={[styles.input, { paddingLeft: 40, paddingRight: 40 }]} 
                          placeholder="Min 6 characters" 
                          placeholderTextColor="rgba(67, 71, 76, 0.5)"
                          secureTextEntry={!showSignupPassword}
                          value={signupPassword}
                          onChangeText={setSignupPassword}
                        />
                        <TouchableOpacity 
                          style={styles.inputIconRight} 
                          onPress={() => setShowSignupPassword(!showSignupPassword)}
                        >
                          <MaterialIcons 
                            name={showSignupPassword ? 'visibility' : 'visibility-off'} 
                            size={20} 
                            color={colors.onSurfaceVariant} 
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <TouchableOpacity 
                      style={[styles.submitBtnPrimary, isLoading && { opacity: 0.7 }]} 
                      onPress={handleSignupSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator color={colors.onPrimary} size="small" />
                      ) : (
                        <Text style={styles.submitBtnText}>REGISTER USER</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}

                {activeTab === 'login' && (
                  <View style={styles.registerPrompt}>
                    <Text style={styles.registerPromptText}>
                      Don't have an account?{' '}
                      <Text style={styles.registerPromptLink} onPress={() => setActiveTab('signup')}>
                        Register as a New User
                      </Text>
                    </Text>
                  </View>
                )}
              </View>

              {/* Emergency Contact */}
              <View style={styles.emergencyContainer}>
                <TouchableOpacity style={styles.emergencyBtn}>
                  <MaterialIcons name="emergency" size={16} color={colors.error} />
                  <Text style={styles.emergencyText}>Emergency Contact</Text>
                </TouchableOpacity>
                <Text style={styles.versionText}>v1.0.4 Civic Build</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Role Picker Modal */}
      <Modal visible={roleModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setRoleModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select User Role</Text>
            <FlatList
              data={AVAILABLE_ROLES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.roleItem}
                  onPress={() => handleRoleSelect(item)}
                >
                  <Text style={[
                    styles.roleItemText,
                    (selectingRoleFor === 'login' ? loginRole : signupRole) === item && styles.roleItemTextSelected
                  ]}>
                    {item}
                  </Text>
                  {(selectingRoleFor === 'login' ? loginRole : signupRole) === item && (
                    <MaterialIcons name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  splitLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  imageHalf: {
    flex: 1,
    display: 'flex',
    position: 'relative',
    backgroundColor: colors.surfaceVariant,
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(22, 40, 57, 0.4)',
  },
  bgTextContainer: {
    position: 'absolute',
    bottom: 64,
    left: 40,
    right: 40,
  },
  bgTitle: {
    ...typography.h2,
    fontSize: 32,
    color: colors.onPrimary,
    marginBottom: 24,
  },
  bgDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
    color: colors.onPrimary,
    opacity: 0.9,
  },
  formHalf: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  formInner: {
    flex: 1,
    paddingHorizontal: spacing.edgeMargin,
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  brandText: {
    ...typography.h2,
    fontSize: 26,
    color: colors.primary,
    letterSpacing: 0,
  },
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 106, 106, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    maxWidth: 400,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 106, 106, 0.2)',
  },
  demoNoticeText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: colors.onSurface,
    flex: 1,
  },
  cardBox: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 2,
    borderColor: 'rgba(22, 40, 57, 0.1)',
    padding: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'rgba(22, 40, 57, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainer,
    marginBottom: 20,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnActive: {
    backgroundColor: colors.primaryContainer,
  },
  toggleText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  toggleTextActive: {
    color: colors.onPrimaryContainer,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(186, 26, 26, 0.1)',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(186, 26, 26, 0.3)',
  },
  errorBannerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.error,
    flex: 1,
  },
  formContainer: {
    gap: 14,
  },
  inputGroup: {
    gap: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  label: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: colors.onSurface,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    height: 52,
    borderWidth: 2,
    borderColor: 'rgba(22, 40, 57, 0.2)',
    borderRadius: 4,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: colors.onSurface,
  },
  inputIconLeft: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  inputIconRight: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
  },
  forgotText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: colors.secondary,
    textAlign: 'right',
    marginTop: 4,
  },
  submitBtn: {
    height: 56,
    backgroundColor: colors.secondary,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  submitBtnPrimary: {
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  submitBtnText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 20,
    color: colors.onSecondary,
    textTransform: 'uppercase',
  },
  registerPrompt: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: colors.surfaceContainerHigh,
    alignItems: 'center',
  },
  registerPromptText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  registerPromptLink: {
    fontFamily: 'Inter_700Bold',
    color: colors.primary,
  },
  emergencyContainer: {
    marginTop: 32,
    alignItems: 'center',
    gap: 8,
  },
  emergencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(186, 26, 26, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
  },
  emergencyText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: colors.error,
  },
  versionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: colors.onSurfaceVariant,
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    ...typography.h3,
    fontSize: 18,
    color: colors.onSurface,
    marginBottom: 16,
  },
  roleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHigh,
  },
  roleItemText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: colors.onSurface,
  },
  roleItemTextSelected: {
    fontFamily: 'Inter_700Bold',
    color: colors.primary,
  },
});
