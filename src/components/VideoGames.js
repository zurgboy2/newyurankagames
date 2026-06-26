import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarDaysIcon,
  Dice5Icon,
  Gamepad2Icon,
  SearchIcon,
  TvIcon,
  UsersIcon,
} from 'lucide-react';
import { makeVideoGamesRequestCall } from '../api/api';
import noposter from '../assets/noposter.avif';
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

const ALL_GAMES = 'All Games';

const getCatalogColumns = () => {
  if (typeof window === 'undefined') return 4;
  if (window.innerWidth >= 1536) return 6;
  if (window.innerWidth >= 1280) return 5;
  if (window.innerWidth >= 768) return 4;
  if (window.innerWidth >= 640) return 3;
  if (window.innerWidth >= 480) return 2;
  return 1;
};

const getInitialVisibleCount = () => getCatalogColumns() * 2;

const VideoGamesSection = () => {
  const [games, setGames] = useState([]);
  const [filters, setFilters] = useState([]);
  const [activeFilter, setActiveFilter] = useState(ALL_GAMES);
  const [visibleCount, setVisibleCount] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await makeVideoGamesRequestCall(
          'videogames_script',
          'search_games',
          {},
        );
        if (response.success && response.games) {
          const nextGames = response.games;
          const nextFilters = [ALL_GAMES, ...(response.filters || [])];
          setGames(nextGames);
          setFilters(nextFilters);
          setVisibleCount(
            nextFilters.reduce(
              (acc, key) => ({ ...acc, [key]: getInitialVisibleCount() }),
              {},
            ),
          );
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  const groupedGames = useMemo(() => {
    return games.reduce((acc, game) => {
      const consoleName = game.console || 'Other';
      if (!acc[consoleName]) acc[consoleName] = [];
      acc[consoleName].push(game);
      return acc;
    }, {});
  }, [games]);

  const visibleSections = useMemo(() => {
    if (activeFilter === ALL_GAMES) {
      return Object.entries(groupedGames).map(([consoleName, gameList]) => ({
        title: consoleName,
        games: filterBySearch(gameList, searchQuery),
      }));
    }

    return [
      {
        title: activeFilter,
        games: filterBySearch(
          games.filter((game) => game.console === activeFilter),
          searchQuery,
        ),
      },
    ];
  }, [activeFilter, games, groupedGames, searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setActiveFilter(ALL_GAMES);
    setVisibleCount((state) =>
      Object.keys(state).reduce(
        (acc, key) => ({ ...acc, [key]: getInitialVisibleCount() }),
        {},
      ),
    );
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setVisibleCount((state) => ({
      ...state,
      [filter]: getInitialVisibleCount(),
    }));
  };

  const showMore = (sectionTitle, total) => {
    setVisibleCount((state) => ({
      ...state,
      [sectionTitle]: Math.min(
        (state[sectionTitle] || getInitialVisibleCount()) +
          getInitialVisibleCount(),
        total,
      ),
    }));
  };

  return (
    <section className="border-t bg-muted/20">
      <div className="container py-10 sm:py-14">
        <GameCatalogHero
          eyebrow="Couch play library"
          title="Video Games"
          description="Browse games by console, find what you want to play, and reserve a couch space for your group."
          primaryAction="Reserve couch space"
          secondaryAction="View board games"
          secondaryTo="/boardgames"
          onPrimaryAction={() => navigate('/reservations')}
        />

        <Card className="mt-8 p-0">
          <CardContent className="grid gap-5 p-5">
            <SearchField
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search video games..."
            />

            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {loading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-8 w-24 rounded-lg" />
                  ))
                : filters.map((filter) => (
                    <Button
                      key={filter}
                      type="button"
                      size="sm"
                      variant={activeFilter === filter ? 'default' : 'outline'}
                      onClick={() => handleFilterClick(filter)}
                      className="shrink-0"
                    >
                      {filter}
                    </Button>
                  ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-6">
          {loading ? (
            <VideoGameGroup title="Loading games" loading />
          ) : visibleSections.length === 0 ? (
            <EmptyCatalogState text="No video games are available yet." />
          ) : (
            visibleSections.map((section) => (
              <VideoGameGroup
                key={section.title}
                title={section.title}
                games={section.games}
                visibleCount={
                  visibleCount[section.title] || getInitialVisibleCount()
                }
                onShowMore={() => showMore(section.title, section.games.length)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

const GameCatalogHero = ({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  secondaryTo,
  onPrimaryAction,
}) => {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-highlight">
        {eyebrow}
      </p>
      <h1 className="heading-1">{title}</h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        {description}
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Button type="button" size="lg" onClick={onPrimaryAction}>
          <Gamepad2Icon />
          {primaryAction}
        </Button>
        <Button type="button" size="lg" variant="outline" asChild>
          <Link to={secondaryTo}>
            <Dice5Icon />
            {secondaryAction}
          </Link>
        </Button>
      </div>
    </div>
  );
};

const SearchField = ({ value, onChange, placeholder }) => {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium" htmlFor="video-game-search">
        Search
      </label>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-highlight" />
        <Input
          id="video-game-search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-10 pl-8"
        />
      </div>
    </div>
  );
};

const VideoGameGroup = ({
  title,
  games = [],
  visibleCount = getInitialVisibleCount(),
  loading = false,
  onShowMore,
}) => {
  const visibleGames = games.slice(0, visibleCount);

  return (
    <Card className="p-0">
      <CardHeader className="border-b p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="heading-3">{title}</CardTitle>
          {!loading && <Badge variant="secondary">{games.length} games</Badge>}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <GameGridSkeleton />
        ) : visibleGames.length === 0 ? (
          <EmptyCatalogState text="No video games match this search." />
        ) : (
          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {visibleGames.map((game) => (
              <VideoGameCard key={game.id || game.name} game={game} />
            ))}
          </div>
        )}
      </CardContent>
      {!loading && visibleCount < games.length && (
        <CardFooter className="border-t p-4">
          <Button
            variant="outline"
            className="w-fit mx-auto"
            onClick={onShowMore}
          >
            View more
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

const VideoGameCard = ({ game }) => {
  const imageUrl = getGameImage(game);

  return (
    <Card className="overflow-hidden p-0">
      <div className="bg-black">
        <img
          src={imageUrl}
          alt={game.name}
          className="aspect-4/3 w-full object-contain"
        />
      </div>
      <CardHeader className="p-3 pb-1">
        <CardTitle className="heading-5">{game.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-1.5 p-3 pt-0 text-sm text-muted-foreground">
        <GameMeta icon={TvIcon}>
          {game.console || 'Console not listed'}
        </GameMeta>
        <GameMeta icon={UsersIcon}>
          {game.playerCount ? `${game.playerCount} players` : 'Players vary'}
        </GameMeta>
        <GameMeta icon={Gamepad2Icon}>{game.spMp || 'Mode varies'}</GameMeta>
        <GameMeta icon={CalendarDaysIcon}>
          {game.yearOfPublish || 'Year unknown'}
        </GameMeta>
      </CardContent>
    </Card>
  );
};

const GameMeta = ({ icon: Icon, children }) => {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4 shrink-0 text-highlight" />
      <span className="min-w-0 truncate">{children}</span>
    </div>
  );
};

const EmptyCatalogState = ({ text }) => (
  <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
    {text}
  </div>
);

const GameGridSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
    {Array.from({ length: 8 }).map((_, index) => (
      <Card key={index} className="overflow-hidden p-0">
        <Skeleton className="aspect-4/3 w-full" />
        <CardContent className="grid gap-2 p-3">
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const filterBySearch = (games, query) => {
  if (!query.trim()) return games;
  return games.filter((game) =>
    game.name?.toLowerCase().includes(query.toLowerCase()),
  );
};

const getGameImage = (game) => {
  return !game.imageUrl || game.imageUrl === 'No Image'
    ? noposter
    : game.imageUrl;
};

export default VideoGamesSection;
