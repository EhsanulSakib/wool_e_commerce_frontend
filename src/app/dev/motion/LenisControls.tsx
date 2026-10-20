'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useLenis, useLenisControls } from '@/providers/smooth-scroll-provider';

/** Test buttons for /dev/motion: lock/unlock and programmatic scrolling. */
export function LenisControls() {
  const lenis = useLenis();
  const { stop, start, scrollTo } = useLenisControls();
  const [locked, setLocked] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (locked) start();
          else stop();
          setLocked(!locked);
        }}
        aria-pressed={locked}
      >
        {locked ? 'start() — unlock scrolling' : 'stop() — lock scrolling'}
      </Button>
      <Button variant="outline" size="sm" onClick={() => scrollTo('#countup')}>
        scrollTo(&quot;#countup&quot;)
      </Button>
      <Button variant="ghost" size="sm" onClick={() => scrollTo(0)}>
        scrollTo(0)
      </Button>
      <span className="text-small text-muted-fg" aria-live="polite">
        Smooth scrolling: {lenis ? 'on (Lenis)' : 'off (native)'}
        {locked && ' · locked'}
      </span>
    </div>
  );
}
