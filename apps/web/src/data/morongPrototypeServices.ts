import type { ServiceSummary } from '../types/service';
import morongPlaces from '../../../../data/morong-real-places.json';

type PlaceRecord = (typeof morongPlaces.places)[number];

const mapCenter: [number, number] = [
  morongPlaces.zone.center.lat,
  morongPlaces.zone.center.lng,
];

const prototypeMetricOverrides: Record<string, Partial<ServiceSummary>> = {
  'morong-municipal-hall': {
    averageWaitMinutes: 25,
    reliability: 91,
    score: 88,
    insight: 'Usually quieter after 3 PM.',
    confidence: 'High',
    reports: 124,
  },
  'lto-morong-district-office': {
    averageWaitMinutes: 45,
    score: 82,
    insight: 'Queue length can vary significantly by transaction type and time of day.',
    confidence: 'High',
  },
  'morong-fire-station': {
    averageWaitMinutes: 15,
    score: 92,
    insight: 'Office assistance is generally straightforward outside emergency-response activity.',
    confidence: 'Moderate',
  },
  'morong-public-market': {
    averageWaitMinutes: 8,
    score: 80,
    insight: 'Most visits move quickly, with crowding more noticeable during peak market hours.',
    confidence: 'High',
  },
  'registry-of-deeds-morong': {
    averageWaitMinutes: 30,
    score: 84,
    insight: 'Document transactions can take longer when verification or additional requirements are needed.',
    confidence: 'Moderate',
  },
  'east-systems-colleges-of-rizal': {
    isOpen: true,
    closesIn: 'Closes 5:00 PM',
    averageWaitMinutes: 15,
    score: 90,
    insight: 'Most school-office inquiries are manageable outside enrollment and deadline periods.',
    confidence: 'Moderate',
  },
  'morong-rural-health-unit': {
    averageWaitMinutes: 35,
    reliability: 94,
    score: 86,
    insight: 'Morning patient volume can create longer queues for consultations and public-health services.',
    confidence: 'High',
    reports: 98,
  },
  'commandancia-museong-pambayan': {
    averageWaitMinutes: 5,
    score: 91,
    insight: 'Walk-in museum visits generally require little to no queueing.',
    confidence: 'High',
  },
  'morong-doctors-hospital': {
    averageWaitMinutes: 40,
    score: 78,
    insight: 'Waiting time depends heavily on the department, patient volume, and urgency.',
    confidence: 'Moderate',
  },
  'savemore-market-morong': {
    averageWaitMinutes: 15,
    score: 84,
    insight: 'Checkout queues are usually manageable but can build during busy shopping periods.',
    confidence: 'High',
  },
  'urs-morong-campus': {
    averageWaitMinutes: 25,
    reliability: 82,
    score: 87,
    insight: 'Registrar, cashier, and enrollment-related queues can become longer around deadlines.',
    confidence: 'Moderate',
    reports: 61,
  },
  'mercury-drug-morong-t-claudio': {
    averageWaitMinutes: 8,
    reliability: 96,
    score: 88,
    insight: 'Usually fastest outside after-work hours.',
    confidence: 'High',
    reports: 87,
  },
  'rizal-provincial-hospital-system-morong': {
    isOpen: true,
    closesIn: 'Open 24 hours',
    averageWaitMinutes: 90,
    reliability: 89,
    score: 70,
    insight: 'Outpatient and non-emergency queues can be lengthy, especially during high patient volume.',
    confidence: 'High',
    reports: 116,
  },
  'supreme-care-medical-diagnostic': {
    averageWaitMinutes: 20,
    score: 85,
    insight: 'Diagnostic visits are generally predictable, with some added wait during busier testing periods.',
    confidence: 'High',
  },
  'morong-national-high-school': {
    averageWaitMinutes: 15,
    score: 85,
    insight: 'School-office transactions are usually manageable outside enrollment and records-request peaks.',
    confidence: 'Moderate',
  },
};

