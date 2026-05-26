import storeBg from '../assets/store-bg.avif';
import cardsImage from '../assets/div.avif';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const Hero = () => {
  return (
    <section
      className="bg-cover bg-center after:bg-linear-to-r after:from-black/60 after:to-transparent after:absolute after:inset-0 after:z-10 z-0 relative"
      style={{ backgroundImage: `url(${storeBg})` }}
    >
      <div className="container flex flex-col-reverse items-center justify-between gap-8 py-8 text-white md:flex-row lg:items-center lg:py-20 z-20 relative">
        <div className="w-full md:min-w-100 md:max-w-150 grow">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl text-center">
            Discover the Ultimate Hub for Trading Card Games, Board Games and
            Video Games in Riga, Latvia.
          </h1>
          <p className="mb-8 font-medium text-white/80 md:text-lg text-center">
            Explore our exclusive collection of trading cards, connect with
            passionate gamers, and compete in tournaments—all under one roof.
          </p>
          <div className="grid lg:grid-cols-3 gap-3 grid-cols-2">
            <div className="flex rounded-lg bg-black max-lg:col-span-2">
              <Button className="h-11 flex-1 -m-px" size="lg" asChild>
                <Link to="https://store.yuranka.com" target="_blank">
                  Visit Our Webshop
                </Link>
              </Button>
            </div>
            <div className="flex rounded-lg bg-black">
              <Button
                className="h-11 flex-1 -m-px"
                variant="white"
                size="lg"
                asChild
              >
                <Link to="/events">Join an Event</Link>
              </Button>
            </div>
            <div className="flex rounded-lg bg-black">
              <Button className="h-11 flex-1 -m-px" size="lg" asChild>
                <Link to="/reservations">Book A Table</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-center">
          <img
            src={cardsImage}
            alt="Gaming Store"
            className="h-auto w-full max-w-80 md:max-w-150"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
