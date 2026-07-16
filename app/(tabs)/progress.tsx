import { useFocusEffect } from 'expo-router';
import { Check } from 'phosphor-react-native';
import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BadgeCard } from '@/components/kids/BadgeCard';
import { StreakDisplay } from '@/components/kids/StreakDisplay';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { useActiveChild } from '@/hooks/useActiveChild';
import { sameDay } from '@/lib/dates';
import { fetchRecentSessions, type RecentSession } from '@/lib/sessions';
import { radius, tokens } from '@/lib/tokens';
import type { Badge as BadgeType } from '@/types';

const WEEK_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const BADGE_TYPES: BadgeType['type'][] = ['firstSession', 'streak', 'perfect', 'weeklyGoal'];
const HISTORY_LENGTH = 5;

function formatSessionDay(date: Date): string {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayMs = 86400000;
  const diffDays = Math.floor((startOfToday.getTime() - new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()) / dayMs);
  const slot = date.getHours() < 12 ? 'Morning' : 'Evening';
  if (diffDays <= 0) return `Today · ${slot}`;
  if (diffDays === 1) return `Yesterday · ${slot}`;
  return `${date.toLocaleDateString(undefined, { weekday: 'long' })} · ${slot}`;
}

/** Mon–Sun of the current week, marked done when any session landed that day. */
function buildWeek(sessions: RecentSession[]): { d: string; done: boolean }[] {
  const now = new Date();
  const mondayOffset = (now.getDay() + 6) % 7;
  return WEEK_LABELS.map((d, i) => {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - mondayOffset + i);
    return { d, done: sessions.some((s) => sameDay(s.completedAt, day)) };
  });
}

export default function ProgressScreen() {
  const { child } = useActiveChild();
  const [sessions, setSessions] = useState<RecentSession[] | null>(null);

  // Re-fetch on focus so the session just brushed appears immediately
  // (tab screens stay mounted, so a mount-only effect goes stale).
  useFocusEffect(
    useCallback(() => {
      if (!child) return;
      let cancelled = false;
      // 30 covers the week strip (max 14/wk) plus the history list.
      fetchRecentSessions(child.parentUid, child.id, 30).then((s) => {
        if (!cancelled) setSessions(s);
      });
      return () => {
        cancelled = true;
      };
    }, [child]),
  );

  const week = buildWeek(sessions ?? []);
  const earnedBadgeTypes = new Set((child?.badges ?? []).map((b) => b.type));
  const history = (sessions ?? [])
    .slice(0, HISTORY_LENGTH)
    .map((s) => ({ id: s.id, day: formatSessionDay(s.completedAt), score: s.score }));

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: tokens.surfacePage }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, rowGap: 22 }}>
        <Text className="font-display" style={{ fontSize: 26, color: tokens.textPrimary }}>
          {child?.name ? `${child.name}'s progress` : 'Progress'}
        </Text>

        <StreakDisplay days={child?.streakCurrent ?? 0} best={child?.streakBest ?? 0} />

        {/* This week */}
        <Card padding={18}>
          <SectionTitle>This week</SectionTitle>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {week.map((w, i) => (
              <View key={i} style={{ alignItems: 'center', rowGap: 8 }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: radius.pill,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: w.done ? tokens.brandPrimary : tokens.surfaceSunken,
                  }}
                >
                  {w.done ? <Check size={16} color="#fff" weight="bold" /> : null}
                </View>
                <Text className="font-bodySemibold" style={{ fontSize: 12, color: tokens.textTertiary }}>
                  {w.d}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Badges */}
        <View>
          <SectionTitle>Badges</SectionTitle>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ columnGap: 12, paddingBottom: 4 }}>
            {BADGE_TYPES.map((type) => (
              <BadgeCard key={type} type={type} earned={earnedBadgeTypes.has(type)} />
            ))}
          </ScrollView>
        </View>

        {/* History */}
        <View>
          <SectionTitle>Recent sessions</SectionTitle>
          {history.length > 0 ? (
            <Card padding={6}>
              {history.map((h, i) => (
                <View
                  key={h.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                    borderBottomWidth: i < history.length - 1 ? 1 : 0,
                    borderBottomColor: tokens.borderSubtle,
                  }}
                >
                  <Text className="font-bodySemibold" style={{ fontSize: 15, color: tokens.textPrimary }}>
                    {h.day}
                  </Text>
                  <Badge
                    tone={h.score >= 80 ? 'mint' : 'warning'}
                    solid={h.score >= 80}
                    label={`${h.score}/100`}
                  />
                </View>
              ))}
            </Card>
          ) : (
            <Card padding={18}>
              <Text className="font-bodySemibold" style={{ fontSize: 15, color: tokens.textSecondary }}>
                No sessions yet — time for the first brushing adventure!
              </Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
