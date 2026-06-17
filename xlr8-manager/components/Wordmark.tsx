import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { C } from '../constants/theme';

interface WordmarkProps {
  size?: number;
}

export function Wordmark({ size = 22 }: WordmarkProps) {
  return (
    <Text style={[styles.text, { fontSize: size }]}>
      <Text style={styles.accent}>XLR8</Text>
      <Text style={styles.muted}> Continuity</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  accent: {
    color: '#FF5A1F',
  },
  muted: {
    color: '#EFF2F1',
    fontWeight: '400',
  },
});
