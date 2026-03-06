import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setAuthenticated } from '../store/slices/userSlice';
import useToast from '../hooks/useToast';
import theme from '../theme';

/**
 * PhoneAuthScreen
 * 
 * Two-step authentication flow:
 * 1. Phone number input and send OTP
 * 2. OTP verification
 * 
 * Integrates with AWS Cognito for authentication
 */
export default function PhoneAuthScreen({ navigation }) {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  
  // Step: 'phone' or 'otp'
  const [step, setStep] = useState('phone');
  
  // Phone number state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  
  // OTP state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputs = useRef([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  
  // AWS Cognito session (will be set after sending OTP)
  const [cognitoSession, setCognitoSession] = useState(null);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  /**
   * Validate phone number
   */
  const validatePhoneNumber = (phone) => {
    // Indian phone numbers: 10 digits starting with 6-9
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  /**
   * Send OTP via AWS Cognito
   * TODO: Integrate with AWS Cognito SDK
   */
  const handleSendOTP = async () => {
    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: Replace with actual AWS Cognito signUp/signIn
      // Example with AWS Amplify:
      /*
      import { Auth } from 'aws-amplify';
      
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      
      // Try sign in first (existing user)
      try {
        const user = await Auth.signIn(fullPhoneNumber);
        setCognitoSession(user);
      } catch (signInError) {
        // User doesn't exist, sign up
        if (signInError.code === 'UserNotFoundException') {
          const { user } = await Auth.signUp({
            username: fullPhoneNumber,
            password: Math.random().toString(36), // Random password for phone auth
            attributes: {
              phone_number: fullPhoneNumber,
            },
          });
          setCognitoSession(user);
        } else {
          throw signInError;
        }
      }
      */

      // Mock implementation for development
      console.log('Sending OTP to:', countryCode + phoneNumber);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock success
      setCognitoSession({ phoneNumber: countryCode + phoneNumber });
      
      // Move to OTP step
      setStep('otp');
      setResendTimer(60); // 60 second cooldown
      showToast('OTP sent successfully!', 'success');
      
      // Focus first OTP input
      setTimeout(() => {
        otpInputs.current[0]?.focus();
      }, 100);
      
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError(err.message || 'Failed to send OTP. Please try again.');
      showToast('Failed to send OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verify OTP and complete authentication
   * TODO: Integrate with AWS Cognito confirmSignIn/confirmSignUp
   */
  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: Replace with actual AWS Cognito verification
      /*
      import { Auth } from 'aws-amplify';
      
      // Confirm sign in with OTP
      const user = await Auth.confirmSignIn(
        cognitoSession,
        otpCode,
        'SMS_MFA'
      );
      
      // Get user attributes
      const userInfo = await Auth.currentUserInfo();
      
      // Update Redux state
      dispatch(setAuthenticated({
        isAuthenticated: true,
        user: {
          id: userInfo.id,
          phoneNumber: userInfo.attributes.phone_number,
          name: userInfo.attributes.name || '',
        },
      }));
      */

      // Mock implementation for development
      console.log('Verifying OTP:', otpCode);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful verification
      dispatch(setAuthenticated(true));
      
      showToast('Authentication successful!', 'success');
      
      // Navigate to profile setup or home
      navigation.replace('UserProfileSetup');
      
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError(err.message || 'Invalid OTP. Please try again.');
      showToast('Invalid OTP', 'error');
      
      // Clear OTP inputs
      setOtp(['', '', '', '', '', '']);
      otpInputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resend OTP
   */
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    setError('');

    try {
      // TODO: Implement resend OTP logic with AWS Cognito
      /*
      await Auth.resendSignUp(cognitoSession.username);
      */
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResendTimer(60);
      showToast('OTP resent successfully!', 'success');
    } catch (err) {
      console.error('Error resending OTP:', err);
      showToast('Failed to resend OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle OTP input change
   */
  const handleOtpChange = (value, index) => {
    // Only allow digits
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (index === 5 && value && newOtp.every(digit => digit)) {
      handleVerifyOTP();
    }
  };

  /**
   * Handle OTP input backspace
   */
  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  /**
   * Render phone number input step
   */
  const renderPhoneStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <Ionicons name="phone-portrait" size={64} color={theme.colors.primary} />
      </View>

      <Text style={styles.title}>Enter Your Phone Number</Text>
      <Text style={styles.subtitle}>
        We'll send you a one-time password to verify your number
      </Text>
      <Text style={styles.subtitleHindi}>
        हम आपको एक OTP भेजेंगे
      </Text>

      <View style={styles.phoneInputContainer}>
        <View style={styles.countryCodeContainer}>
          <Text style={styles.countryCodeText}>{countryCode}</Text>
          <Ionicons name="chevron-down" size={16} color={theme.colors.textSecondary} />
        </View>
        
        <TextInput
          style={styles.phoneInput}
          placeholder="Phone Number"
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType="phone-pad"
          maxLength={10}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          editable={!loading}
        />
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color={theme.colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={handleSendOTP}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.white} />
        ) : (
          <>
            <Text style={styles.primaryButtonText}>Send OTP</Text>
            <Ionicons name="arrow-forward" size={20} color={theme.colors.white} />
          </>
        )}
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
        <Text style={styles.infoText}>
          Standard SMS charges may apply. We respect your privacy.
        </Text>
      </View>
    </View>
  );

  /**
   * Render OTP verification step
   */
  const renderOtpStep = () => (
    <View style={styles.stepContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          setStep('phone');
          setOtp(['', '', '', '', '', '']);
          setError('');
        }}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <View style={styles.iconContainer}>
        <Ionicons name="mail-outline" size={64} color={theme.colors.primary} />
      </View>

      <Text style={styles.title}>Enter Verification Code</Text>
      <Text style={styles.subtitle}>
        We sent a 6-digit code to {countryCode} {phoneNumber}
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => (otpInputs.current[index] = ref)}
            style={[
              styles.otpInput,
              digit && styles.otpInputFilled,
              error && styles.otpInputError,
            ]}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleOtpKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            editable={!loading}
          />
        ))}
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color={theme.colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={handleVerifyOTP}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.white} />
        ) : (
          <Text style={styles.primaryButtonText}>Verify & Continue</Text>
        )}
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        {resendTimer > 0 ? (
          <Text style={styles.resendTimerText}>
            Resend OTP in {resendTimer}s
          </Text>
        ) : (
          <TouchableOpacity onPress={handleResendOTP} disabled={loading}>
            <Text style={styles.resendButton}>
              Didn't receive? Resend OTP
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {step === 'phone' ? renderPhoneStep() : renderOtpStep()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  stepContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitleHindi: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
    gap: theme.spacing.xs,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  phoneInput: {
    flex: 1,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  otpInput: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: theme.colors.text,
  },
  otpInputFilled: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  otpInputError: {
    borderColor: theme.colors.error,
    backgroundColor: '#FEE',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE',
    padding: theme.spacing.sm,
    borderRadius: 8,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.error,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: 12,
    gap: theme.spacing.sm,
    ...theme.elevation.medium,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.white,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  resendButton: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  resendTimerText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    padding: theme.spacing.md,
    borderRadius: 12,
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});
