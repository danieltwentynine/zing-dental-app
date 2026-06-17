import { Check } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BadgeCard } from '@/components/kids/BadgeCard';
import { StreakDisplay } from '@/components/kids/StreakDisplay';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useActiveChild } from '@/hooks/useActiveChild';
import { fetchRecentSessions, type RecentSession } from '@/lib/sessions';
import { radius, tokens } from '@/lib/tokens';

const WEEK = [
  { d: 'M', done: true }, { d: 'T', done: true }, { d: 'W', done: true },
  { d: 'T', done: true }, { d: 'F', done: true }, { d: 'S', done: false }, { d: 'S', done: false },
];

// Shown until the child has real saved sessions to display.
const DEMO_HISTORY: { day: string; score: number }[] = [
  { day: 'Today · Morning', score: 88 },
  { day: 'Yesterday · Evening', score: 95 },
  { day: 'Yesterday · Morning', score: 72 },
];

function SectionTitle({ children }: { children: string }) {
  return (
    <Text className="font-display" style={{ fontSize: 19, color: tokens.textPrimary, marginBottom: 12 }}>
      {children}
    </Text>
  );
}

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

export default function ProgressScreen() {
  const { child } = useActiveChild();
  const [sessions, setSessions] = useState<RecentSession[] | null>(null);

  useEffect(() => {
    if (!child) return;
    let cancelled = false;
    fetchRecentSessions(child.id, 5).then((s) => {
      if (!cancelled) setSessions(s);
    });
    return () => {
      cancelled = true;
    };
  }, [child]);

  const history =
    sessions && sessions.length > 0
      ? sessions.map((s) => ({ day: formatSessionDay(s.completedAt), score: s.score }))
      : DEMO_HISTORY;

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
            {WEEK.map((w, i) => (
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
            <BadgeCard type="firstSession" earned caption="Day 1" />
            <BadgeCard type="streak" name="7-Day Streak" earned />
            <BadgeCard type="perfect" earned caption="95/100" />
            <BadgeCard type="weeklyGoal" earned={false} />
          </ScrollView>
        </View>

        {/* History */}
        <View>
          <SectionTitle>Recent sessions</SectionTitle>
          <Card padding={6}>
            {history.map((h, i) => (
              <View
                key={i}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
