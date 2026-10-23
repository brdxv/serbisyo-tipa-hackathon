import type { StyleSpecification } from 'maplibre-gl';

export const OPENFREEMAP_LIBERTY_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

export type SerbisYOMapStyleMode = 'serbisyo' | 'liberty' | 'satellite';

type MutableLayer = StyleSpecification['layers'][number] & {
  paint?: Record<string, unknown>;
  layout?: Record<string, unknown>;
  'source-layer'?: string;
};

let baseStylePromise: Promise<StyleSpecification> | null = null;

function layerTokens(layer: MutableLayer) {
  return `${layer.id} ${layer['source-layer'] ?? ''}`.toLowerCase();
}

function setPaint(layer: MutableLayer, property: string, value: unknown) {
  layer.paint = { ...(layer.paint ?? {}), [property]: value };
}

function setLayout(layer: MutableLayer, property: string, value: unknown) {
  layer.layout = { ...(layer.layout ?? {}), [property]: value };
}

function exposeRealMapContext(layer: MutableLayer, themed: boolean) {
  if (layer.type !== 'symbol') return;

  const tokens = layerTokens(layer);
  const isPoi = /\bpoi\b|amenity|shop|tourism|transit|aeroway/.test(tokens);
  if (!isPoi) return;

  // OpenFreeMap's native POI layers are intentionally kept separate from
  // SerbisYO prototype markers. They provide real map context only: no custom
  // click handlers, score/wait data, preview cards, or profile routing.
  setLayout(layer, 'visibility', 'visible');

  if (/poi_r1/.test(tokens)) layer.minzoom = Math.min(layer.minzoom ?? 14, 13.6);
  else if (/poi_r7/.test(tokens)) layer.minzoom = Math.min(layer.minzoom ?? 15, 14);
  else if (/poi_r20/.test(tokens)) layer.minzoom = Math.min(layer.minzoom ?? 16, 15);
  else if (/poi_transit/.test(tokens)) layer.minzoom = Math.min(layer.minzoom ?? 14, 13.6);

  // SerbisYO draws its own neutral pinpoints for native OSM POIs.
  setPaint(layer, 'icon-opacity', 0);

  if (!themed) return;

  setPaint(layer, 'text-color', '#667085');
  setPaint(layer, 'text-halo-color', 'rgba(255,255,255,0.96)');
  setPaint(layer, 'text-halo-width', 1.2);
  setPaint(layer, 'text-opacity', 0.78);
}

function shouldRemoveLayer(layer: MutableLayer) {
  const tokens = layerTokens(layer);
  return /highway-shield-non-us|highway-shield-us-interstate|road_shield_us/.test(tokens);
}

