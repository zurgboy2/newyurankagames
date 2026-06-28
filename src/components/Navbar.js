import { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import logo from '../assets/logo.avif';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDownIcon, UserIcon } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';

const mainLinks = [
  { title: 'Store', to: 'https://store.yuranka.com', external: true },
  { title: 'Reservations', to: '/reservations' },
  { title: 'Sell Cards', to: '/buyout' },
];

const gameLinks = [
  { title: 'Board Games', to: '/boardgames' },
  { title: 'Video Games', to: '/videogames' },
];

const eventLinks = [
  { title: 'Main Events', to: '/events' },
  { title: 'Minicons', to: '/minicons' },
  { title: 'Star Wars', to: '/starwars' },
];

const moreLinks = [
  { title: 'About Us', to: '/about' },
  { title: 'Careers', to: '/careers' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const username = sessionStorage.getItem('username');
  const isActiveLink = ({ to, external }) =>
    !external && location.pathname === to;

  const navLink = (link) => {
    const { title, to, external } = link;
    const isActive = isActiveLink(link);

    return (
      <Button
        variant="link"
        className={cn(
          'text-base link hover:no-underline',
          isActive && 'text-primary',
        )}
        asChild
      >
        <Link
          to={to}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
        >
          {title}
        </Link>
      </Button>
    );
  };

  const dropdownLink = (link) => (
    <Link
      key={link.title}
      className={cn(
        'min-w-34 rounded-md px-3 py-1.5 text-base transition-colors hover:bg-muted hover:text-highlight',
        isActiveLink(link) && 'bg-muted text-highlight',
      )}
      to={link.to}
      onClick={() => setOpenDropdown(null)}
    >
      {link.title}
    </Link>
  );

  const dropdownMenu = ({ title, links, value }) => {
    const isOpen = openDropdown === value;
    const isActive = links.some(isActiveLink);

    return (
      <Popover
        open={isOpen}
        onOpenChange={(open) => setOpenDropdown(open ? value : null)}
      >
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            type="button"
            className={cn(
              'h-8 px-2.5 text-base font-medium text-highlight hover:bg-transparent hover:text-primary aria-expanded:bg-transparent aria-expanded:text-primary',
              (isActive || isOpen) && 'text-primary',
            )}
          >
            {title}
            <ChevronDownIcon
              className={cn(
                'size-4 transition-transform',
                isOpen && 'rotate-180',
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-auto gap-0.5 bg-background p-1"
        >
          {links.map(dropdownLink)}
        </PopoverContent>
      </Popover>
    );
  };

  const navigationMenu = () => {
    return (
      <ul className="bg-muted/75 rounded-full lg:flex items-center px-5 my-3.5 hidden">
        {mainLinks.slice(0, 1).map((link) => (
          <li key={link.title}>{navLink(link)}</li>
        ))}
        <li>
          {dropdownMenu({
            title: 'Events',
            links: eventLinks,
            value: 'events',
          })}
        </li>
        {mainLinks.slice(1, 2).map((link) => (
          <li key={link.title}>{navLink(link)}</li>
        ))}
        <li>
          {dropdownMenu({ title: 'Games', links: gameLinks, value: 'games' })}
        </li>
        {mainLinks.slice(2).map((link) => (
          <li key={link.title}>{navLink(link)}</li>
        ))}
        <li>
          {dropdownMenu({ title: 'More', links: moreLinks, value: 'more' })}
        </li>
      </ul>
    );
  };

  const mobileLink = (link) => {
    const { title, to, external } = link;
    const isActive = isActiveLink(link);

    return (
      <Button
        variant="ghost"
        size="lg"
        className={cn(
          'w-full justify-start text-xl hover:text-highlight active:text-highlight',
          isActive && 'bg-muted text-highlight',
        )}
        asChild
      >
        <Link
          to={to}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
        >
          {title}
        </Link>
      </Button>
    );
  };

  const mobileDrawer = () => {
    return (
      <Drawer direction="left">
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden mr-auto">
            <FaBars className="text-primary size-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="overflow-y-auto p-4 data-[vaul-drawer-direction=left]:sm:max-w-60">
          <div className="flex flex-1 flex-col gap-1">
            <div>{mobileLink({ title: 'Home', to: '/' })}</div>
            {mainLinks.slice(0, 1).map((link) => (
              <div key={link.title}>{mobileLink(link)}</div>
            ))}
            {eventLinks.map((link) => (
              <div key={link.title}>{mobileLink(link)}</div>
            ))}
            {mainLinks.slice(1, 2).map((link) => (
              <div key={link.title}>{mobileLink(link)}</div>
            ))}
            {gameLinks.map((link) => (
              <div key={link.title}>{mobileLink(link)}</div>
            ))}
            {mainLinks.slice(2).map((link) => (
              <div key={link.title}>{mobileLink(link)}</div>
            ))}
            {moreLinks.map((link) => (
              <div key={link.title}>{mobileLink(link)}</div>
            ))}

            <div className="border-t pt-4 mt-auto">
              {username ? (
                <Button
                  variant="ghost"
                  type="button"
                  className="h-11 w-full justify-start gap-3 px-3 text-left hover:bg-muted"
                  onClick={() => navigate('/dashboard')}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border bg-muted text-highlight">
                    <UserIcon className="size-4" />
                  </span>
                  <span className="truncate text-base font-medium">
                    {username}
                  </span>
                </Button>
              ) : (
                <div className="grid gap-3">
                  <Button
                    variant="secondary"
                    className="text-base w-full"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                  <Button
                    variant="default"
                    className="text-base w-full"
                    onClick={() => navigate('/signup')}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  };

  return (
    <nav className="sticky top-0 bg-background z-50 border-b">
      <div className="container lg:flex items-center justify-between grid grid-cols-[minmax(0,1fr)_1fr_minmax(0,1fr)] h-15">
        {mobileDrawer()}

        <Link
          to="/"
          className="mx-auto lg:mx-0 overflow-hidden h-full flex items-center"
        >
          <img src={logo} alt="YurankaGames Logo" className="w-18 md:w-22" />
        </Link>

        {navigationMenu()}

        <div className="hidden md:block ml-auto lg:ml-0">
          {username ? (
            <Button
              variant="ghost"
              type="button"
              className="flex h-9 items-center gap-2 rounded-full border border-border bg-muted/40 pl-2.5 pr-3.5 hover:bg-muted"
              onClick={() => navigate('/dashboard')}
            >
              <UserIcon className="size-4 text-highlight" />
              <span className="text-sm font-medium">{username}</span>
            </Button>
          ) : (
            <div className="flex gap-3 flex-col md:flex-row">
              <Button
                variant="ghost"
                className="max-md:text-base w-full md:w-auto"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                variant="default"
                className="max-md:text-base w-full md:w-auto"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
