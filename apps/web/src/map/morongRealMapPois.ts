import morongPoiSnapshot from '../../../../data/morong-osm-pois.json';

export type MorongRealMapPoi = {
  id: string;
  name: string;
  coords: [number, number];
  tags: Record<string, string>;
};

export function nativePoiPinAsset(tags: Record<string, unknown>) {
  const value = `${tags.class ?? ''} ${tags.subclass ?? ''} ${tags.category ?? ''} ${tags.type ?? ''} ${tags.name ?? ''}`.toLowerCase();
  if (/hospital|clinic|doctor|dentist|health/.test(value)) return '/assets/pinpoints/clinic-marker-default.png';
  if (/restaurant|cafe|fast_food|food/.test(value)) return '/assets/pinpoints/food-marker-default.png';
  if (/pharmacy|chemist|shop|market|mall|supermarket/.test(value)) return '/assets/pinpoints/commerce-marker-default.png';
  if (/school|college|university|education/.test(value)) return '/assets/pinpoints/education-marker-default.png';
  if (/bus|station|transport|terminal/.test(value)) return '/assets/pinpoints/transportation-marker-default.png';
  if (/bank|atm|financial/.test(value)) return '/assets/pinpoints/default-location-marker.png';
  if (/townhall|government|civic|police|fire_station|courthouse/.test(value)) return '/assets/pinpoints/default-government-marker.png';
  return '/assets/pinpoints/neutral-place-marker.png';
}

export function loadMorongRealMapPois() {
  return Promise.resolve(
    morongPoiSnapshot.map((item) => ({
      id: item.id,
      name: item.name,
      coords: [item.lat, item.lng] as [number, number],
      tags: item.tags as Record<string, string>,
    })),
  );
}
