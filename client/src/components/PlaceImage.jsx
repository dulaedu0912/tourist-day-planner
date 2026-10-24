import { useState } from 'react';
import { imageForPlace } from '../lib/images.js';

// Renders a place photo and hides itself if the file is missing, so the
// parent's gradient band shows through as the fallback.
export default function PlaceImage({ place, className = '', alt, priority = false, sizes }) {
  const image = imageForPlace(place);
  const [failed, setFailed] = useState(false);

  if (!image || failed) return null;

  return (
    <img
      src={image.src}
      alt={alt ?? image.alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  );
}
