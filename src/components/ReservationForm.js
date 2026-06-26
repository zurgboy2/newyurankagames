import bigTables from '../assets/bigTables.avif';
import smallTables from '../assets/smallTables.avif';
import couchSpaces from '../assets/couchSpaces.avif';
import { makeRegistrationRequestCall } from '../api/api';
import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  Gamepad2Icon,
  Maximize2Icon,
  MailIcon,
  SparklesIcon,
  SwordsIcon,
  UserIcon,
  UsersIcon,
  XIcon,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Skeleton } from './ui/skeleton';

const ReservationForm = () => {
  const [error, setError] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [spaces, setSpaces] = useState([]);
  const [bigTablesSelected, setBigTablesSelected] = useState(0);
  const [smallTablesSelected, setSmallTablesSelected] = useState(0);
  const [couchSpacesSelected, setCouchSpacesSelected] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');
  const [isTimeSlotsLoading, setIsTimeSlotsLoading] = useState(false);
  const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const reservationOptionsRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isConfirmationStep, setIsConfirmationStep] = useState(false);
  const [activePhotoIndexes, setActivePhotoIndexes] = useState({});
  const [fullscreenGallery, setFullscreenGallery] = useState(null);

  useEffect(() => {
    const storedName = sessionStorage.getItem('name') || '';
    setName(storedName);
  }, []);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('email') || '';
    setEmail(storedEmail);
  }, []);

  const handleDateChange = async (newValue) => {
    setTimeSlots([]);
    setStartTime('');
    setEndTime('');
    setSpaces([]);
    setBigTablesSelected(0);
    setSmallTablesSelected(0);
    setCouchSpacesSelected(0);

    if (!newValue) {
      setSelectedDate(null);
      return;
    }

    setSelectedDate(dayjs(newValue));
    const today = dayjs().startOf('day');

    if (dayjs(newValue).isBefore(today)) {
      setError('Please select a future date.');
      return;
    }

    setError('');

    setIsTimeSlotsLoading(true);
    try {
      const currentTime = new Date();
      const selectedDate = newValue.format('YYYY-MM-DD');

      const slots = await makeRegistrationRequestCall(
        'registration_script',
        'getTimeSlots',
        { date: newValue.format('YYYY-MM-DD') },
      );

      const filteredSlots = slots.filter((slot) => {
        const slotDateTime = new Date(`${selectedDate}T${slot}`);
        return slotDateTime >= currentTime;
      });
      setTimeSlots(filteredSlots);
      setIsTimeSlotsLoading(false);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      setIsTimeSlotsLoading(false);
    }
  };

  const handleStartTimeChange = (slot) => {
    setStartTime(slot);
    setEndTime('');
    setSpaces([]);
    setBigTablesSelected(0);
    setSmallTablesSelected(0);
    setCouchSpacesSelected(0);
  };

  const handleEndTimeChange = async (slot) => {
    setEndTime(slot);
    setSpaces([]);
    setBigTablesSelected(0);
    setSmallTablesSelected(0);
    setCouchSpacesSelected(0);
    setIsAvailabilityLoading(true);

    try {
      const capacities = await makeRegistrationRequestCall(
        'registration_script',
        'checkUnavailability',
        {
          date: selectedDate,
          startTime: startTime,
          endTime: slot,
        },
      );

      setSpaces(capacities);
      setIsAvailabilityLoading(false);
    } catch (error) {
      console.error('Error checking unavailability:', error);
      setIsAvailabilityLoading(false);
    }
  };

  const handleBigTableChange = (e) => {
    const value = Math.max(
      0,
      Math.min(e.target.value, spaces['Big Tables'].count),
    );
    setBigTablesSelected(value);
  };

  const handleSmallTableChange = (e) => {
    const value = Math.max(
      0,
      Math.min(e.target.value, spaces['Small Tables'].count),
    );
    setSmallTablesSelected(value);
  };

  const handleCouchSpaceChange = (e) => {
    const value = Math.max(
      0,
      Math.min(e.target.value, spaces['Couch Spaces'].count),
    );
    setCouchSpacesSelected(value);
  };

  const handleReservationSubmit = async () => {
    if (!selectedDate) {
      setMessage('Please select the desired date for your reservation.');
      setShowPopup(true);
      return;
    }

    if (!startTime || !endTime) {
      setMessage(
        'Please select both start time and end time for your reservation.',
      );
      setShowPopup(true);
      return;
    }

    if (!name || !email) {
      setMessage(
        'Please enter both name and email to proceed with the reservation.',
      );
      setShowPopup(true);
      return;
    }

    if (
      parseInt(bigTablesSelected) === 0 &&
      parseInt(smallTablesSelected) === 0 &&
      parseInt(couchSpacesSelected) === 0
    ) {
      setMessage(
        'Please select at least one reservation option (Big Tables, Small Tables, or Couch Spaces).',
      );
      setShowPopup(true);
      return;
    }

    const reservationDetails = `Dear ${name},\nYour reservation details are as follows:\n${selectedDate.format(
      'ddd, DD MMM YYYY',
    )} from ${startTime} to ${endTime}\nBig Tables: ${bigTablesSelected}\nSmall Tables: ${smallTablesSelected}\nCouch Spaces: ${couchSpacesSelected}\n\nSubmit reservation and you will be directed to the checkout for payment. Make the payment to confirm your reservation.`;

    setMessage(reservationDetails);
    setIsConfirmationStep(true);
    setShowPopup(true);
  };

  const handleConfirmedSubmission = async () => {
    var username = sessionStorage.getItem('username');
    var googleToken = sessionStorage.getItem('googleToken');

    var availabilityData = [];
    availabilityData.push(
      { type: 'Big Tables', chosenAmount: parseInt(bigTablesSelected) },
      { type: 'Small Tables', chosenAmount: parseInt(smallTablesSelected) },
      { type: 'Couch Spaces', chosenAmount: parseInt(couchSpacesSelected) },
    );

    const reservationDetails = {
      date: selectedDate.format('YYYY-MM-DD'),
      startTime,
      endTime,
      name,
      email,
      username,
      googleToken,
      availability: availabilityData,
    };

    setIsSubmitting(true);
    try {
      const response = await makeRegistrationRequestCall(
        'registration_script',
        'submitReservationDetails',
        { reservationDetails },
      );
      setIsSubmitting(false);

      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      } else {
        setMessage(
          response.message ||
            'An error occurred while processing your reservation.',
        );
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error submitting reservation:', error);
      setIsSubmitting(false);
      setMessage(
        'There was a problem submitting your reservation. Please try again.',
      );
      setShowPopup(true);
    }
  };

  useEffect(() => {
    if (hasAvailability(spaces) && window.innerWidth >= 768) {
      reservationOptionsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [spaces]);

  const reservationSpaces = [
    {
      key: 'Big Tables',
      title: 'Big Tables',
      image: bigTables,
      alt: 'Big table reservation area',
      photos: [{ label: 'Big Tables', image: bigTables }],
      details: [
        {
          icon: UsersIcon,
          title: 'Board games and hangouts',
          body: 'Comfortable space for 6 people.',
        },
        {
          icon: SwordsIcon,
          title: 'TCG activities',
          body: 'Playable setup for 4 people.',
        },
        {
          icon: SparklesIcon,
          title: 'Best for',
          body: 'Large board games, group play, and longer sessions.',
        },
      ],
      value: bigTablesSelected,
      onChange: handleBigTableChange,
    },
    {
      key: 'Small Tables',
      title: 'Small Tables',
      image: smallTables,
      alt: 'Small table reservation area',
      photos: [{ label: 'Small Tables', image: smallTables }],
      details: [
        {
          icon: UsersIcon,
          title: 'Board games and hangouts',
          body: 'Comfortable space for 4 people.',
        },
        {
          icon: SwordsIcon,
          title: 'TCG activities',
          body: 'Playable setup for 2 people.',
        },
        {
          icon: SparklesIcon,
          title: 'Best for',
          body: 'Smaller board games, casual play, and focused matches.',
        },
      ],
      value: smallTablesSelected,
      onChange: handleSmallTableChange,
    },
    {
      key: 'Couch Spaces',
      title: 'Couch Spaces',
      image: couchSpaces,
      alt: 'Couch reservation area',
      photos: [{ label: 'Couch Spaces', image: couchSpaces }],
      details: [
        {
          icon: UsersIcon,
          title: 'Comfortable seating',
          body: 'Lounge seating for 6 people.',
        },
        {
          icon: Gamepad2Icon,
          title: 'Video games',
          body: 'Often accompanied by various video games.',
        },
        {
          icon: SparklesIcon,
          title: 'Best for',
          body: 'Relaxed sessions, casual play, and softer seating.',
        },
      ],
      value: couchSpacesSelected,
      onChange: handleCouchSpaceChange,
    },
  ];

  const availableEndSlots = timeSlots.filter(
    (slot) => startTime && slot > startTime,
  );

  return (
    <section className="border-t bg-muted/20">
      <div className="container py-10 sm:py-14">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-highlight">
            Reserve a space
          </p>
          <h1 className="heading-1">Reservations</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Pick a date, choose your play time, and reserve the spaces that fit
            your group.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <ProcessStep
            number="1"
            title="Choose date"
            body="Start with the day you want to visit."
          />
          <ProcessStep
            number="2"
            title="Pick time"
            body="Select start and end time from available slots."
          />
          <ProcessStep
            number="3"
            title="Reserve space"
            body="Choose tables or couch seats for your group."
          />
        </div>

        <Card className="mt-8 p-0">
          <CardHeader className="border-b p-5">
            <div className="flex items-center gap-2 text-highlight">
              <CalendarDaysIcon className="size-5" />
              <CardTitle className="heading-4">Plan your reservation</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 p-5">
            <div className="grid gap-4 md:grid-cols-[minmax(18rem,26rem)_minmax(10rem,16rem)_minmax(10rem,16rem)]">
              <DateField
                error={error}
                selectedDate={selectedDate}
                onSelect={handleDateChange}
              />

              <TimeSelect
                label="Start time"
                icon={ClockIcon}
                value={startTime}
                slots={timeSlots}
                onSelect={handleStartTimeChange}
                disabled={
                  !selectedDate ||
                  Boolean(error) ||
                  isTimeSlotsLoading ||
                  timeSlots.length === 0
                }
                loading={isTimeSlotsLoading}
                placeholder={
                  selectedDate && !error && timeSlots.length === 0
                    ? 'No slots available'
                    : selectedDate && !error
                      ? 'Select start time'
                      : 'Select date first'
                }
              />
              <TimeSelect
                label="End time"
                icon={ClockIcon}
                value={endTime}
                slots={availableEndSlots}
                onSelect={handleEndTimeChange}
                disabled={
                  !startTime ||
                  isTimeSlotsLoading ||
                  availableEndSlots.length === 0
                }
                loading={isTimeSlotsLoading}
                placeholder={
                  startTime ? 'Select end time' : 'Select start time first'
                }
              />
            </div>

            {!isTimeSlotsLoading &&
            selectedDate &&
            !error &&
            timeSlots.length === 0 ? (
              <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                No open time slots for this date.
              </p>
            ) : null}

            <ReservationTerms />
          </CardContent>
        </Card>

        <div
          className="mt-8 grid items-stretch gap-5 md:grid-cols-3"
          ref={reservationOptionsRef}
        >
          {reservationSpaces.map((space, spaceIndex) => {
            const activePhotoIndex = activePhotoIndexes[space.key] ?? 0;
            return (
              <Card
                key={space.key}
                className="flex min-h-full flex-col overflow-hidden p-0"
              >
                <ReservationCardGallery
                  space={space}
                  activeIndex={activePhotoIndex}
                  onChange={(index) =>
                    setActivePhotoIndexes((state) => ({
                      ...state,
                      [space.key]: index,
                    }))
                  }
                  onOpenFullscreen={() =>
                    setFullscreenGallery({
                      spaceIndex,
                      photoIndex: activePhotoIndex,
                    })
                  }
                  availability={
                    hasAvailability(spaces)
                      ? (spaces[space.key]?.count ?? 0)
                      : null
                  }
                />
                <CardContent className="p-4">
                  <div className="grid gap-3">
                    {space.details.map((detail) => (
                      <ReservationDetail key={detail.title} {...detail} />
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="mt-auto p-4">
                  {isAvailabilityLoading ? (
                    <div className="grid w-full gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-28" />
                    </div>
                  ) : hasAvailability(spaces) ? (
                    <div className="grid w-full gap-2">
                      <label
                        className="text-sm font-medium"
                        htmlFor={`reservation-${space.key}`}
                      >
                        Choose amount
                      </label>
                      <div className="flex items-center gap-3">
                        <Input
                          id={`reservation-${space.key}`}
                          type="number"
                          min="0"
                          max={spaces[space.key]?.count}
                          value={space.value}
                          onChange={space.onChange}
                          className="h-9 max-w-20 text-center text-base font-semibold text-highlight"
                        />
                        <span className="text-xs text-muted-foreground">
                          max {spaces[space.key]?.count ?? 0}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="w-full rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
                      Select a date and time to see availability.
                    </p>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {fullscreenGallery !== null && (
          <ReservationGallery
            space={reservationSpaces[fullscreenGallery.spaceIndex]}
            activeIndex={fullscreenGallery.photoIndex}
            onChange={(index) => {
              const space = reservationSpaces[fullscreenGallery.spaceIndex];
              setFullscreenGallery((state) => ({
                ...state,
                photoIndex: index,
              }));
              setActivePhotoIndexes((state) => ({
                ...state,
                [space.key]: index,
              }));
            }}
            onClose={() => setFullscreenGallery(null)}
          />
        )}

        <Card className="mt-8 p-0">
          <CardHeader className="border-b p-5">
            <div className="flex items-center gap-2 text-highlight">
              <UserIcon className="size-5" />
              <CardTitle className="heading-4">Contact details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="name">
                Name
              </label>
              <div className="relative">
                <UserIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-highlight" />
                <Input
                  type="text"
                  id="name"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <MailIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-highlight" />
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-center">
          <Button
            size="lg"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
            onClick={handleReservationSubmit}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Reservation'}
          </Button>
        </div>

        {showPopup && (
          <ConfirmationPopup
            message={message}
            isConfirmationStep={isConfirmationStep}
            onClose={() => {
              setShowPopup(false);
              setIsConfirmationStep(false);
            }}
            onSubmit={handleConfirmedSubmission}
          />
        )}
      </div>
    </section>
  );
};

const DateField = ({ error, selectedDate, onSelect }) => {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium" htmlFor="reservation-date">
        Date
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="reservation-date"
            type="button"
            variant="outline"
            size="lg"
            className="h-11 w-full justify-start border-input bg-transparent px-3 text-left text-sm font-normal text-muted-foreground hover:bg-muted hover:text-foreground data-[selected=true]:text-foreground dark:bg-input/30 dark:hover:bg-input/50"
            data-selected={Boolean(selectedDate)}
          >
            <CalendarDaysIcon className="text-highlight" />
            {selectedDate
              ? selectedDate.format('dddd, DD MMM YYYY')
              : 'Select a date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate?.toDate()}
            disabled={{ before: new Date() }}
            onSelect={(date) => onSelect(date ? dayjs(date) : null)}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
};

const TimeSelect = ({
  label,
  icon: Icon,
  value,
  slots,
  onSelect,
  disabled,
  loading,
  placeholder,
}) => {
  const triggerPlaceholder = loading ? 'Loading slots...' : placeholder;

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium" htmlFor={`reservation-${label}`}>
        {label}
      </label>
      <Select
        value={value || undefined}
        onValueChange={onSelect}
        disabled={disabled}
      >
        <SelectTrigger
          id={`reservation-${label}`}
          size="default"
          className="h-11 w-full bg-background px-3 data-[size=default]:h-11"
        >
          <span className="flex min-w-0 items-center gap-2">
            {Icon && <Icon className="size-4 text-highlight" />}
            <SelectValue placeholder={triggerPlaceholder} />
          </span>
        </SelectTrigger>
        <SelectContent position="popper" align="start">
          {slots.map((slot) => (
            <SelectItem key={slot} value={slot}>
              {slot}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const hasAvailability = (spaces) => {
  return spaces && Object.keys(spaces).length > 0;
};

const ReservationTerms = () => {
  return (
    <Accordion
      type="single"
      collapsible
      className="rounded-lg border bg-background/60 px-3"
    >
      <AccordionItem value="terms" className="border-none">
        <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
          Reservation terms
        </AccordionTrigger>
        <AccordionContent className="grid gap-3 pb-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            You can book any combination of items below. The people limit is
            more of a counter for ourselves, as we might be able to provide a
            discount if you have more than 10 people coming. Registering only
            the number of people, and not any spaces, means you require no
            seating at the venue and are happy to stand.
          </p>
          <p>
            The reservation fee is charged on the basis of you being able to
            reserve. The amount paid will be deducted from your final bill for
            the total use of the items reserved. If you do not show up, the
            reservation fee will not be refunded.
          </p>
          <p>
            You are also allowed to show up without a reservation, but a spot is
            not guaranteed if your requested space is already occupied.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const ReservationCardGallery = ({
  space,
  activeIndex,
  onChange,
  onOpenFullscreen,
  availability,
}) => {
  const activePhoto = space.photos[activeIndex];
  const previousIndex =
    (activeIndex - 1 + space.photos.length) % space.photos.length;
  const nextIndex = (activeIndex + 1) % space.photos.length;
  const hasMultiplePhotos = space.photos.length > 1;

  return (
    <div className="relative h-48 overflow-hidden border-b bg-black p-2 sm:h-56">
      <PhotoFrame
        image={activePhoto.image}
        alt={`${space.title} - ${activePhoto.label}`}
        className="h-full rounded-md"
      />
      <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-3 rounded-md bg-background/85 px-3 py-2 backdrop-blur">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-medium">
            {activePhoto.label}
          </span>
          {availability !== null && (
            <Badge variant="secondary" className="shrink-0">
              {availability} open
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {hasMultiplePhotos && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => onChange(previousIndex)}
                aria-label={`Previous ${space.title} photo`}
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => onChange(nextIndex)}
                aria-label={`Next ${space.title} photo`}
              >
                <ChevronRightIcon />
              </Button>
            </>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={onOpenFullscreen}
            aria-label={`Open ${space.title} fullscreen gallery`}
          >
            <Maximize2Icon />
          </Button>
        </div>
      </div>
    </div>
  );
};

const PhotoFrame = ({ image, alt, className = '' }) => {
  return (
    <img
      src={image}
      alt={alt}
      className={`w-full object-contain ${className}`}
    />
  );
};

const ReservationGallery = ({ space, activeIndex, onChange, onClose }) => {
  const activePhoto = space.photos[activeIndex];
  const previousIndex =
    (activeIndex - 1 + space.photos.length) % space.photos.length;
  const nextIndex = (activeIndex + 1) % space.photos.length;
  const hasMultiplePhotos = space.photos.length > 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <Card
        className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden p-0"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-start justify-between gap-4 border-b p-4">
          <div>
            <CardTitle className="heading-4">{space.title}</CardTitle>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={onClose}
            aria-label="Close gallery"
          >
            <XIcon />
          </Button>
        </CardHeader>

        <CardContent className="relative min-h-0 flex-1 p-0">
          <div className="flex h-[58vh] min-h-0 items-center justify-center bg-black p-4">
            <PhotoFrame
              image={activePhoto.image}
              alt={`${space.title} - ${activePhoto.label}`}
              className="h-full max-w-4xl rounded-md"
            />
          </div>

          {hasMultiplePhotos && (
            <>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/85"
                onClick={() => onChange(previousIndex)}
                aria-label="Previous image"
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/85"
                onClick={() => onChange(nextIndex)}
                aria-label="Next image"
              >
                <ChevronRightIcon />
              </Button>
            </>
          )}
        </CardContent>

        {hasMultiplePhotos && (
          <CardFooter className="flex gap-3 overflow-x-auto border-t p-4">
            {space.photos.map((photo, index) => (
              <button
                key={photo.label}
                type="button"
                onClick={() => onChange(index)}
                className={`w-48 shrink-0 rounded-lg border p-2 text-left transition-colors hover:border-highlight/70 ${
                  index === activeIndex
                    ? 'border-highlight bg-highlight/10'
                    : 'bg-card'
                }`}
              >
                <PhotoFrame
                  image={photo.image}
                  alt=""
                  className="mb-2 h-16 rounded-md"
                />
                <span className="text-sm font-medium">{photo.label}</span>
              </button>
            ))}
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

const ReservationDetail = ({ icon: Icon, title, body }) => {
  return (
    <div className="flex gap-3 rounded-md bg-muted p-3 border">
      <Icon className="mt-0.5 size-4 shrink-0 text-highlight" />
      <div className="min-w-0">
        <div className="text-sm font-semibold leading-tight text-foreground">
          {title}
        </div>
        <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {body}
        </div>
      </div>
    </div>
  );
};

const ProcessStep = ({ number, title, body }) => {
  return (
    <Card className="p-0">
      <CardContent className="flex items-start gap-3 p-4">
        <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-highlight text-sm font-bold text-white">
          {number}
        </div>
        <div>
          <h2 className="heading-5">{title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {body}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const ConfirmationPopup = ({
  message,
  isConfirmationStep,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <Card className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto p-0 shadow-2xl">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3"
          aria-label="Close"
          onClick={onClose}
        >
          <XIcon />
        </Button>
        <CardHeader>
          <CardTitle className="heading-4">
            {isConfirmationStep ? 'Confirm reservation' : 'Reservation notice'}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {message}
          </p>
          {isConfirmationStep && (
            <Button size="lg" onClick={onSubmit}>
              Submit Reservation
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationForm;
