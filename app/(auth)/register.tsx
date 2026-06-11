import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Controller, useForm, type Control, type FieldPath } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { COLORS } from '@/lib/constants';
import { auth, db } from '@/lib/firebase';

const registerSchema = z
  .object({
    displayName: z.string().trim().min(2, 'Please tell us your name'),
    email: z.string().trim().email("That email address doesn't look right"),
    password: z.string().min(8, 'Your password needs at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "The passwords don't match",
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

function registrationErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Try logging in instead.';
      case 'auth/invalid-email':
        return "That email address doesn't look right. Please check it.";
      case 'auth/weak-password':
        return 'Please choose a stronger password (at least 8 characters).';
      case 'auth/network-request-failed':
        return 'No connection. Please check your internet and try again.';
    }
  }
  return "We couldn't create your account right now. Please try again.";
}

interface FormFieldProps extends Pick<TextInputProps, 'autoCapitalize' | 'keyboardType' | 'secureTextEntry'> {
  control: Control<RegisterFormValues>;
  name: FieldPath<RegisterFormValues>;
  label: string;
  placeholder: string;
}

function FormField({ control, name, label, placeholder, ...inputProps }: FormFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View className="mb-4">
          <Text className="mb-1.5 font-bodySemibold text-sm text-ink">{label}</Text>
          <TextInput
            className={`h-14 rounded-2xl border bg-surface px-4 font-body text-base text-ink ${
              error ? 'border-danger' : 'border-slate-200'
            }`}
            placeholder={placeholder}
            placeholderTextColor={COLORS.textSecondary}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            {...inputProps}
          />
          {error ? (
            <Text className="mt-1 font-body text-sm text-danger">{error.message}</Text>
          ) : null}
        </View>
      )}
    />
  );
}

export default function RegisterScreen() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { control, handleSubmit, formState } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async ({ displayName, email, password }: RegisterFormValues) => {
    setSubmitError(null);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName });
      await setDoc(doc(db, 'users', credential.user.uid), {
        email,
        displayName,
        createdAt: serverTimestamp(),
      });
      router.replace('/onboarding/child-setup');
    } catch (error) {
      setSubmitError(registrationErrorMessage(error));
    }
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-8"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-8">
            <Text className="font-display text-3xl text-ink">Welcome to Zing</Text>
            <Text className="mt-2 font-body text-base text-muted">
              Create your parent account to start your child's brushing adventure.
            </Text>
          </View>

          <FormField
            control={control}
            name="displayName"
            label="Your name"
            placeholder="e.g. Maria"
            autoCapitalize="words"
          />
          <FormField
            control={control}
            name="email"
            label="Email"
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <FormField
            control={control}
            name="password"
            label="Password"
            placeholder="At least 8 characters"
            autoCapitalize="none"
            secureTextEntry
          />
          <FormField
            control={control}
            name="confirmPassword"
            label="Confirm password"
            placeholder="Type it again"
            autoCapitalize="none"
            secureTextEntry
          />

          {submitError ? (
            <Text className="mb-4 font-bodySemibold text-sm text-danger">{submitError}</Text>
          ) : null}

          <Button
            label="Create account"
            onPress={handleSubmit(onSubmit)}
            loading={formState.isSubmitting}
          />

          <View className="mt-6 flex-row justify-center">
            <Text className="font-body text-muted">Already have an account? </Text>
            <Link href="/(auth)/login" className="font-bodySemibold text-primary">
              Log in
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}