const categoryImages: Record<string, string> = {
  government: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=320&q=80',
  healthcare: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=320&q=80',
  education: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=320&q=80',
  pharmacy: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=320&q=80',
  commerce: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=320&q=80',
  transportation: 'https://images.unsplash.com/photo-1485575301924-6891ef935dcd?auto=format&fit=crop&w=320&q=80',
  emergency: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=320&q=80',
};

export const localEstablishmentImages: Record<string, string[]> = {
  'morong-municipal-hall': [
    '/assets/establishments/morong-municipal-hall/morong-municipal-hall-01-main.jpg',
    '/assets/establishments/morong-municipal-hall/morong-municipal-hall-02-place.jpg',
    '/assets/establishments/morong-municipal-hall/morong-municipal-hall-03-service.jpg',
  ],
  'lto-morong-district-office': [
    '/assets/establishments/lto-morong-district-office/lto-morong-district-office-01-main.jpg',
    '/assets/establishments/lto-morong-district-office/lto-morong-district-office-02-place.jpg',
    '/assets/establishments/lto-morong-district-office/lto-morong-district-office-03-service.jpg',
  ],
  'morong-fire-station': [
    '/assets/establishments/morong-fire-station/morong-fire-station-01-main.jpg',
    '/assets/establishments/morong-fire-station/morong-fire-station-02-place.jpg',
    '/assets/establishments/morong-fire-station/morong-fire-station-03-service.jpg',
  ],
  'morong-public-market': [
    '/assets/establishments/morong-public-market/morong-public-market-02-place.jpg',
    '/assets/establishments/morong-public-market/morong-public-market-03-service.jpg',
  ],
  'savemore-market-morong': [
    '/assets/establishments/savemore-market-morong/savemore-market-morong-01-main.jpg',
    '/assets/establishments/savemore-market-morong/savemore-market-morong-02-place.jpg',
    '/assets/establishments/savemore-market-morong/savemore-market-morong-03-service.jpg',
  ],
  'registry-of-deeds-morong': [
    '/assets/establishments/registry-of-deeds-morong/registry-of-deeds-morong-01-main.jpg',
    '/assets/establishments/registry-of-deeds-morong/registry-of-deeds-morong-02-place.jpg',
    '/assets/establishments/registry-of-deeds-morong/registry-of-deeds-morong-03-service.jpg',
  ],
  'rizal-provincial-hospital-system-morong': [
    '/assets/establishments/rizal-provincial-hospital-system-morong/rizal-provincial-hospital-system-morong-01-main.jpg',
    '/assets/establishments/rizal-provincial-hospital-system-morong/rizal-provincial-hospital-system-morong-02-place.jpg',
    '/assets/establishments/rizal-provincial-hospital-system-morong/rizal-provincial-hospital-system-morong-03-service.jpg',
  ],
  'supreme-care-medical-diagnostic': [
    '/assets/establishments/supreme-care-medical-diagnostic/supreme-care-medical-diagnostic-01-main.jpg',
    '/assets/establishments/supreme-care-medical-diagnostic/supreme-care-medical-diagnostic-02-place.jpg',
    '/assets/establishments/supreme-care-medical-diagnostic/supreme-care-medical-diagnostic-03-service.jpg',
  ],
  'morong-national-high-school': [
    '/assets/establishments/morong-national-high-school/morong-national-high-school-01-main.jpg',
    '/assets/establishments/morong-national-high-school/morong-national-high-school-02-place.jpg',
    '/assets/establishments/morong-national-high-school/morong-national-high-school-03-service.jpg',
  ],
  'urs-morong-campus': [
    '/assets/establishments/urs-morong-campus/urs-morong-campus-01-main.jpg',
    '/assets/establishments/urs-morong-campus/urs-morong-campus-02-place.jpg',
    '/assets/establishments/urs-morong-campus/urs-morong-campus-03-service.jpg',
  ],
  'mercury-drug-morong-t-claudio': [
    '/assets/establishments/mercury-drug-morong-t-claudio/mercury-drug-morong-t-claudio-01-main.jpg',
    '/assets/establishments/mercury-drug-morong-t-claudio/mercury-drug-morong-t-claudio-02-place.jpg',
    '/assets/establishments/mercury-drug-morong-t-claudio/mercury-drug-morong-t-claudio-03-service.jpg',
  ],
  'morong-doctors-hospital': [
    '/assets/establishments/morong-doctors-hospital/morong-doctors-hospital-01-main.jpg',
  ],
  'commandancia-museong-pambayan': [
    '/assets/establishments/commandancia-museong-pambayan/commandancia-museong-pambayan-01-main.jpg',
    '/assets/establishments/commandancia-museong-pambayan/commandancia-museong-pambayan-02-place.jpg',
    '/assets/establishments/commandancia-museong-pambayan/commandancia-museong-pambayan-03-service.jpg',
  ],
  'morong-rural-health-unit': [
    '/assets/establishments/morong-rural-health-unit/morong-rural-health-unit-01-main.jpg',
    '/assets/establishments/morong-rural-health-unit/morong-rural-health-unit-03-service.jpg',
  ],
  'east-systems-colleges-of-rizal': [
    '/assets/establishments/east-systems-colleges-of-rizal/east-systems-colleges-of-rizal-01-main.jpg',
    '/assets/establishments/east-systems-colleges-of-rizal/east-systems-colleges-of-rizal-02-place.jpg',
    '/assets/establishments/east-systems-colleges-of-rizal/east-systems-colleges-of-rizal-03-service.jpg',
  ],
};

