import { makeRequestCall } from '../api/api';
import { useState, useEffect, useMemo, useRef } from 'react';
import noposter from '../assets/noposter.avif';
import moment from 'moment';
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  TicketIcon,
} from 'lucide-react';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Skeleton } from './ui/skeleton';

const EventsLandingPageSection = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    makeRequestCall('tournament_script', 'getActiveTournaments')
      .then((tournamentData) => {
        const tournamentsArray = JSON.parse(tournamentData.result);
        setTournaments(tournamentsArray);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading tournaments:', error);
        setLoading(false);
      });
  }, []);

  const upcomingTournaments = useMemo(() => {
    return [...tournaments]
      .filter((tournament) => tournament.date)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [tournaments]);

  const scrollSlider = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const firstCard = slider.querySelector('[data-event-card]');
    const cardWidth = firstCard?.getBoundingClientRect().width || 320;
    const gap = 20;

    slider.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: 'smooth',
    });
  };

  return (
    <section className="border-t">
      <div className="container py-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-highlight">
              Community calendar
            </p>
            <h2 className="heading-2">Upcoming Events</h2>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              Tournaments, trade days, and community game nights happening next
              at Yuranka Games.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-3 pt-px [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card
                key={index}
                className="min-h-124 w-[82vw] shrink-0 snap-start p-0 sm:min-h-132 sm:w-88 lg:min-h-124 lg:w-[20rem]"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                  <Skeleton className="h-full w-full rounded-none" />
                  <Skeleton className="absolute left-3 top-3 h-14 w-14 rounded-lg bg-background/70" />
                  <Skeleton className="absolute right-3 top-3 h-6 w-32 rounded-lg bg-background/70" />
                </div>
                <CardHeader>
                  <div className="flex flex-col justify-center gap-1 mb-1">
                    <Skeleton className="h-6 w-11/12" />
                    <Skeleton className="h-6 w-2/3" />
                  </div>
                </CardHeader>
                <CardContent className="flex min-h-21 flex-col flex-1 gap-3">
                  {Array.from({ length: 3 }).map((_, rowIndex) => (
                    <div key={rowIndex} className="flex h-5 items-center gap-2">
                      <Skeleton className="size-5 shrink-0 rounded-full" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-11 w-full rounded-lg" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : upcomingTournaments.length === 0 ? (
          <Card className="items-center p-8 text-center">
            <CardTitle>No upcoming events yet</CardTitle>
            <CardContent className="max-w-xl p-0 text-muted-foreground">
              Check back soon or visit the events page for the full calendar.
            </CardContent>
            <Button asChild>
              <Link to="/events">
                Open events calendar
                <ArrowRightIcon />
              </Link>
            </Button>
          </Card>
        ) : (
          <div
            ref={sliderRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {upcomingTournaments.map((tournament) => (
              <Card
                key={tournament.id}
                data-event-card
                className="min-h-124 w-[82vw] shrink-0 snap-start p-0 transition-colors overflow-hidden sm:min-h-132 sm:w-88 lg:min-h-124 lg:w-[20rem]"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-muted">
                  <img
                    src={tournament.posterUrl || noposter}
                    alt={tournament.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                  />
                  <div className="absolute left-3 top-3 rounded-lg bg-background/90 px-3 py-2 text-center shadow-sm border backdrop-blur">
                    <div className="text-xs font-medium uppercase text-muted-foreground">
                      {moment(tournament.date).format('MMM')}
                    </div>
                    <div className="text-xl font-bold leading-none text-foreground">
                      {moment(tournament.date).format('D')}
                    </div>
                  </div>
                  <span className="absolute right-3 top-3 rounded-lg bg-highlight px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                    Registration open
                  </span>
                </div>

                <CardHeader>
                  <CardTitle className="line-clamp-2 min-h-11 text-lg">
                    {tournament.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex min-h-24 flex-col flex-1 gap-3 text-sm text-muted-foreground">
                  <div className="flex h-5 items-center gap-2">
                    <CalendarDaysIcon className="size-5 shrink-0 text-highlight" />
                    <span>
                      {moment(tournament.date).format('dddd, MMMM Do')}
                    </span>
                  </div>
                  <div className="flex h-5 items-center gap-2">
                    <ClockIcon className="size-5 shrink-0 text-highlight" />
                    <span>{formatTime(tournament.date)}</span>
                  </div>
                  <div className="flex h-5 items-center gap-2">
                    <TicketIcon className="size-5 shrink-0 text-highlight" />
                    <span>{formatPrice(tournament.price)}</span>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button className="w-full" size="lg" asChild>
                    <Link to="/events" state={{ tournament }}>
                      View details
                      <ArrowRightIcon />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        <div className="mt-5 flex justify-center gap-2">
          <Button
            variant="outline"
            size="icon-lg"
            aria-label="Previous events"
            className="hidden sm:inline-flex"
            onClick={() => scrollSlider(-1)}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-lg"
            aria-label="Next events"
            className="hidden sm:inline-flex"
            onClick={() => scrollSlider(1)}
          >
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto ml-auto"
            asChild
          >
            <Link to="/events">
              View all events
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsLandingPageSection;

const formatTime = (isoDate) => {
  if (!isoDate) return 'Time to be announced';

  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return 'Time to be announced';

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const formatPrice = (price) => {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice) || numericPrice === 0) {
    return 'Free entry';
  }

  return `${numericPrice} EUR entry`;
};
