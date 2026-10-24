import { useEffect, useRef } from 'react';

// FR-016 / FR-017: OpenStreetMap map with one marker. Leaflet comes from the CDN in index.html.
export default function MapView({ place }) {
  const box = useRef(null);

  useEffect(() => {
    const map = L.map(box.current, { scrollWheelZoom: false }).setView([place.lat, place.lng], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.marker([place.lat, place.lng]).addTo(map);

    return () => map.remove(); // clean up when the modal closes
  }, [place]);

  return <div ref={box} className="h-64 w-full rounded-xl border border-sand-200 shadow-sm" />;
}
