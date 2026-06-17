import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useProtocol } from '../../hooks/useProtocol';
import { subscribeSpendLog, addSpendEntry, type SpendEntry } from '../../lib/firestore';
import { useEffect } from 'react';
import { money } from '../../constants/products';
import { C } from '../../constants/theme';

export default function ManageScreen() {
  const { user, logOut } = useAuth();
  const { profile } = useProtocol(user?.uid ?? null);
  const [spendLog, setSpendLog] = useState<SpendEntry[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeSpendLog(user.uid, setSpendLog);
    return unsub;
  }, [user?.uid]);

  const logShipment = () => {
    if (!user || !profile) return;
    Alert.prompt(
      'Log Shipment',
      'Enter total shipment cost ($)',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: (val) => {
            const total = parseFloat(val ?? '0');
            if (isNaN(total) || total <= 0) return;
            addSpendEntry(user.uid, {
              date: new Date().toISOString().slice(0, 10),
              shipmentTotal: total,
              items: profile.protocol.map(id => ({ productId: id, memberPrice: 0 })),
            }).catch(() => null);
          },
        },
      ],
      'plain-text',
      '',
      'decimal-pad',
    );
  };

  const totalSpend = spendLog.reduce((s, e) => s + e.shipmentTotal, 0);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Membership & Spend</Text>

      {/* Membership card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>MEMBERSHIP</Text>
        <View style={styles.row}>
          <Text style={styles.infoKey}>Status</Text>
          <Text style={[
            styles.infoVal,
            profile?.membershipStatus === 'active' ? styles.active : styles.inactive,
          ]}>
            {profile?.membershipStatus ?? '—'}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.infoKey}>Plan</Text>
          <Text style={styles.infoVal}>{profile?.membershipPlan ?? '—'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.infoKey}>Email</Text>
          <Text style={styles.infoVal}>{profile?.email ?? user?.email ?? '—'}</Text>
        </View>
      </View>

      {/* Spend log */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.cardLabel}>SPEND LOG</Text>
          <TouchableOpacity onPress={logShipment}>
            <Text style={styles.addBtn}>+ Log</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <Text style={styles.infoKey}>Total tracked</Text>
          <Text style={styles.totalAmt}>{money(totalSpend)}</Text>
        </View>
        {spendLog.length === 0 && (
          <Text style={styles.empty}>No shipments logged yet.</Text>
        )}
        {spendLog.map(e => (
          <View key={e.id} style={styles.logRow}>
            <Text style={styles.logDate}>{e.date}</Text>
            <Text style={styles.logAmt}>{money(e.shipmentTotal)}</Text>
          </View>
        ))}
      </View>

      {/* Sign out */}
      <TouchableOpacity style={styles.signoutBtn} onPress={logOut}>
        <Text style={styles.signoutTxt}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { padding: 20, gap: 16, paddingTop: 60 },
  header: { color: C.ink, fontSize: 22, fontWeight: '700' },
  card: { backgroundColor: C.surface, borderRadius: 14, padding: 16, gap: 12 },
  cardLabel: { color: C.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1.2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoKey: { color: C.muted, fontSize: 14 },
  infoVal: { color: C.ink, fontSize: 14, fontWeight: '600', textTransform: 'capitalize' },
  active: { color: C.teal },
  inactive: { color: C.muted },
  addBtn: { color: C.accent, fontSize: 14, fontWeight: '700' },
  totalAmt: { color: C.ink, fontSize: 16, fontWeight: '700' },
  empty: { color: C.muted, fontSize: 13, textAlign: 'center', paddingVertical: 8 },
  logRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 6, borderTopWidth: 1, borderTopColor: C.line,
  },
  logDate: { color: C.muted, fontSize: 13 },
  logAmt: { color: C.ink, fontSize: 14, fontWeight: '600' },
  signoutBtn: {
    borderRadius: 12, padding: 14, alignItems: 'center',
    borderWidth: 1, borderColor: C.line, marginTop: 8,
  },
  signoutTxt: { color: C.muted, fontSize: 15, fontWeight: '600' },
});
