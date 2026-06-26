import smallLogo1 from '../assets/small-logo1.avif';
import smallLogo2 from '../assets/small-logo2.avif';
import smallLogo3 from '../assets/small-logo3.avif';
import smallLogo4 from '../assets/small-logo4.avif';
import smallLogo5 from '../assets/small-logo5.avif';
import smallLogo6 from '../assets/small-logo6.avif';
import smallLogo7 from '../assets/small-logo7.avif';
import smallLogo8 from '../assets/small-logo8.avif';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Calendar1Icon, StoreIcon, TrophyIcon } from 'lucide-react';

const services = [
  {
    title: 'ONE STOP SHOP FOR CARDS AND COLLECTIBLES',
    description:
      'From booster packs to rare finds, explore a massive selection of trading cards and accessories for every player and collector.',
    cta: 'Visit Our Webshop',
    to: 'https://store.yuranka.com',
    external: true,
    Icon: StoreIcon,
  },
  {
    title: 'FROM CASUAL GAMES TO CHAMPIONSHIP MOMENTS',
    description:
      'From beginner-friendly events to high-stakes competitions, enter our tournaments and go head-to-head with the best.',
    cta: 'View Events',
    to: '/events',
    Icon: TrophyIcon,
  },
  {
    title: 'GAME NIGHTS MADE EASY. JUST BOOK AND PLAY.',
    description:
      'Whether it is casual play or intense matchups, reserve a table and make every game night memorable.',
    cta: 'Reserve A Table',
    to: '/reservations',
    Icon: Calendar1Icon,
  },
];

const OurServices = () => {
  return (
    <section className="overflow-hidden border-t">
      <div className="container py-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-highlight">
            Cards, events, tables
          </p>
          <h2 className="heading-2">Shop, play, and compete</h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Browse the shop, join the community calendar, or reserve a table
            whenever you want to play.
          </p>
        </div>

        <div className="relative overflow-visible">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-8">
            {services.map(({ title, description, cta, to, external, Icon }) => (
              <Card
                key={title}
                className="group p-0 sm:min-h-64 sm:flex-row lg:min-h-full lg:flex-col"
              >
                <CardContent className="flex items-center justify-center p-6 sm:w-48 sm:shrink-0 lg:w-full lg:pt-8 lg:pb-2">
                  <div className="flex size-24 items-center justify-center rounded-full bg-white/5 transition-colors group-hover:bg-highlight/10 sm:size-28 lg:size-28">
                    <Icon className="size-11 text-highlight sm:size-12" />
                  </div>
                </CardContent>
                <CardContent className="flex flex-1 flex-col p-5 pt-0 text-center sm:p-6 sm:pl-0 sm:text-left lg:p-5 lg:pt-2 lg:text-center">
                  <h3 className="heading-4 mb-3 leading-tight">
                    {title}
                  </h3>
                  <p className="mb-6 text-base font-light leading-relaxed text-muted-foreground sm:text-lg">
                    {description}
                  </p>
                  <Button size="lg" className="mt-auto w-full" asChild>
                    <Link
                      to={to}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                    >
                      {cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Images */}
          <div className="absolute -z-10 h-full top-0 -left-8 -right-8 pointer-events-none opacity-50">
            <img
              src={smallLogo1}
              alt="Logo 1"
              className="absolute -translate-1/2 w-18.75 top-[32%] left-[40%] lg:left-[33%]"
            />
            <img
              src={smallLogo2}
              alt="Logo 2"
              className="absolute -translate-1/2 w-12.5 left-5 top-[10%]"
            />
            <img
              src={smallLogo3}
              alt="Logo 3"
              className="absolute -translate-1/2 w-7.5 right-0 -top-5"
            />
            <img
              src={smallLogo4}
              alt="Logo 4"
              className="absolute -translate-1/2 w-18.75 top-[35%] right-[10%] lg:right-[26%]"
            />
            <img
              src={smallLogo5}
              alt="Logo 5"
              className="absolute -translate-1/2 w-17.5 top-[67%] left-[20%] lg:left-[35%]"
            />
            <img
              src={smallLogo6}
              alt="Logo 6"
              className="absolute w-11.25 top-[66%] right-0"
            />
            <img
              src={smallLogo7}
              alt="Logo 7"
              className="absolute -translate-1/2 w-8 top-[102%] left-[5%]"
            />
            <img
              src={smallLogo8}
              alt="Logo 8"
              className="absolute -translate-1/2 w-12.5 top-full right-[10%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurServices;
