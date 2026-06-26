import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ClockIcon,
  Dice5Icon,
  LanguagesIcon,
  LayersIcon,
  SearchIcon,
  ShoppingBagIcon,
  Table2Icon,
  UsersIcon,
} from 'lucide-react';
import { makeRegistrationRequestCall } from '../api/api';
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

const BoardGamesSection = () => {
  const [forSaleGames, setForSaleGames] = useState([]);
  const [forRentGames, setForRentGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleForSale, setVisibleForSale] = useState(getInitialVisibleCount);
  const [visibleForRent, setVisibleForRent] = useState(getInitialVisibleCount);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoardGames();
  }, []);

  const fetchBoardGames = async () => {
    try {
      const response = await makeRegistrationRequestCall(
        'games_script',
        'getBoardGames',
      );
      const allGames = response.games || [];

      setForSaleGames(allGames.filter((game) => game.sellable === true));
      setForRentGames(allGames.filter((game) => !game.sellable));
    } catch (error) {
      console.error('Error fetching board games:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredForSale = useMemo(
    () => filterBySearch(forSaleGames, searchQuery),
    [forSaleGames, searchQuery],
  );

  const filteredForRent = useMemo(
    () => filterBySearch(forRentGames, searchQuery),
    [forRentGames, searchQuery],
  );

  const viewAll = () => {
    setVisibleForSale(filteredForSale.length);
    setVisibleForRent(filteredForRent.length);
  };

  return (
    <section className="border-t bg-muted/20">
      <div className="container py-10 sm:py-14">
        <GameCatalogHero
          eyebrow="Tabletop library"
          title="Board Games"
          description="Browse board games for purchase or rent, then reserve a table when you are ready to play in-store."
          primaryAction="Reserve a table"
          secondaryAction="View video games"
          secondaryTo="/videogames"
          onPrimaryAction={() => navigate('/reservations')}
        />

        <Card className="mt-8 p-0">
          <CardContent className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <SearchField
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setVisibleForSale(getInitialVisibleCount());
                setVisibleForRent(getInitialVisibleCount());
              }}
              placeholder="Search board games..."
            />
            <Button type="button" variant="outline" onClick={viewAll}>
              View all board games
            </Button>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-6">
          <BoardGameGroup
            title="For Sale"
            description="Games you can buy through the webshop when available."
            games={filteredForSale}
            visibleCount={visibleForSale}
            loading={loading}
            emptyText="No board games for sale match this search."
            onShowMore={() =>
              setVisibleForSale((count) =>
                Math.min(
                  count + getInitialVisibleCount(),
                  filteredForSale.length,
                ),
              )
            }
            actionLabel="Buy now"
            showPrice
          />

          <BoardGameGroup
            title="For Rent"
            description="Games available for in-store play with a table reservation."
            games={filteredForRent}
            visibleCount={visibleForRent}
            loading={loading}
            emptyText="No rentable board games match this search."
            onShowMore={() =>
              setVisibleForRent((count) =>
                Math.min(
                  count + getInitialVisibleCount(),
                  filteredForRent.length,
                ),
              )
            }
          />
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
          <Table2Icon />
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
      <label className="text-sm font-medium" htmlFor="game-search">
        Search
      </label>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-highlight" />
        <Input
          id="game-search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-10 pl-8"
        />
      </div>
    </div>
  );
};

const BoardGameGroup = ({
  title,
  description,
  games,
  visibleCount,
  loading,
  emptyText,
  onShowMore,
  actionLabel,
  showPrice = false,
}) => {
  const visibleGames = games.slice(0, visibleCount);

  return (
    <Card className="p-0">
      <CardHeader className="border-b p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="heading-3">{title}</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>
          {!loading && <Badge variant="secondary">{games.length} games</Badge>}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <GameGridSkeleton />
        ) : visibleGames.length === 0 ? (
          <EmptyCatalogState text={emptyText} />
        ) : (
          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {visibleGames.map((game, index) => (
              <BoardGameCard
                key={`${game.name}-${index}`}
                game={game}
                actionLabel={actionLabel}
                showPrice={showPrice}
              />
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

const BoardGameCard = ({ game, actionLabel, showPrice }) => {
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
      <CardContent className="grid flex-1 gap-2 p-3 pt-0">
        {game.description && (
          <p className="text-sm text-muted-foreground">{game.description}</p>
        )}
        <div className="grid gap-1.5 text-sm h-fit mt-auto text-muted-foreground">
          {showPrice && game.price && (
            <GameMeta icon={ShoppingBagIcon}>€ {game.price}</GameMeta>
          )}
          <GameMeta icon={UsersIcon}>{game.playerCount || '-'}</GameMeta>
          {isExpansion(game.expansion) && (
            <GameMeta icon={LayersIcon}>Expansion</GameMeta>
          )}
          <GameMeta icon={ClockIcon}>{game.time || '-'}</GameMeta>
          <GameMeta icon={LanguagesIcon}>{game.language || '-'}</GameMeta>
        </div>
      </CardContent>
      {actionLabel && game.shopifyURL && (
        <CardFooter className="mt-auto border-t p-3">
          <Button asChild size="sm" className="w-full">
            <a href={game.shopifyURL} target="_blank" rel="noopener noreferrer">
              {actionLabel}
            </a>
          </Button>
        </CardFooter>
      )}
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

const isExpansion = (value) => {
  return String(value).trim().toLowerCase() === 'yes';
};

export default BoardGamesSection;
