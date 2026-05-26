import { makeRegistrationRequestCall, makeRequestCall } from '../api/api';
import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import noposter from '../assets/noposter.avif';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarDaysIcon,
  ClockIcon,
  EuroIcon,
  GiftIcon,
  InfoIcon,
  TicketIcon,
  TrophyIcon,
  XIcon,
} from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';
import EventsCalendar from './EventsCalendar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Skeleton } from './ui/skeleton';

const baseFilters = [
  { label: 'All', key: 'all' },
  { label: 'Yu-Gi-Oh', key: 'yu-gi-oh' },
  { label: 'Flesh and Blood', key: 'flesh-and-blood' },
  { label: 'Magic the Gathering', key: 'magic-the-gathering' },
  { label: 'One Piece', key: 'one-piece' },
  { label: 'Star Wars', key: 'star-wars' },
  { label: 'Pokemon', key: 'pokemon' },
  { label: 'Digimon', key: 'digimon' },
  { label: 'Video Game', key: 'video-game' },
  { label: 'Board Game', key: 'board-game' },
];

const frequencyLabels = {
  oneTime: 'One-time',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

const frequencyBadgeStyles = {
  weekly: 'border-white/70 bg-white text-black hover:bg-white',
  oneTime: 'border-highlight bg-highlight text-white hover:bg-highlight',
  monthly:
    'border-muted-foreground/30 bg-muted-foreground/15 text-foreground hover:bg-muted-foreground/15',
};

const formatTypeLabel = (value) => {
  if (!value) return 'Event';
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const getPriceLabel = (price) => {
  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice === 0) return 'Free entry';
  return `${numericPrice} EUR`;
};

const getEventDate = (date) => {
  if (!date) return 'Date to be announced';
  return moment(date).format('dddd, MMMM Do');
};

const EventsSection = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    oneTime: 'all',
    monthly: 'all',
    weekly: 'all',
  });
  const [expandedSections, setExpandedSections] = useState({
    monthly: false,
    weekly: false,
  });

  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    if (location.state?.tournament) {
      setSelectedTournament(location.state.tournament);
      setRegistrationOpen(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location.pathname, location.state, navigate]);

  const filters = useMemo(() => {
    const knownKeys = new Set(baseFilters.map((filter) => filter.key));
    const dynamicFilters = tournaments
      .map((event) => event.eventType)
      .filter(Boolean)
      .filter((eventType, index, values) => values.indexOf(eventType) === index)
      .filter((eventType) => !knownKeys.has(eventType))
      .map((eventType) => ({
        key: eventType,
        label: formatTypeLabel(eventType),
      }));

    return [...baseFilters, ...dynamicFilters];
  }, [tournaments]);

  const groupedEvents = useMemo(() => {
    const sortByDate = (events) =>
      [...events].sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

    return {
      oneTime: sortByDate(
        tournaments.filter((event) => event.eventFrequencyType === 'oneTime'),
      ),
      monthly: sortByDate(
        tournaments.filter((event) => event.eventFrequencyType === 'monthly'),
      ),
      weekly: sortByDate(
        tournaments.filter((event) => event.eventFrequencyType === 'weekly'),
      ),
    };
  }, [tournaments]);

  const openRegistration = (event) => {
    setSelectedTournament(event);
    setRegistrationOpen(true);
  };

  const filterEvents = (events, sectionKey) => {
    const filter = selectedFilters[sectionKey];
    if (filter === 'all') return events;
    return events.filter((event) => event.eventType === filter);
  };

  return (
    <section>
      <div className="container py-10">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-highlight">
            Community calendar
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">
            Tournaments & Events
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Browse upcoming one-time events, recurring weekly tournaments, and
            monthly community meetups.
          </p>
        </div>

        <div className="grid gap-8">
          <EventsCalendar
            tournaments={tournaments}
            onEventClick={openRegistration}
            loading={loading}
          />

          <EventSection
            title="One-Time Events"
            description="Special events, trade days, releases, and community meetups."
            events={groupedEvents.oneTime}
            filters={filters}
            selectedFilter={selectedFilters.oneTime}
            onFilterChange={(key) =>
              setSelectedFilters((state) => ({ ...state, oneTime: key }))
            }
            filterEvents={(events) => filterEvents(events, 'oneTime')}
            loading={loading}
            onRegister={openRegistration}
          />

          <EventSection
            title="Monthly Events"
            description="Recurring monthly activities and scheduled meetups."
            events={groupedEvents.monthly}
            filters={filters}
            selectedFilter={selectedFilters.monthly}
            onFilterChange={(key) =>
              setSelectedFilters((state) => ({ ...state, monthly: key }))
            }
            filterEvents={(events) => filterEvents(events, 'monthly')}
            loading={loading}
            onRegister={openRegistration}
            expanded={expandedSections.monthly}
            onToggleExpanded={() =>
              setExpandedSections((state) => ({
                ...state,
                monthly: !state.monthly,
              }))
            }
          />

          <EventSection
            title="Weekly Events"
            description="Weekly tournaments, leagues, and regular game nights."
            events={groupedEvents.weekly}
            filters={filters}
            selectedFilter={selectedFilters.weekly}
            onFilterChange={(key) =>
              setSelectedFilters((state) => ({ ...state, weekly: key }))
            }
            filterEvents={(events) => filterEvents(events, 'weekly')}
            loading={loading}
            onRegister={openRegistration}
            expanded={expandedSections.weekly}
            onToggleExpanded={() =>
              setExpandedSections((state) => ({
                ...state,
                weekly: !state.weekly,
              }))
            }
          />
        </div>
      </div>

      <RegistrationModal
        tournament={selectedTournament}
        open={registrationOpen}
        onClose={() => setRegistrationOpen(false)}
      />
    </section>
  );
};

