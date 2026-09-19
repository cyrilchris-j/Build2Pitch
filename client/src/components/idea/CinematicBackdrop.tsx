import { useMemo } from 'react';
import { motion } from 'framer-motion';

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface Dust {
  id: number;
  left: number;
  top: number;
  size: number;
  drift: number;
  delay: number;
  duration: number;
  red: boolean;
}

export default function CinematicBackdrop() {
  const dust = useMemo<Dust[]>(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: rand(2, 98),
        top: rand(4, 92),
        size: rand(1, 4),
        drift: rand(8, 22),
        delay: rand(0, 6),
        duration: rand(9, 20),
        red: Math.random() > 0.35,
      })),
    []
  );

  return (
    <>
      <div className="metal-sheen" />
      <div className="vinette" />
      {dust.map((d) => (
        <motion.span
          key={d.id}
          className="dust"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            background: d.red
              ? 'radial-gradient(circle, rgba(255,110,125,0.9), rgba(230,57,70,0) 70%)'
              : 'radial-gradient(circle, rgba(230,235,245,0.7), rgba(255,255,255,0) 70%)',
          }}
          animate={{ y: [0, -d.drift, 0], x: [0, d.drift / 2, 0], opacity: [0, 0.9, 0] }}
          transition={{
            duration: d.duration,
            repeat: Infinity,
            delay: d.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  );
}