'use client';

import { useState } from 'react';
import { deterministicImage } from '@/lib/images';

export default function SmartImage({
  src,
  alt,
  category,
  seed,
  className,
}: {
  src?: string;
  alt: string;
  category?: string;
  seed?: string;
  className?: string;
}) {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src || deterministicImage(category, seed || alt));

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setCurrentSrc(deterministicImage(category, seed || alt))}
    />
  );
}
