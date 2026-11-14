import { Button } from '@/components/button';
import { DayCard } from '@/components/day-card';
import { Screen } from '@/components/screen';
import { MEALS_BY_ID } from '@/data/meals';
import { tap } from '@/lib/haptics';
import { todayIndex, weekRangeLabel } from '@/lib/week';
import { actions, useAppState } from '@/store/app-store';

export default function PlanScreen() {
  const { plan, locked } = useAppState();
  const today = todayIndex();
  const allLocked = locked.every(Boolean);

  return (
    <Screen
      title="Haftalık Plan"
      subtitle={weekRangeLabel()}
      action={
        <Button
          label="Karıştır"
          icon="shuffle"
          variant="primary"
          disabled={allLocked}
          onPress={() => {
            tap();
            actions.shuffle();
          }}
        />
      }>
      {plan.map((id, day) => (
        <DayCard
          key={day}
          day={day}
          meal={id ? MEALS_BY_ID[id] : undefined}
          locked={locked[day]}
          isToday={day === today}
        />
      ))}
    </Screen>
  );
}
