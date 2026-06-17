import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useProtocol } from '../../hooks/useProtocol';
import { PRODUCTS, memberPrice, money, storeUrl, CAT_COLOR } from '../../constants/products';
import { Wordmark } from '../../components/Wordmark';
import { C } from '../../constants/theme';

export default function SupplyScreen() {
  const { user } = useAuth();
  const { profile, setCadence } = useProtocol(user?.uid ?? null);

  const protocolItems = PRODUCTS.filter(p => profile?.protocol.includes(p.id) ?? false);
  const subtotal = protocolItems.reduce((sum, p) => sum + memberPrice(p.price), 0);

  const reorder = () => Linking.openURL(storeUrl({ id: '', name: '', spec: '', price: 0, cat: 'Peptides' }));

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Wordmark />

      {/* Membership badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeStatus}>
          {profile?.membershipStatus === 'active' ? '● ACTIVE MEMBER' : '○ NOT A MEMBER'}
        </Text>
        <Text style={styles.badgePlan}>{profile?.membershipPlan !== 'none' ? profile?.membershipPlan : ''}</Text>
      </View>

      {/* Cadence selector */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>REORDER CADENCE</Text>
        <View style={styles.cadenceRow}>
          {([30, 60, 90] as const).map(d => (
            <TouchableOpacity
              key={d}
              style={[styles.cadenceBtn, profile?.cadence === d && styles.cadenceBtnOn]}
              onPress={() => setCadence(d)}
            >
              <Text style={[styles.cadenceTxt, profile?.cadence === d && styles.cadenceTxtOn]}>
                {d}d
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Protocol items */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>YOUR PROTOCOL</Text>
        {protocolItems.length === 0 && (
          <Text style={styles.empty}>Add items from the Catalog tab.</Text>
        )}
        {protocolItems.map(p => (
          <View key={p.id} style={styles.item}>
            <View style={styles.itemLeft}>
              <View style={[styles.dot, { backgroundColor: CAT_COLOR[p.cat] }]} />
              <View>
                <Text style={styles.itemName}>{p.name}</Text>
                <Text style={styles.itemSpec}>{p.spec}</Text>
              </View>
            </View>
            <Text style={styles.itemPrice}>{money(memberPrice(p.price))}</Text>
          </View>
        ))}
      </View>

      {/* Subtotal + reorder CTA */}
      {protocolItems.length > 0 && (
        <View style={styles.section}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal (member pricing)</Text>
            <Text style={styles.totalAmt}>{money(subtotal)}</Text>
          </View>
          <TouchableOpacity style={styles.reorderBtn} onPress={reorder}>
            <Text style={styles.reorderTxt}>Reorder at XLR8 Store →</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { padding: 20, gap: 20, paddingTop: 60 },
  badge: {
    backgroundColor: C.surface, borderRadius: 12, padding: 14,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  badgeStatus: { color: C.teal, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  badgePlan: { color: C.muted, fontSize: 12, textTransform: 'capitalize' },
  section: { gap: 10 },
  sectionLabel: { color: C.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1.2 },
  cadenceRow: { flexDirection: 'row', gap: 10 },
  cadenceBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 8,
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, alignItems: 'center',
  },
  cadenceBtnOn: { borderColor: C.accent, backgroundColor: C.surface2 },
  cadenceTxt: { color: C.muted, fontWeight: '600', fontSize: 15 },
  cadenceTxtOn: { color: C.accent },
  item: {
    backgroundColor: C.surface, borderRadius: 10, padding: 14,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  itemName: { color: C.ink, fontSize: 15, fontWeight: '600' },
  itemSpec: { color: C.muted, fontSize: 12, marginTop: 2 },
  itemPrice: { color: C.teal, fontWeight: '700', fontSize: 15 },
  empty: { color: C.muted, fontSize: 14, textAlign: 'center', paddingVertical: 20 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  totalLabel: { color: C.muted, fontSize: 13 },
  totalAmt: { color: C.ink, fontSize: 15, fontWeight: '700' },
  reorderBtn: {
    backgroundColor: C.accent, borderRadius: 12, padding: 16, alignItems: 'center',
  },
  reorderTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
