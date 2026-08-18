import React from 'react';

interface MapEmbedProps {
  /** Map embed iframe source or coordinates */
  src?: string;
  title?: string;
  className?: string;
}

/**
 * Reusable Google Map Embed component
 */
export const MapEmbed: React.FC<MapEmbedProps> = ({
  src = 'https://maps.google.com/maps?q=30.9138122,75.8714897&t=&z=17&ie=UTF8&iwloc=&output=embed',
  title = 'Ved Enterprises Head Office — Ludhiana',
  className = 'w-full h-full border-0',
}) => {
  return (
    <iframe
      title={title}
      src={src}
      className={className}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
};

export default MapEmbed;
