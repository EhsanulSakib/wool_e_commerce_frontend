import { cn } from './cn';

/**
 * Tiny variant helper (like `cva`, without the dependency): maps props such
 * as `variant` and `size` to class strings, with defaults.
 *
 *   const button = variants({
 *     base: 'inline-flex items-center',
 *     variants: { size: { sm: 'h-9', md: 'h-11' } },
 *     defaults: { size: 'md' },
 *   });
 *   button({ size: 'sm', className: 'w-full' }); // "inline-flex items-center h-9 w-full"
 *
 * Keep every class a full literal string so Tailwind can find it.
 */

type VariantMap = Record<string, Record<string, string>>;

type Selection<V extends VariantMap> = { [K in keyof V]?: keyof V[K] };

interface VariantsConfig<V extends VariantMap> {
  base?: string;
  variants: V;
  defaults: { [K in keyof V]: keyof V[K] };
}

export function variants<V extends VariantMap>(config: VariantsConfig<V>) {
  return (props: Selection<V> & { className?: string } = {}): string =>
    cn(
      config.base,
      Object.keys(config.variants).map((key) => {
        const value = props[key] ?? config.defaults[key];
        return config.variants[key][value as string];
      }),
      props.className,
    );
}

/** The variant props a `variants()` function accepts, for component types. */
export type VariantProps<
  T extends (props?: Record<string, unknown>) => string,
> = Omit<NonNullable<Parameters<T>[0]>, 'className'>;
