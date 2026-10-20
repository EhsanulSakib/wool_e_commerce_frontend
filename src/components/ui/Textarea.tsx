'use client';

import { useLayoutEffect, useRef, type ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { fieldBox, fieldControl, useFieldProps } from './field-context';

/*
 * Grows with its content between `minRows` and `maxRows`, then scrolls.
 * Uses CSS `field-sizing: content` where supported (Chromium, Safari 26+);
 * elsewhere (Firefox) a small script sets the height on input.
 */

export interface TextareaProps extends ComponentProps<'textarea'> {
  minRows?: number;
  maxRows?: number;
  boxClassName?: string;
}

const LINE = 1.5; // matches leading-normal below (em)

const supportsFieldSizing = () =>
  typeof CSS !== 'undefined' && CSS.supports('field-sizing', 'content');

function fitHeight(el: HTMLTextAreaElement) {
  if (supportsFieldSizing()) return;
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight}px`;
}

export function Textarea({
  minRows = 3,
  maxRows = 10,
  boxClassName,
  className,
  style,
  onInput,
  ref,
  ...props
}: TextareaProps) {
  const { invalid, ...textareaProps } = useFieldProps(props);
  const innerRef = useRef<HTMLTextAreaElement | null>(null);

  // Initial height for pre-filled values (fallback path only).
  useLayoutEffect(() => {
    if (innerRef.current) fitHeight(innerRef.current);
  }, []);

  function handleInput(
    event: Parameters<NonNullable<TextareaProps['onInput']>>[0],
  ) {
    fitHeight(event.currentTarget);
    onInput?.(event);
  }

  return (
    <div
      className={fieldBox({
        state: invalid ? 'invalid' : 'default',
        className: cn('h-auto items-stretch py-2.5', boxClassName),
      })}
    >
      <textarea
        ref={(el) => {
          innerRef.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
        }}
        rows={minRows}
        onInput={handleInput}
        className={cn(
          fieldControl,
          'field-sizing-content resize-none leading-normal',
          className,
        )}
        style={{
          minHeight: `${minRows * LINE}em`,
          maxHeight: `${maxRows * LINE}em`,
          ...style,
        }}
        {...textareaProps}
      />
    </div>
  );
}
