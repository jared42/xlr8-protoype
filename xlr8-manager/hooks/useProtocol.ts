import { useState, useEffect } from 'react';
import { subscribeProfile, updateProtocol, updateCadence, type UserProfile } from '../lib/firestore';
import { scheduleRunwayReminder } from '../lib/notifications';

export function useProtocol(uid: string | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!uid) return;
    const unsub = subscribeProfile(uid, p => {
      setProfile(p);
      // Reschedule reminder whenever profile changes
      const days = Math.round(p.cadence * 0.7); // notional days until reorder
      scheduleRunwayReminder(days).catch(() => null);
    });
    return unsub;
  }, [uid]);

  const toggleItem = async (productId: string) => {
    if (!uid || !profile) return;
    const next = profile.protocol.includes(productId)
      ? profile.protocol.filter(id => id !== productId)
      : [...profile.protocol, productId];
    await updateProtocol(uid, next);
  };

  const setCadence = async (days: 30 | 60 | 90) => {
    if (!uid) return;
    await updateCadence(uid, days);
  };

  return { profile, toggleItem, setCadence };
}
