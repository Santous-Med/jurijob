import React from 'react';

const HEIGHTS = {
  compact: 24,
  header: 32,
  large: 56,
  hero: 96
};

export default function Logo({ variant = 'dark', size = 'header', style = {} }) {
  const height = HEIGHTS[size] || HEIGHTS.header;
  const src = variant === 'light'
    ? '/logo-jurijob-light.png'
    : '/logo-jurijob-dark.png';
  
  return (
    <img
      src={src}
      alt="JURIJOB"
      style={{
        height: `${height}px`,
        width: 'auto',
        display: 'block',
        objectFit: 'contain',
        ...style
      }}
    />
  );
}