function categoryLabel(place: PlaceRecord) {
  const category = place.category;
  if (category.includes('healthcare')) return 'Clinic / Healthcare';
  if (category.includes('education')) return 'Education Service';
  if (category.includes('pharmacy')) return 'Pharmacy';
  if (category.includes('transportation')) return 'Transportation / Government';
  if (category.includes('emergency')) return 'Emergency / Government';
  if (category.includes('commerce')) return 'Commerce / Public Facility';
  if (category.includes('museum')) return 'Government / Public Facility';
  return 'Government Service';
}

function imageFor(place: PlaceRecord) {
  const localImages = localEstablishmentImages[place.id];
  if (localImages?.length) return localImages[0];

  const category = place.category;
  const key = Object.keys(categoryImages).find((item) => category.includes(item)) ?? 'government';
  return categoryImages[key];
}

function haversineKm(a: [number, number], b: [number, number]) {
  const toRad = (value: number) => value * Math.PI / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h = Math.sin(dLat / 2) ** 2
    + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return earthRadiusKm * 2 * Math.asin(Math.sqrt(h));
}

function deterministicMetrics(place: PlaceRecord, index: number): ServiceSummary {
  const coords: [number, number] = [place.coordinates.lat, place.coordinates.lng];
  const defaultConfidence: ServiceSummary['confidence'] = index % 4 === 0 ? 'Moderate' : 'High';
  const defaults: ServiceSummary = {
    id: place.id,
    name: place.name,
    category: categoryLabel(place),
    address: place.address,
    isOpen: index % 6 !== 5,
    closesIn: index % 6 !== 5 ? 'Closes 5:00 PM' : 'Closed for now',
    averageWaitMinutes: 11 + ((index * 7) % 24),
    reliability: 82 + ((index * 5) % 15),
    score: 78 + ((index * 3) % 15),
    insight: index % 2 === 0 ? 'Usually quieter later in the afternoon.' : 'Community activity is steadier before noon.',
    distanceKm: Number(haversineKm(mapCenter, coords).toFixed(1)),
    coords,
    image: imageFor(place),
    images: localEstablishmentImages[place.id] ?? [imageFor(place)],
    confidence: defaultConfidence,
    reports: 38 + index * 7,
  };

  return {
    ...defaults,
    ...prototypeMetricOverrides[place.id],
    // Identity/location above come from the real-place dataset. Metrics are simulated for prototype use.
  };
}

export const morongPrototypeServices: ServiceSummary[] = morongPlaces.places.map(deterministicMetrics);

export const morongPrototypeZone = morongPlaces.zone;

