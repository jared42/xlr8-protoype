import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { Wordmark } from '../components/Wordmark';
import { C } from '../constants/theme';

const RUO_TEXT =
  'This application is intended for Research Use Only (RUO). ' +
  'Products managed herein are for laboratory and research purposes only. ' +
  'Not for diagnostic, therapeutic, or personal-consumption use. ' +
  'By continuing you confirm you are an authorized researcher.';

export default function GateScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [agreed, setAgreed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!agreed) { setError('You must accept the RUO terms to continue.'); return; }
    if (!email || !password) { setError('Email and password are required.'); return; }
    setError('');
    setBusy(true);
    try {
      if (mode === 'signin') await signIn(email, password);
      else await signUp(email, password);
    } catch (e: any) {
      setError(e?.message ?? 'Authentication failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Wordmark size={28} />

        <View style={styles.ruoBox}>
          <Text style={styles.ruoLabel}>RESEARCH USE ONLY</Text>
          <Text style={styles.ruoText}>{RUO_TEXT}</Text>
          <TouchableOpacity style={styles.checkRow} onPress={() => setAgreed(v => !v)}>
            <View style={[styles.checkbox, agreed && styles.checkboxOn]} />
            <Text style={styles.checkLabel}>I understand and agree</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={C.muted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={C.muted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={[styles.btn, !agreed && styles.btnDisabled]}
          onPress={submit}
          disabled={busy}
        >
          {busy
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>{mode === 'signin' ? 'Sign In' : 'Create Account'}</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode(m => m === 'signin' ? 'signup' : 'signin')}>
          <Text style={styles.toggle}>
            {mode === 'signin' ? 'New researcher? Create account' : 'Already have an account? Sign in'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: C.bg },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, gap: 16 },
  ruoBox: { backgroundColor: C.surface, borderRadius: 12, padding: 16, gap: 10 },
  ruoLabel: { color: C.accent, fontSize: 11, fontWeight: '700', letterSpacing: 1.2 },
  ruoText: { color: C.muted, fontSize: 13, lineHeight: 20 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: C.accent },
  checkboxOn: { backgroundColor: C.accent },
  checkLabel: { color: C.ink, fontSize: 14 },
  input: {
    backgroundColor: C.surface, borderRadius: 10, padding: 14,
    color: C.ink, fontSize: 16, borderWidth: 1, borderColor: C.line,
  },
  error: { color: '#FF6B6B', fontSize: 13, textAlign: 'center' },
  btn: {
    backgroundColor: C.accent, borderRadius: 10, padding: 16,
    alignItems: 'center', marginTop: 4,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  toggle: { color: C.teal, fontSize: 14, textAlign: 'center', marginTop: 4 },
});
