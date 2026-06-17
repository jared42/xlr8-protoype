import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useProtocol } from '../../hooks/useProtocol';
import { PRODUCTS, CAT_COLOR, memberPrice, money, type Category } from '../../constants/products';
import { C } from '../../constants/theme';

const CATS: Category[] = ['Peptides', 'Nootropics', 'Supplies'];

export default function CatalogScreen() {
  const { user } = useAuth();
  const { profile, toggleItem } = useProtocol(user?.uid ?? null);
  const [activecat, setActiveCat] = useState<Category | 'All'>('All');

  const filtered = activecat === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.cat === activecat);
  const isMember = profile?.membershipStatus === 'active';

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Research Catalog</Text>

      {/* Category filter pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pills}>
        {(['All', ...CATS] as const).map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.pill, activecat === cat && styles.pillOn]}
            onPress={() => setActiveCat(cat)}
          >
            <Text style={[styles.pillTxt, activecat === cat && styles.pillTxtOn]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filtered.map(p => {
        const inProtocol = profile?.protocol.includes(p.id) ?? false;
        const catColor = CAT_COLOR[p.cat];
        return (
          <View key={p.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.cardLeft}>
                <View style={[styles.catPill, { backgroundColor: catColor + '22' }]}>
                  <Text style={[styles.catLabel, { color: catColor }]}>{p.cat}</Text>
                </View>
                {p.tag && <Text style={styles.tag}>{p.tag}</Text>}
              </View>
              <TouchableOpacity
                style={[styles.toggleBtn, inProtocol && styles.toggleBtnOn]}
                onPress={() => toggleItem(p.id)}
              >
                <Text style={[styles.toggleTxt, inProtocol && styles.toggleTxtOn]}>
                  {inProtocol ? '− Remove' : '+ Protocol'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.productName}>{p.name}</Text>
            <Text style={styles.productSpec}>{p.spec}</Text>
            <View style={styles.priceRow}>
              <View>
                <Text style={styles.retailLabel}>Retail</Text>
                <Text style={styles.retailPrice}>{money(p.price)}</Text>
              </View>
              <View style={styles.memberPriceCol}>
                <Text style={styles.memberLabel}>Member (15% off)</Text>
                <Text style={[styles.memberPrice, { color: isMember ? C.teal : C.muted }]}>
                  {money(memberPrice(p.price))}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { padding: 20, gap: 14, paddingTop: 60 },
  header: { color: C.ink, fontSize: 22, fontWeight: '700' },
  pills: { flexGrow: 0, marginBottom: 4 },
  pill: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: C.surface, marginRight: 8, borderWidth: 1, borderColor: C.line,
  },
  pillOn: { borderColor: C.accent, backgroundColor: C.surface2 },
  pillTxt: { color: C.muted, fontSize: 13, fontWeight: '600' },
  pillTxtOn: { color: C.accent },
  card: { backgroundColor: C.surface, borderRadius: 14, padding: 16, gap: 8 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardLeft: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  catPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  catLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  tag: { color: C.muted, fontSize: 11 },
  toggleBtn: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
    backgroundColor: C.surface2, borderWidth: 1, borderColor: C.line,
  },
  toggleBtnOn: { borderColor: C.accent },
  toggleTxt: { color: C.muted, fontSize: 12, fontWeight: '700' },
  toggleTxtOn: { color: C.accent },
  productName: { color: C.ink, fontSize: 17, fontWeight: '700' },
  productSpec: { color: C.muted, fontSize: 13 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 6 },
  retailLabel: { color: C.muted, fontSize: 11 },
  retailPrice: { color: C.muted, fontSize: 14 },
  memberPriceCol: { alignItems: 'flex-end' },
  memberLabel: { color: C.muted, fontSize: 11 },
  memberPrice: { fontSize: 16, fontWeight: '700' },
});
