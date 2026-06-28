// Mapbox public access token (pk.*). Set EXPO_PUBLIC_MAPBOX_TOKEN in .env
// (see .env.example). It ships in the client bundle, so use a public token and
// restrict it by URL in your Mapbox dashboard for production.
export const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '';

/**
 * Builds a Mapbox Static Images API URL — a real Mapbox-styled map with a pin,
 * rendered as a plain <Image> (works in Expo Go and on web, no native modules).
 */
export function staticMapUrl(
  lng: number,
  lat: number,
  opts: { zoom?: number; width?: number; height?: number; pinColor?: string; style?: string } = {},
) {
  const {
    zoom = 15,
    width = 640,
    height = 320,
    pinColor = 'ef4444',
    style = 'satellite-streets-v12',
  } = opts;
  const marker = `pin-l+${pinColor}(${lng},${lat})`;
  return (
    `https://api.mapbox.com/styles/v1/mapbox/${style}/static/` +
    `${marker}/${lng},${lat},${zoom},0/${width}x${height}@2x` +
    `?access_token=${MAPBOX_TOKEN}`
  );
}

/**
 * Full HTML page with an interactive Mapbox GL JS map (pan/zoom) and a marker.
 * Rendered inside a WebView (native) or an <iframe> (web) so taps open a real
 * Mapbox map — not Google/Apple Maps.
 */
export function interactiveMapHtml(
  lng: number,
  lat: number,
  opts: { zoom?: number; style?: string; pinColor?: string } = {},
) {
  const { zoom = 15, style = 'satellite-streets-v12', pinColor = '#ef4444' } = opts;
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<link href="https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.css" rel="stylesheet" />
<script src="https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.js"></script>
<style>html,body,#map{margin:0;padding:0;height:100%;width:100%;}</style>
</head>
<body>
<div id="map"></div>
<script>
  mapboxgl.accessToken = ${JSON.stringify(MAPBOX_TOKEN)};
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/${style}',
    center: [${lng}, ${lat}],
    zoom: ${zoom},
  });
  map.addControl(new mapboxgl.NavigationControl(), 'top-right');
  new mapboxgl.Marker({ color: ${JSON.stringify(pinColor)} })
    .setLngLat([${lng}, ${lat}])
    .addTo(map);
</script>
</body>
</html>`;
}
