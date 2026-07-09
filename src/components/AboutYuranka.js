import storeImage from '../assets/store.avif';
import visionImage from '../assets/vision.avif';
import missionIcon1 from '../assets/missionIcon1.avif';
import missionIcon2 from '../assets/missionIcon2.webp';
import missionIcon3 from '../assets/missionIcon3.avif';
import aboutUs1 from '../assets/aboutUs1.avif';
import aboutUs2 from '../assets/aboutUs2.avif';
import aboutUs3 from '../assets/aboutUs3.avif';
import aboutUs4 from '../assets/aboutUs4.avif';
import aboutUs5 from '../assets/aboutUs5.avif';
import aboutUs6 from '../assets/aboutUs6.avif';
import aboutUs7 from '../assets/aboutUs7.avif';
import aboutUs8 from '../assets/aboutUs8.avif';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const galleryImages = [
  aboutUs1,
  aboutUs2,
  aboutUs3,
  aboutUs4,
  aboutUs5,
  aboutUs6,
  aboutUs7,
  aboutUs8,
];

const missionItems = [
  {
    icon: missionIcon1,
    title: 'A broader game selection',
    body: 'Create a welcoming environment for TCG players, board game fans, and video game enthusiasts across every skill level.',
  },
  {
    icon: missionIcon2,
    title: 'A stronger gaming scene',
    body: 'Grow the reach of tabletop and trading card gaming across Latvia by bringing organized play and community spaces to more people.',
  },
  {
    icon: missionIcon3,
    title: 'A real third place',
    body: 'Build a space where people meet, play, learn, and return often because the community feels as important as the products.',
  },
];

const pastEventPages = [
  {
    title: 'Minicons',
    to: '/minicons',
    body: 'A Mini-Con hub with themed events, schedules, activities, prizes, and event details.',
  },
  {
    title: 'Star Wars',
    to: '/starwars',
    body: 'A Star Wars Universe page featuring the Jedi or Sith personality test.',
  },
];

const infoSections = [
  {
    eyebrow: 'Our Store',
    title: 'More than a shop counter',
    image: storeImage,
    alt: 'Inside Yuranka Games store',
    imageFirst: false,
    body: [
      'Yuranka Games grew from a passion project into a broader gaming destination. What began with trading card games expanded into board games, video games, tabletop play, tournaments, and casual meetups.',
      'The goal is not just to sell games. It is to keep a real place for discovery and community alive, where new players feel welcome, regulars have a home base, and events give people a reason to come back every week.',
    ],
  },
  {
    eyebrow: 'Our Vision',
    title: 'A stronger gaming culture across Latvia',
    image: visionImage,
    alt: 'Yuranka Games vision',
    imageFirst: true,
    body: [
      'We want Yuranka Games to be known as a dependable destination for card games, events, and tabletop community building.',
      'The long-term vision is simple: make gaming spaces easier to find, easier to join, and worth returning to.',
    ],
  },
];

const AboutYuranka = () => {
  return (
    <main className="border-t">
      <section className="overflow-hidden">
        <div className="container py-10 sm:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-highlight">
              About Yuranka Games
            </p>
            <h1 className="heading-1 mt-4">
              Built for play, community, and repeat visits.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Yuranka Games started from a love of trading card games and the
              idea that every city needs a place where people can gather, play,
              and stay connected around shared interests.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {galleryImages.map((image, index) => (
              <img
                key={image}
                src={image}
                alt={`Yuranka Games space ${index + 1}`}
                className="aspect-4/3 w-full rounded-lg object-cover"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="container py-10 sm:py-14">
          <div className="grid gap-6">
            {infoSections.map((section) => (
              <Card key={section.title} className="overflow-hidden p-0">
                <CardContent className="grid gap-0 p-0 md:grid-cols-2">
                  <div
                    className={`${section.imageFirst ? 'md:order-1' : 'md:order-2'}`}
                  >
                    <img
                      src={section.image}
                      alt={section.alt}
                      className="aspect-4/3 w-full object-cover md:h-full md:aspect-auto"
                    />
                  </div>
                  <div
                    className={`flex flex-col justify-center p-6 sm:p-8 ${
                      section.imageFirst ? 'md:order-2' : 'md:order-1'
                    }`}
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-highlight">
                      {section.eyebrow}
                    </p>
                    <CardTitle className="heading-2 mt-3">
                      {section.title}
                    </CardTitle>
                    <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
                      {section.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="container py-10 sm:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-highlight">
              Our Mission
            </p>
            <h2 className="heading-2 mt-4">
              Three things guide how the store grows
            </h2>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              Product depth, local community, and a space people actually want
              to spend time in.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {missionItems.map((item) => (
              <Card key={item.title} className="h-full p-0">
                <CardHeader className="items-center border-b p-6 text-center">
                  <div className="flex min-h-20 items-center justify-center">
                    <img
                      src={item.icon}
                      alt=""
                      className="max-h-12 w-auto object-contain"
                    />
                  </div>
                  <CardTitle className="heading-3 mt-4">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-center text-sm leading-7 text-muted-foreground sm:text-base">
                  {item.body}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="container py-10 sm:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-highlight">
              Community Pages
            </p>
            <h2 className="heading-2 mt-4">Yuranka community pages</h2>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              Explore Yuranka community experiences that live outside the main
              events calendar.
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-4xl gap-5 sm:grid-cols-2">
            {pastEventPages.map((page) => (
              <Card key={page.title} className="h-full p-0">
                <CardContent className="flex h-full flex-col p-6">
                  <CardTitle className="heading-3">{page.title}</CardTitle>
                  <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground sm:text-base">
                    {page.body}
                  </p>
                  <Button className="mt-6 w-fit" asChild>
                    <Link to={page.to}>View page</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutYuranka;
