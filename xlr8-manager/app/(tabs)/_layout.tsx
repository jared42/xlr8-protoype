import { Tabs } from 'expo-router';
import { C } from '../../constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: C.surface,
          borderTopColor: C.line,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: C.accent,
        tabBarInactiveTintColor: C.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="supply"
        options={{ title: 'Supply', tabBarIcon: ({ color }) => <TabIcon label="📦" color={color} /> }}
      />
      <Tabs.Screen
        name="catalog"
        options={{ title: 'Catalog', tabBarIcon: ({ color }) => <TabIcon label="🧪" color={color} /> }}
      />
      <Tabs.Screen
        name="manage"
        options={{ title: 'Manage', tabBarIcon: ({ color }) => <TabIcon label="⚙️" color={color} /> }}
      />
    </Tabs>
  );
}

function TabIcon({ label, color }: { label: string; color: string }) {
  const { Text } = require('react-native');
  return <Text style={{ fontSize: 18 }}>{label}</Text>;
}
