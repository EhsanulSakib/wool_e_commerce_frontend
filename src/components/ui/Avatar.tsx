'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/cn';

/*
 * User picture with an initials fallback (no picture, or it fails to load).
 *
 *   <Avatar name="Sakib Hasan" src={user.avatarUrl} />   → photo, or "SH"
 */

const sizes = {
  sm: { box: 'size-8 text-caption', px: 32 },
  md: { box: 'size-10 text-small', px: 40 },
  lg: { box: 'size-14 text-body', px: 56 },
} as const;

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export interface AvatarProps {
  name: string;
  src?: string | null;
  size?: keyof typeof sizes;
  className?: string;
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const s = sizes[size];
  const showImage = src && !failed;

  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary font-medium text-secondary-fg select-none',
        s.box,
        className,
      )}
    >
      {showImage ? (
        <Image
          src={src}
          alt={name}
          width={s.px}
          height={s.px}
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span role="img" aria-label={name}>
          <span aria-hidden="true">{initials(name)}</span>
        </span>
      )}
    </span>
  );
}
