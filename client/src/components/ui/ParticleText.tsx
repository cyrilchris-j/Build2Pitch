import * as React from 'react';

export interface ParticleTextProps {
  text?: string;
  className?: string;
  textClassName?: string;
  delayMs?: number;
  pauseMs?: number;
}

/**
 * Particle Text
 * Character-by-character reveal with spring-loaded entrance per glyph.
 */
export function ParticleText({
  text = 'Build2Pitch',
  className = '',
  textClassName = '',
  delayMs = 75,
  pauseMs = 2500,
}: ParticleTextProps): React.JSX.Element {
  const [chars, setChars] = React.useState(0);
  const [loop, setLoop] = React.useState(0);

  React.useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setChars(i);
      if (i >= text.length) {
        clearInterval(id);
        setTimeout(() => {
          setChars(0);
          setLoop((l) => l + 1);
        }, pauseMs);
      }
    }, delayMs);
    return () => clearInterval(id);
  }, [text, delayMs, pauseMs, loop]);

  return (
    <div className={`select-none font-display font-black inline-flex items-center justify-center ${className}`}>
      <span className={`tracking-tight ${textClassName}`}>
        {text.split('').map((c, i) => {
          let glyphClass = '';
          if (text.toLowerCase() === 'build2pitch') {
            const isBuild = i < 5; // "Build"
            const isTwo = c === '2';
            glyphClass = isTwo
              ? 'text-primary filter drop-shadow-[0_0_24px_rgba(0,210,255,0.9)]'
              : isBuild
              ? 'gradient-text'
              : 'text-foreground';
          } else {
            glyphClass = textClassName || 'text-foreground';
          }

          return (
            <span
              key={i}
              className={glyphClass}
              style={{
                display: 'inline-block',
                opacity: i < chars ? 1 : 0,
                transform: i < chars ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.8)',
                transition: `opacity 0.25s ${i * 0.02}s, transform 0.35s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.02}s`,
              }}
            >
              {c === ' ' ? '\u00A0' : c}
            </span>
          );
        })}
      </span>
      <span className="inline-block w-1 sm:w-1.5 md:w-2.5 h-10 sm:h-16 md:h-20 lg:h-24 bg-primary align-middle ml-2 sm:ml-3 animate-pulse rounded-full shadow-[0_0_18px_rgba(0,210,255,0.9)]" />
    </div>
  );
}
