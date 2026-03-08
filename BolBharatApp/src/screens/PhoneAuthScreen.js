import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signInWithRedirect, getCurrentUser, fetchAuthSession, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useAppDispatch } from '../store/hooks';
import { setAuthenticated } from '../store/slices/userSlice';
import useToast from '../hooks/useToast';
import theme from '../theme';

export default function PhoneAuthScreen({ navigation }) {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Listen for auth events from Cognito Hosted UI redirect
    const unsubscribe = Hub.listen('auth', async ({ payload }) => {
      console.log('Auth event:', payload.event);
      switch (payload.event) {
        case 'signInWithRedirect':
          // User successfully signed in via Hosted UI
          try {
            const user = await getCurrentUser();
            console.log('Signed in user:', user);
            dispatch(setAuthenticated(true));
            showToast('Authentication successful!', 'success');
            navigation.replace('UserProfileSetup');
          } catch (err) {
            console.error('Error getting current user:', err);
            setError('Sign in succeeded but failed to get user info.');
          }
          break;
        case 'signInWithRedirect_failure':
          console.error('Hosted UI sign in failed:', payload.data);
          setError('Sign in failed. Please try again.');
          showToast('Sign in failed', 'error');
          break;
      }
      setLoading(false);
    });

    // Check if user is already signed in
    checkCurrentUser();

    return () => unsubscribe();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        dispatch(setAuthenticated(true));
        navigation.replace('UserProfileSetup');
      }
    } catch (_) {
      // Not signed in — stay on this screen
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      // Clear any stale session
      try { await signOut(); } catch (_) {}

      // Open Cognito Hosted UI in browser
      await signInWithRedirect();
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err.message || 'Failed to open sign in page.');
      showToast('Failed to start sign in', 'error');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.stepContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="phone-portrait" size={64} color={theme.colors.primary} />
          </View>

          <Text style={styles.title}>Welcome to BolBharat</Text>
          <Text style={styles.subtitle}>
            Sign in with your phone number to get started
          </Text>
          <Text style={styles.subtitleHindi}>
            शुरू करने के लिए साइन इन करें
          </Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color={theme.colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.white} />
            ) : (
              <>
                <Ionicons name="log-in-outline" size={22} color={theme.colors.white} />
                <Text style={styles.primaryButtonText}>Sign In with Phone</Text>
                <Ionicons name="arrow-forward" size={20} color={theme.colors.white} />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.infoText}>
              You'll be redirected to a secure login page powered by AWS Cognito. Your data is safe and encrypted.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => {
              dispatch(setAuthenticated(true));
              navigation.replace('UserProfileSetup');
            }}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
            <Ionicons name="arrow-forward" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: theme.spacing.lg },
  stepContainer: { width: '100%', maxWidth: 400, alignSelf: 'center' },
  iconContainer: { alignItems: 'center', marginBottom: theme.spacing.xl },
  title: { fontSize: 28, fontWeight: '800', color: theme.colors.text, textAlign: 'center', marginBottom: theme.spacing.sm },
  subtitle: { fontSize: 16, color: theme.colors.textSecondary, textAlign: 'center', marginBottom: theme.spacing.xs },
  subtitleHindi: { fontSize: 14, color: theme.colors.textSecondary, textAlign: 'center', marginBottom: theme.spacing.xl },
  errorContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEE',
    padding: theme.spacing.sm, borderRadius: 8, marginBottom: theme.spacing.md, gap: theme.spacing.xs,
  },
  errorText: { flex: 1, fontSize: 13, color: theme.colors.error },
  primaryButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: theme.colors.primary, padding: theme.spacing.md,
    borderRadius: 12, gap: theme.spacing.sm,
  },
  buttonDisabled: { opacity: 0.6 },
  primaryButtonText: { fontSize: 16, fontWeight: '700', color: theme.colors.white },
  infoBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primaryLight,
    padding: theme.spacing.md, borderRadius: 12, marginTop: theme.spacing.lg, gap: theme.spacing.sm,
  },
  infoText: { flex: 1, fontSize: 13, color: theme.colors.textSecondary, lineHeight: 18 },
  skipButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: theme.spacing.md, marginTop: theme.spacing.lg, gap: theme.spacing.xs,
    borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12,
    backgroundColor: theme.colors.white,
  },
  skipButtonText: { fontSize: 15, fontWeight: '600', color: theme.colors.text },
});