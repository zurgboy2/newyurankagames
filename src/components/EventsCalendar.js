import { useMemo, useState } from 'react';
import moment from 'moment';
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from './ui/drawer';
import { Skeleton } from './ui/skeleton';

const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const frequencyBadgeStyles = {
  weekly: 'border-white/90 bg-white/90 text-black',
  oneTime: 'border-highlight/80 bg-highlight/60 text-white',
  monthly: 'border-muted-foreground/30 bg-muted-foreground/15 text-foreground',
};

const frequencySurfaceStyles = {
  weekly: 'border-white/90 bg-white/90 text-black',
  oneTime: 'border-highlight/80 bg-highlight/60 text-white',
  monthly: 'border-muted-foreground/30 bg-muted-foreground/15 text-foreground',
};

const frequencyLabels = {
  oneTime: 'One-time',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

const formatTypeLabel = (value) => {
  if (!value) return 'Event';
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const EventsCalendar = ({ tournaments, onEventClick, loading }) => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [activeDay, setActiveDay] = useState(null);

  const calendarDays = useMemo(() => {
    const firstDay = moment([currentDate.year(), currentDate.month(), 1]);
    const lastDay = moment(firstDay).endOf('month');
    const days = [];

    for (let i = 0; i < firstDay.day(); i += 1) {
      days.push({ key: `empty-${i}`, empty: true });
    }

    for (let day = 1; day <= lastDay.date(); day += 1) {
      const date = moment([currentDate.year(), currentDate.month(), day]);
      const dateKey = date.format('YYYY-MM-DD');
      const dayEvents = tournaments.filter(
        (event) => moment(event.date).format('YYYY-MM-DD') === dateKey,
      );

      days.push({ key: dateKey, date, events: dayEvents });
    }

    const totalCells = Math.ceil(days.length / 7) * 7;
    while (days.length < totalCells) {
      days.push({ key: `tail-${days.length}`, empty: true });
    }

    return days;
  }, [currentDate, tournaments]);

  const monthEvents = useMemo(
    () =>
      calendarDays
        .filter((day) => !day.empty && day.events.length > 0)
        .map((day) => ({
          key: day.key,
          date: day.date,
          events: day.events,
        })),
    [calendarDays],
  );

  const changeMonth = (increment) => {
    setCurrentDate((date) => moment(date).add(increment, 'months'));
  };

  const openDayDrawer = (day) => {
    if (day.events.length === 0) return;
    setActiveDay(day);
  };

  const isToday = (date) => moment().isSame(date, 'day');

  return (
    <Card className="p-0">
      <CardHeader className="border-b p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-highlight">
              Calendar
            </p>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <CalendarDaysIcon className="size-6 text-highlight" />
              Monthly Events Calendar
            </CardTitle>
            <div className="flex flex-wrap gap-2 mt-3">
              {Object.entries(frequencyLabels).map(([key, label]) => (
                <Badge
                  key={key}
                  variant="outline"
                  className={frequencyBadgeStyles[key]}
                >
                  {label}
                </Badge>
              ))}
            </div>
          </div>

          <div className="items-center justify-between gap-2 hidden md:flex">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Previous month"
              onClick={() => changeMonth(-1)}
            >
              <ChevronLeftIcon />
            </Button>
            <div className="min-w-40 text-center text-lg font-semibold">
              {currentDate.format('MMMM YYYY')}
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Next month"
              onClick={() => changeMonth(1)}
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardHeader class="border-b p-5 pt-2 md:hidden">
        <div className="flex items-center justify-between gap-2 md:justify-end">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Previous month"
            onClick={() => changeMonth(-1)}
          >
            <ChevronLeftIcon />
          </Button>
          <div className="min-w-40 text-center text-lg font-semibold">
            {currentDate.format('MMMM YYYY')}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Next month"
            onClick={() => changeMonth(1)}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-5">
        {loading ? (
          <CalendarSkeleton />
        ) : (
          <>
            <div className="space-y-3 md:hidden">
              {monthEvents.length === 0 ? (
                <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                  No events scheduled this month yet.
                </div>
              ) : (
                monthEvents.map((day) => (
                  <div
                    key={day.key}
                    className={`rounded-lg border bg-card p-4 ${
                      isToday(day.date)
                        ? 'border-highlight/60 ring-1 ring-highlight/30'
                        : ''
                    }`}
                  >
                    <div className="mb-3 flex items-baseline justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">
                          {day.date.format('ddd, MMM D')}
                        </div>
                        {isToday(day.date) && <Badge>Today</Badge>}
                      </div>
                      <Badge variant="outline">
                        {day.events.length} events
                      </Badge>
                    </div>
                    <div className="grid gap-2">
                      {day.events.map((event) => (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => onEventClick(event)}
                          className={`rounded-md border px-3 py-2 text-left transition-colors duration-200 hover:border-highlight/70 hover:bg-background/70 ${
                            frequencySurfaceStyles[event.eventFrequencyType] ||
                            frequencySurfaceStyles.weekly
                          }`}
                        >
                          <div className="text-sm font-medium text-foreground">
                            {event.name}
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge
                              variant="outline"
                              className={`h-5 px-1.5 py-0 text-[10px] ${
                                frequencyBadgeStyles[
                                  event.eventFrequencyType
                                ] || frequencyBadgeStyles.weekly
                              }`}
                            >
                              {frequencyLabels[event.eventFrequencyType] ||
                                'Event'}
                            </Badge>
                            <span>{moment(event.date).format('h:mm A')}</span>
                            <span className="truncate">
                              {formatTypeLabel(event.eventType)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="hidden md:block">
              <div className="grid grid-cols-7 gap-2">
                {weekdays.map((day) => (
                  <div
                    key={day}
                    className="py-2 text-center text-xs font-semibold text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}

                {calendarDays.map((day) =>
                  day.empty ? (
                    <div
                      key={day.key}
                      className="min-h-36 rounded-lg border border-dashed border-border/50 bg-muted/10"
                    />
                  ) : (
                    <div
                      key={day.key}
                      className={`flex min-h-36 flex-col overflow-hidden rounded-lg border bg-card p-2 ${
                        isToday(day.date)
                          ? 'border-highlight/60 ring-1 ring-highlight/30'
                          : ''
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-semibold ${
                              isToday(day.date) ? 'text-highlight' : ''
                            }`}
                          >
                            {day.date.date()}
                          </span>
                          {isToday(day.date) && (
                            <span className="text-[10px] font-medium uppercase tracking-wide text-highlight">
                              Today
                            </span>
                          )}
                        </div>
                        {day.events.length > 0 && (
                          <Badge
                            variant="outline"
                            className="px-1.5 py-0 text-[10px] min-w-5"
                          >
                            {day.events.length}
                          </Badge>
                        )}
                      </div>

                      <div className="grid flex-1 content-start gap-1.5 overflow-hidden">
                        {day.events.slice(0, 2).map((event) => (
                          <button
                            key={event.id}
                            type="button"
                            onClick={() => onEventClick(event)}
                            className={`w-full overflow-hidden rounded-md border px-2 py-1.5 text-left text-[11px] leading-tight transition-colors duration-200 hover:border-highlight/70 hover:bg-background/70 ${
                              frequencySurfaceStyles[
                                event.eventFrequencyType
                              ] || frequencySurfaceStyles.weekly
                            }`}
                          >
                            <div className="truncate font-medium">
                              {event.name}
                            </div>
                            <div className="mt-0.5 truncate opacity-80">
                              {moment(event.date).format('h:mm A')}
                            </div>
                          </button>
                        ))}

                        {day.events.length > 2 && (
                          <button
                            type="button"
                            onClick={() => openDayDrawer(day)}
                            className="rounded-md border border-dashed px-2 py-1.5 text-left text-[11px] text-muted-foreground transition-colors duration-200 hover:border-highlight/70 hover:bg-background/70 hover:text-foreground"
                          >
                            +{day.events.length - 2} more events
                          </button>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>

      <Drawer
        open={Boolean(activeDay)}
        onOpenChange={(open) => !open && setActiveDay(null)}
      >
        <DrawerContent className="max-h-[85vh]">
          <div className="mx-auto flex w-full max-w-3xl flex-col overflow-hidden">
            <DrawerHeader className="px-4 text-left sm:px-6">
              <DrawerTitle>
                {activeDay
                  ? activeDay.date.format('dddd, MMMM D')
                  : 'Day events'}
              </DrawerTitle>
              <DrawerDescription>
                {activeDay ? `${activeDay.events.length} events scheduled` : ''}
              </DrawerDescription>
            </DrawerHeader>
            <div className="grid gap-3 px-4 pb-4 sm:px-6 overflow-y-auto">
              {activeDay?.events.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => {
                    onEventClick(event);
                    setActiveDay(null);
                  }}
                  className="rounded-lg border bg-card p-4 text-left transition-colors duration-200 hover:border-highlight/70 hover:bg-muted/40"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium text-foreground">
                        {event.name}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className={
                            frequencyBadgeStyles[event.eventFrequencyType] ||
                            frequencyBadgeStyles.weekly
                          }
                        >
                          {frequencyLabels[event.eventFrequencyType] || 'Event'}
                        </Badge>
                        <Badge variant="outline">
                          {formatTypeLabel(event.eventType)}
                        </Badge>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        frequencyBadgeStyles[event.eventFrequencyType] ||
                        frequencyBadgeStyles.weekly
                      }
                    >
                      {moment(event.date).format('MMM D')}
                    </Badge>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <DrawerMeta icon={CalendarDaysIcon}>
                      {moment(event.date).format('dddd, MMMM D')}
                    </DrawerMeta>
                    <DrawerMeta icon={ClockIcon}>
                      {moment(event.date).format('h:mm A')}
                    </DrawerMeta>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </Card>
  );
};

const DrawerMeta = ({ icon: Icon, children }) => {
  return (
    <div className="flex items-center gap-2 h-fit">
      <Icon className="size-4 shrink-0 text-highlight" />
      <span>{children}</span>
    </div>
  );
};

const CalendarSkeleton = () => {
  return (
    <>
      <div className="space-y-3 md:hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="grid gap-2">
              {Array.from({ length: 2 }).map((__, rowIndex) => (
                <Skeleton key={rowIndex} className="h-14 w-full rounded-md" />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:grid md:grid-cols-7 md:gap-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={`head-${index}`} className="h-8 w-full rounded-md" />
        ))}
        {Array.from({ length: 36 }).map((_, index) => (
          <Skeleton key={index} className="min-h-36 rounded-lg border" />
        ))}
      </div>
    </>
  );
};

export default EventsCalendar;
