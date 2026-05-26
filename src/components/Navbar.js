import { FaBars } from 'react-icons/fa';
import logo from '../assets/logo.avif';
import { Link, useNavigate } from 'react-router-dom';
import avatarImg from '../assets/logo.avif';
import { Button } from './ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';

const mainLinks = [
  { title: 'Store', to: 'https://store.yuranka.com', external: true },
  { title: 'Reservations', to: '/reservations' },
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
  const username = sessionStorage.getItem('username');

  const navLink = ({ title, to, external }) => {
    return (
      <Button
        variant="link"
        className="text-base text-primary link hover:no-underline"
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

  const navigationMenu = () => {
    return (
      <ul className="bg-muted rounded-full lg:flex items-center px-5 my-3.5 hidden">
        {mainLinks.slice(0, 1).map((link) => (
          <li key={link.title}>{navLink(link)}</li>
        ))}
        <li>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base h-8 px-2.5 text-primary font-medium">
                  Events
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background">
                  {eventLinks.map((link) => (
                    <NavigationMenuLink key={link.title} className="p-0">
                      <Link
                        className="min-w-30 text-base px-3 py-1.5 hover:text-primary transition-colors"
                        to={link.to}
                      >
                        {link.title}
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </li>
        {mainLinks.slice(1).map((link) => (
          <li key={link.title}>{navLink(link)}</li>
        ))}
        <li>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base h-8 px-2.5 text-primary font-medium">
                  More
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background">
                  {moreLinks.map((link) => (
                    <NavigationMenuLink key={link.title} className="p-0">
                      <Link
                        className="min-w-30 text-base px-3 py-1.5 hover:text-primary transition-colors"
                        to={link.to}
                      >
                        {link.title}
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </li>
      </ul>
    );
  };

  const mobileLink = ({ title, to, external }) => {
    return (
      <Button
        variant="ghost"
        size="lg"
        className="justify-start text-xl hover:text-highlight active:text-highlight"
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
          <Button variant="icon" className="lg:hidden mr-auto">
            <FaBars className="text-primary size-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="flex flex-col gap-3 p-4 data-[vaul-drawer-direction=left]:sm:max-w-60">
          {mainLinks.slice(0, 1).map((link) => (
            <div key={link.title}>{mobileLink(link)}</div>
          ))}
          {eventLinks.map((link) => (
            <div key={link.title}>{mobileLink(link)}</div>
          ))}
          {mainLinks.slice(1).map((link) => (
            <div key={link.title}>{mobileLink(link)}</div>
          ))}
          {moreLinks.map((link) => (
            <div key={link.title}>{mobileLink(link)}</div>
          ))}

          {username ? (
            <button
              type="button"
              className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-muted"
              onClick={() => navigate('/dashboard')}
            >
              <img
                src={avatarImg}
                alt="User Avatar"
                className="size-8 rounded-full object-cover"
              />
              <span className="text-base font-medium">{username}</span>
            </button>
          ) : (
            <div className="flex gap-3 flex-col pt-2">
              <Button
                variant="secondary"
                className="text-base w-full"
                onClick={() =>
                  navigate('/login&signup', {
                    state: { isLogin: true },
                    replace: true,
                  })
                }
              >
                Login
              </Button>
              <Button
                variant="default"
                className="text-base w-full"
                onClick={() =>
                  navigate('/login&signup', {
                    state: { isLogin: false },
                    replace: true,
                  })
                }
              >
                Sign Up
              </Button>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    );
  };

  return (
    <nav className="sticky top-0 bg-background z-50 border-b">
      <div className="container lg:flex items-center justify-between grid grid-cols-[minmax(0,1fr)_1fr_minmax(0,1fr)] h-15">
        {mobileDrawer()}

        <Link to="/" className="mx-auto lg:mx-0">
          <img
            src={logo}
            alt="YurankaGames Logo"
            className="-my-5.5 w-18 lg:w-22.5"
          />
        </Link>

        {navigationMenu()}

        <div className="hidden md:block ml-auto lg:ml-0">
          {username ? (
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-muted"
              onClick={() => navigate('/dashboard')}
            >
              <img
                src={avatarImg}
                alt="User Avatar"
                className="size-7 rounded-full object-cover"
              />
              <span className="text-sm font-medium">{username}</span>
            </button>
          ) : (
            <div className="flex gap-3 flex-col md:flex-row">
              <Button
                variant="ghost"
                className="max-md:text-base w-full md:w-auto"
                onClick={() =>
                  navigate('/login&signup', {
                    state: { isLogin: true },
                    replace: true,
                  })
                }
              >
                Login
              </Button>
              <Button
                variant="default"
                className="max-md:text-base w-full md:w-auto"
                onClick={() =>
                  navigate('/login&signup', {
                    state: { isLogin: false },
                    replace: true,
                  })
                }
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
