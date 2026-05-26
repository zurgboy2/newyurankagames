import aboutUs1 from '../assets/aboutUs1.avif';
import aboutUs2 from '../assets/aboutUs2.avif';
import aboutUs3 from '../assets/aboutUs3.avif';
import aboutUs4 from '../assets/aboutUs4.avif';
import aboutUs5 from '../assets/aboutUs5.avif';
import aboutUs6 from '../assets/aboutUs6.avif';
import aboutUs7 from '../assets/aboutUs7.avif';
import aboutUs8 from '../assets/aboutUs8.avif';

const AboutUs = () => {
  return (
    <section className="overflow-hidden border-t">
      <div className="container py-10 sm:px-8 xl:px-20">
        <div className="flex flex-col items-center text-center mb-8">
          <h2 className="heading-2">
            <span className="text-xl font-normal">at </span>
            <span className="text-[2.5rem] font-bold text-[#de2323] sm:text-[3.5rem]">
              Yuranka Games
            </span>{' '}
          </h2>
          <p className="text-xl">
            we’re more than just a game store—we’re a community.
            <br />
            From rare cards to thrilling tournaments, we’re here to fuel your
            passion.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <img
            src={aboutUs1}
            alt="AboutUs"
            className="aspect-3/2 w-full rounded-lg object-cover"
          />
          <img
            src={aboutUs2}
            alt="AboutUs"
            className="aspect-3/2 w-full rounded-lg object-cover"
          />
          <img
            src={aboutUs3}
            alt="AboutUs"
            className="aspect-3/2 w-full rounded-lg object-cover"
          />
          <img
            src={aboutUs4}
            alt="AboutUs"
            className="aspect-3/2 w-full rounded-lg object-cover"
          />
          <img
            src={aboutUs5}
            alt="AboutUs"
            className="aspect-3/2 w-full rounded-lg object-cover"
          />
          <img
            src={aboutUs6}
            alt="AboutUs"
            className="aspect-3/2 w-full rounded-lg object-cover"
          />
          <img
            src={aboutUs7}
            alt="AboutUs"
            className="aspect-3/2 w-full rounded-lg object-cover"
          />
          <img
            src={aboutUs8}
            alt="AboutUs"
            className="aspect-3/2 w-full rounded-lg object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
