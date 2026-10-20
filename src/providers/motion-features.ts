// Loaded lazily by MotionProvider (its own chunk, not in the initial bundle).
// domMax = domAnimation + layout animations (layout / layoutId: the tabs
// indicator, the toast stack reflowing when one leaves) + drag. Layout
// animations still only animate transform (FLIP).
import { domMax } from 'motion/react';

export default domMax;
