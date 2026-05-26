import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

const FAQSection = ({ filter = 'all' }) => {
  const sections = [
    {
      key: 'yuranka',
      title: 'Yuranka Games',
      faqs: [
        {
          question: 'What is Yuranka Games?',
          answer:
            'Yuranka Games is a gaming store specializing in Trading Card Games, Board Games, and Video Games. We are an official TCG store for Yu-Gi-Oh!, Magic: The Gathering (MTG), One Piece Card Game, Digimon Card Game, Dragon Ball Super Card Game, Star Wars Unlimited, and Flesh and Blood. We also offer Pokémon products and tournaments, though we are not an official Pokémon TCG store.\n\nWe operate through our online shop, Cardmarket, and in person at our physical store. In addition to retail, we provide table bookings for gaming sessions, video game rentals, and birthday party organization at affordable rates.',
        },
        {
          question: 'What does TCG stand for?',
          answer:
            'TCG stands for Trading Card Game. This refers to games where players collect and use cards—each featuring unique characters, abilities, or items—in strategic gameplay. Examples include games like Yu-Gi-Oh!, Pokémon, and Magic: The Gathering.',
        },
        {
          question: 'Can I sell my cards to Yuranka Games?',
          answer:
            'Yes! We currently buy all cards on the spot for in-store customers, offering 50% of market price in store credit. We do not currently buy collections for money, but we plan to introduce this option soon.',
        },
        {
          question: 'Do you have a physical store?',
          answer:
            'Yes! Our store is located at:\nMatīsa 25, 2nd floor of Bērnu Pasaule, Riga, Latvia, Europe.\n\nYou can visit us to browse our products, participate in tournaments, sell your cards for store credit, or book tables for gaming sessions.',
        },
        {
          question: 'Do you organize birthday parties?',
          answer:
            'Yes! We offer special birthday party organization at a very affordable price. Our events include gaming activities tailored to your preferences, making it a fun and memorable experience for all participants. Contact us for more details!',
        },
        {
          question: 'How can I contact Yuranka Games?',
          answer:
            'You can reach us via email at support@yuranka.com or message us through any of our social medias: https://linktr.ee/yurankatcg. We aim to respond as quickly as possible to assist you with any questions or concerns.',
        },
      ],
    },
    {
      key: 'shipping',
      title: 'Shipping / Orders',
      faqs: [
        {
          question: 'How can I place an order?',
          answer:
            'You can place an order through our website by adding items to your cart and proceeding to checkout. We accept various payment methods, and you’ll receive an order confirmation via email once your purchase is completed.',
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Yes! We offer worldwide shipping via DHL or UPS Express.',
        },
        {
          question: 'Do international orders include customs duties or taxes?',
          answer:
            'No, international orders do not include customs duties or import taxes. These charges vary by country and are the buyer’s responsibility. Additionally, due to customs regulations, we must declare the full value of the products being shipped.',
        },
        {
          question: 'How long does shipping take?',
          answer:
            'Shipping times depend on the destination:\n• Orders above 400€: Shipped via DHL or UPS Express (Worldwide delivery in 2-5 working days).\n• Orders below 400€: Shipping time varies based on the chosen shipping method and destination.\n\nYou will receive a tracking number once your order is shipped.',
        },
        {
          question: 'What are the shipping costs?',
          answer:
            '• Orders below 40€: 15€ shipping fee\n• Orders between 40€ and 199€: Shipping cost varies based on the destination\n• Orders between 200€ and 399€: 75€ shipping fee\n',
        },
        {
          question: 'Can I sell my cards to Yuranka Games?',
          answer:
            'Yes! We currently buy all cards on the spot for in-store customers, offering 50% of market price in store credit. We do not currently buy collections for money, but we plan to introduce this option soon.',
        },
      ],
    },
    {
      key: 'reservations',
      title: 'Table / Couch Reservations',
      faqs: [
        {
          question: 'Do you offer table bookings or gaming sessions?',
          answer:
            'Yes! We offer:\n• Table bookings for 5€/table/hour or 2€/table/person/hour.\n• Video game sessions for 3€/hour (up to 3 people) and 5€/hour (more than 3 people).',
        },
        {
          question: 'Can I bring and play with my own games to Yuranka?',
          answer:
            'Of course! \nJust book a table or sofa spot with us, grab your crew, and game away! \nWe love seeing people bring their favorite games.',
        },
      ],
    },
    {
      key: 'events',
      title: 'Events',
      faqs: [
        {
          question: 'Do you host TCG tournaments at Yuranka Games?',
          answer:
            'Yes! We host a variety of TCG tournaments under our Events section — including Main Events and Weekly Events.',
        },
        {
          question:
            'Do I have to register online or can I register on spot as well?',
          answer:
            'You can also register on spot with cash or card. \n Important! \n If we have limited spots for a tournament, we will prioritize the online reservations and won’t be able to guarantee you a spot to play if you register last minute on spot. ',
        },
        {
          question: 'What is the standard TCG tournament entry at Yuranka?',
          answer:
            '✅ Budget Entry: \n•	Buy 1 pack → Receive free tournament entry. \n✅ Premium Entry: \n•	Buy 2 packs → Get the 3rd pack FREE + free tournament entry. \n✅ Competitive Entry: \n•	Buy 5 packs → Get the 6th pack FREE + free tournament entry \n•	Plus, receive an extra pack for every round win (up to 10 packs total in a 4-round tournament)!',
        },
        {
          question: 'How much does each TCG entry cost?',
          answer:
            'It depends on the booster pack you choose—our packs range from 3€ to 35€ per pack. This means your entry cost could be 3€, 5€, 6€, 7€, 10€, 15€, 35€, or any amount you’re comfortable spending.\nRemember: The more you buy, the better the deal!\nWe offer this flexibility so you can decide based on your personal preference and budget.',
        },
      ],
    },
  ];

  const filteredSections = sections.filter((section) => {
    if (filter === 'all') return true;
    if (filter === 'games' && section.key === 'reservations') return true;
    return section.key === filter;
  });

  let globalIndex = 0;

  return (
    <section className="border-t">
      <div className="container py-10">
        <h2 className="heading-2 mb-6">FAQs</h2>
        <div
          className={`grid grid-cols-1 gap-6 gap-y-8 ${
            filteredSections.length > 1 ? 'md:grid-cols-2' : ''
          }`}
        >
          {filteredSections.map((section) => (
            <div key={section.key}>
              <h3 className="heading-5 mb-4">{section.title}</h3>
              <Accordion
                type="single"
                collapsible
                className="rounded-lg border bg-muted"
              >
                {section.faqs.map((faq) => {
                  const index = globalIndex++;
                  return (
                    <AccordionItem
                      value={`item-${index}`}
                      key={index}
                      className="border-b px-4 last:border-b-0"
                    >
                      <AccordionTrigger className="text-base">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="whitespace-pre-line text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