function applySerbisyoTheme(style: StyleSpecification) {
  const layers = style.layers as MutableLayer[];

  for (const layer of layers) {
    const tokens = layerTokens(layer);

    if (layer.type === 'background') {
      setPaint(layer, 'background-color', '#F3F4EF');
      continue;
    }

    if (layer.type === 'fill') {
      if (/water|ocean|river|lake/.test(tokens)) {
        setPaint(layer, 'fill-color', '#C4E7F3');
        setPaint(layer, 'fill-opacity', 0.98);
      } else if (/building/.test(tokens)) {
        setPaint(layer, 'fill-color', '#E8E6E0');
        setPaint(layer, 'fill-opacity', 0.62);
      } else if (/park|grass|wood|forest|natural|landcover|green|garden|pitch|recreation/.test(tokens)) {
        setPaint(layer, 'fill-color', '#DDEED8');
        setPaint(layer, 'fill-opacity', 0.82);
      } else if (/residential|neighbourhood|neighborhood/.test(tokens)) {
        setPaint(layer, 'fill-color', '#F7F7F4');
        setPaint(layer, 'fill-opacity', 0.94);
      } else if (/industrial|commercial|retail/.test(tokens)) {
        setPaint(layer, 'fill-color', '#F0F1ED');
        setPaint(layer, 'fill-opacity', 0.8);
      } else if (/cemetery/.test(tokens)) {
        setPaint(layer, 'fill-color', '#E4EFE1');
        setPaint(layer, 'fill-opacity', 0.76);
      }
      continue;
    }

    if (layer.type === 'fill-extrusion' && /building/.test(tokens)) {
      setPaint(layer, 'fill-extrusion-color', '#E7E5DF');
      setPaint(layer, 'fill-extrusion-opacity', 0.24);
      continue;
    }

    if (layer.type === 'line') {
      if (/waterway|river|stream|canal/.test(tokens)) {
        setPaint(layer, 'line-color', '#8FD2E6');
        setPaint(layer, 'line-opacity', 0.95);
      } else if (/motorway/.test(tokens)) {
        setPaint(layer, 'line-color', /casing|outline/.test(tokens) ? '#D8BE86' : '#F2D28B');
        setPaint(layer, 'line-opacity', 0.98);
      } else if (/trunk|primary/.test(tokens)) {
        setPaint(layer, 'line-color', /casing|outline/.test(tokens) ? '#E0D3B6' : '#F5DFA5');
        setPaint(layer, 'line-opacity', 0.98);
      } else if (/secondary|tertiary/.test(tokens)) {
        setPaint(layer, 'line-color', /casing|outline/.test(tokens) ? '#E1DED6' : '#FAEAC6');
        setPaint(layer, 'line-opacity', 0.92);
      } else if (/road|street|minor|service/.test(tokens)) {
        setPaint(layer, 'line-color', /casing|outline/.test(tokens) ? '#E1DFD9' : '#FFFFFF');
        setPaint(layer, 'line-opacity', 0.92);
      } else if (/boundary/.test(tokens)) {
        setPaint(layer, 'line-color', '#C9C1CB');
        setPaint(layer, 'line-opacity', 0.34);
      }
      continue;
    }

    if (layer.type === 'symbol') {
      const isPoi = /poi|amenity|shop|tourism|housenumber|transit|aeroway/.test(tokens);
      const isPlace = /place|city|town|village|suburb|neighbourhood|neighborhood/.test(tokens);
      const isRoadLabel = /road|street|highway|transportation_name/.test(tokens);
      const isWaterLabel = /water|river|lake/.test(tokens);

      if (isPoi && !isPlace) {
        exposeRealMapContext(layer, true);
        continue;
      }

      if (isPlace) {
        setPaint(layer, 'text-color', '#344054');
        setPaint(layer, 'text-halo-color', 'rgba(255,255,255,0.92)');
        setPaint(layer, 'text-halo-width', 1.2);
        if (/label_city/.test(tokens)) setLayout(layer, 'text-size', 18);
        else if (/label_town/.test(tokens)) setLayout(layer, 'text-size', 16);
        else if (/label_village/.test(tokens)) setLayout(layer, 'text-size', 13);
      } else if (isRoadLabel) {
        setPaint(layer, 'text-color', '#7A8494');
        setPaint(layer, 'text-halo-color', 'rgba(255,255,255,0.94)');
        setPaint(layer, 'text-halo-width', 1.1);
      } else if (isWaterLabel) {
        setPaint(layer, 'text-color', '#5C9FB2');
        setPaint(layer, 'text-halo-color', 'rgba(245,250,249,0.9)');
        setPaint(layer, 'text-halo-width', 1);
      } else {
        setPaint(layer, 'text-color', '#8B94A3');
        setPaint(layer, 'text-halo-color', 'rgba(255,255,255,0.88)');
        setPaint(layer, 'text-halo-width', 1);
      }
    }
  }

  style.name = 'TaymPers Explore';
  style.layers = layers;
  return style;
}

async function getOpenFreeMapLibertyStyle() {
  if (!baseStylePromise) {
    baseStylePromise = fetch(OPENFREEMAP_LIBERTY_STYLE).then(async (response) => {
      if (!response.ok) throw new Error(`OpenFreeMap style request failed with ${response.status}.`);
      return response.json() as Promise<StyleSpecification>;
    });
  }
  return baseStylePromise;
}

export async function loadSerbisYOExploreStyle(mode: Exclude<SerbisYOMapStyleMode, 'satellite'>) {
  const baseStyle = structuredClone(await getOpenFreeMapLibertyStyle());
  baseStyle.layers = (baseStyle.layers as MutableLayer[]).filter((layer) => !shouldRemoveLayer(layer));
  if (mode === 'serbisyo') return applySerbisyoTheme(baseStyle);

  for (const layer of baseStyle.layers as MutableLayer[]) {
    exposeRealMapContext(layer, false);
  }
  return baseStyle;
}