const EventSection = ({
  title,
  description,
  events,
  filters,
  selectedFilter,
  onFilterChange,
  filterEvents,
  loading,
  onRegister,
  expanded = true,
  onToggleExpanded,
}) => {
  const filteredEvents = filterEvents(events);
  const visibleEvents = expanded ? filteredEvents : filteredEvents.slice(0, 8);
  const counts = filters.reduce((acc, filter) => {
    acc[filter.key] =
      filter.key === 'all'
        ? events.length
        : events.filter((event) => event.eventType === filter.key).length;
    return acc;
  }, {});

  return (
    <Card className="p-0 bg-muted/20">
      <CardHeader className="border-b p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>
          <Badge variant="outline" className="text-base h-fit px-3">
            {events.length} events
          </Badge>
        </div>

        {events.length > 0 && (
          <div className="flex gap-2 overflow-x-auto mt-3 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filters
              .filter((filter) => counts[filter.key] > 0)
              .map((filter) => (
                <Button
                  type="button"
                  key={filter.key}
                  size="sm"
                  variant={
                    selectedFilter === filter.key ? 'default' : 'outline'
                  }
                  className="shrink-0 gap-2 py-2"
                  onClick={() => onFilterChange(filter.key)}
                >
                  <span>{filter.label}</span>
                  <span className="inline-flex h-4 min-w-4 px-0.75 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-black">
                    {counts[filter.key]}
                  </span>
                </Button>
              ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-5">
        {loading ? (
          <EventSkeletonGrid />
        ) : filteredEvents.length === 0 ? (
          <EmptyEventsState />
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {visibleEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onRegister={onRegister}
                />
              ))}
            </div>

            {filteredEvents.length > 8 && onToggleExpanded && (
              <div className="mt-6 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onToggleExpanded}
                >
                  {expanded ? 'View less' : 'View more'}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

const EventCard = ({ event, onRegister }) => {
  return (
    <Card className="p-0 group">
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <img
          src={event.posterUrl || noposter}
          alt={event.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-lg bg-background/90 px-3 py-2 text-center shadow-sm ring-1 ring-border backdrop-blur">
          <div className="text-xs font-medium uppercase text-muted-foreground">
            {event.date ? moment(event.date).format('MMM') : 'TBA'}
          </div>
          <div className="text-xl font-bold leading-none text-foreground">
            {event.date ? moment(event.date).format('D') : '--'}
          </div>
        </div>
        <Badge
          className={`absolute right-3 top-3 ${
            frequencyBadgeStyles[event.eventFrequencyType] ||
            frequencyBadgeStyles.weekly
          }`}
        >
          {frequencyLabels[event.eventFrequencyType] || 'Event'}
        </Badge>
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-2 min-h-14 text-lg">
          {event.name}
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{formatTypeLabel(event.eventType)}</Badge>
        </div>
      </CardHeader>

      <CardContent className="grid min-h-21 gap-3 text-sm text-muted-foreground flex-1">
        <EventMeta icon={CalendarDaysIcon}>
          {getEventDate(event.date)}
        </EventMeta>
        <EventMeta icon={ClockIcon}>
          {formatTime(event.date) || 'Time to be announced'}
        </EventMeta>
        <EventMeta icon={TicketIcon}>{getPriceLabel(event.price)}</EventMeta>
      </CardContent>

      <CardFooter>
        <Button
          type="button"
          className="w-full"
          size="lg"
          onClick={() => onRegister(event)}
        >
          Register
        </Button>
      </CardFooter>
    </Card>
  );
};

const EventMeta = ({ icon: Icon, children }) => {
  return (
    <div className="flex items-center gap-2 h-fit">
      <Icon className="size-4 shrink-0 text-highlight" />
      <span>{children}</span>
    </div>
  );
};

const EventSkeletonGrid = () => {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="p-0">
          <Skeleton className="aspect-4/3 w-full rounded-none" />
          <CardHeader>
            <Skeleton className="h-5 w-11/12" />
            <Skeleton className="h-5 w-2/3" />
          </CardHeader>
          <CardContent className="grid gap-3">
            {Array.from({ length: 3 }).map((__, rowIndex) => (
              <div key={rowIndex} className="flex items-center gap-2">
                <Skeleton className="size-4 rounded-full" />
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
  );
};

const EmptyEventsState = () => {
  return (
    <div className="rounded-lg border border-dashed p-8 text-center">
      <p className="font-medium">
        Events for this filter have not been added yet.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Check back later or join our Discord to stay in touch.
      </p>
      <Button className="mt-4" variant="outline" asChild>
        <a
          href="https://discord.com/invite/dDccDK3SnN"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaDiscord className="size-4" />
          Join Discord
        </a>
      </Button>
    </div>
  );
};

const RegistrationModal = ({ tournament, open, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setName(sessionStorage.getItem('name') || '');
      setEmail(sessionStorage.getItem('email') || '');
      setResult(null);
      setErrorMessage('');
    }
  }, [open]);

  if (!open || !tournament) return null;

  const handleRegistration = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);

    try {
      const registrationResult = await makeRegistrationRequestCall(
        'tournament_script',
        'registerForEvent',
        {
          eventId: tournament.id,
          name,
          email,
          username: sessionStorage.getItem('username') || '',
          googleToken: sessionStorage.getItem('googleToken') || '',
        },
      );

      setResult(registrationResult);
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setResult(null);
      setErrorMessage(
        'An error occurred while processing your registration. Please try again later.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <Card className="max-h-[90vh] w-full max-w-4xl overflow-y-auto p-0">
        <CardHeader className="border-b p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-highlight">
                Event registration
              </p>
              <CardTitle className="text-2xl">{tournament.name}</CardTitle>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close"
            >
              <XIcon />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 p-5 md:grid-cols-[18rem_1fr]">
          <div className="space-y-4">
            <img
              src={tournament.posterUrl || noposter}
              alt={tournament.name}
              className="w-full max-w-72 mx-auto rounded-lg object-cover"
            />
          </div>

          <div className="space-y-5">
            <div className="grid gap-3 text-sm text-muted-foreground">
              <EventMeta icon={CalendarDaysIcon}>
                {getEventDate(tournament.date)}
              </EventMeta>
              <EventMeta icon={ClockIcon}>
                {formatTime(tournament.date) || 'Time to be announced'}
              </EventMeta>
              <EventMeta icon={EuroIcon}>
                {getPriceLabel(tournament.price)}
              </EventMeta>
            </div>
            <EventDetails tournament={tournament} />

            {result || errorMessage ? (
              <RegistrationResult result={result} errorMessage={errorMessage} />
            ) : (
              <form className="grid gap-4" onSubmit={handleRegistration}>
                <div className="grid gap-2">
                  <label
                    htmlFor="participant-name"
                    className="text-sm font-medium"
                  >
                    Name
                  </label>
                  <Input
                    id="participant-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="participant-email"
                    className="text-sm font-medium"
                  >
                    Email
                  </label>
                  <Input
                    id="participant-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                  Your personal information is collected only for tournament
                  organization and communication. Tickets are non-refundable.
                </div>

                <Button type="submit" size="lg" disabled={isLoading}>
                  {isLoading ? 'Checking availability...' : 'Register'}
                </Button>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const EventDetails = ({ tournament }) => {
  const details = [
    { label: 'Description', value: tournament.description, icon: InfoIcon },
    {
      label: 'Pre-release bundle',
      value: tournament.preReleaseBundleIncludes,
      icon: GiftIcon,
    },
    { label: 'Prizes', value: tournament.prizes, icon: TrophyIcon },
    { label: 'Rules', value: tournament.rules, icon: InfoIcon },
  ].filter((item) => item.value);

  if (details.length === 0) return null;

  return (
    <div className="grid gap-3">
      {details.map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-lg border p-3">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <Icon className="size-4 text-highlight" />
            {label}
          </div>
          <p className="whitespace-pre-line text-sm text-muted-foreground">
            {value}
          </p>
        </div>
      ))}
    </div>
  );
};

const RegistrationResult = ({ result, errorMessage }) => {
  if (errorMessage) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="grid gap-4 rounded-lg border bg-muted/30 p-4">
      <p className="text-sm text-muted-foreground">
        {result?.checkoutUrl
          ? 'Your registration is reserved. Please proceed to checkout to confirm your spot.'
          : result?.message ||
            'Your registration is confirmed and no payment is required. Enjoy the event!'}
      </p>
      {result?.checkoutUrl && (
        <Button asChild>
          <a
            href={result.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Proceed to checkout
          </a>
        </Button>
      )}
    </div>
  );
};

export default EventsSection;

const formatTime = (isoDate) => {
  if (!isoDate) return null;

  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return null;

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};
