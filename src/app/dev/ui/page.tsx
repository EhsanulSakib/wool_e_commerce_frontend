import {
  ArrowRight,
  Bell,
  Heart,
  Search,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import type { Metadata } from 'next';
import {
  Badge,
  Button,
  Divider,
  Icon,
  IconButton,
  NotificationDot,
  Skeleton,
  Spinner,
  Stack,
  type BadgeTone,
} from '@/components/ui';
import {
  ControlsDemo,
  FormDemo,
  InputsDemo,
  LoadingButtonDemo,
  StepperDemo,
} from './demos';

/*
 * Component playground (module 06): every component in every variant and
 * state, light and dark side by side. A nested data-theme switches the
 * tokens for one panel only. Dev pages 404 in production (see ../layout.tsx).
 */

export const metadata: Metadata = { title: 'UI components' };

const variants = ['primary', 'secondary', 'outline', 'ghost', 'link'] as const;
const tones: BadgeTone[] = [
  'neutral',
  'new',
  'success',
  'warning',
  'sale',
  'info',
];

/** Renders `children` twice: once in a light panel, once in a dark one. */
function Panels({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {(['light', 'dark'] as const).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          className="min-w-0 rounded-xl border border-border bg-bg p-5 text-fg md:p-6"
        >
          <p className="mb-4 text-caption text-muted-fg uppercase">{theme}</p>
          {children}
        </div>
      ))}
    </div>
  );
}

function Demo({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="border-t border-border py-10">
      <h2 id={id} className="text-h4">
        {title}
      </h2>
      {note && <p className="mt-1 mb-5 text-small text-muted-fg">{note}</p>}
      <div className={note ? '' : 'mt-5'}>
        <Panels>{children}</Panels>
      </div>
    </section>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <p className="text-caption text-muted-fg">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export default function UiPage() {
  return (
    <>
      <header className="pb-10">
        <p className="text-caption text-muted-fg uppercase">Module 06</p>
        <h1 className="text-h1">UI components</h1>
        <p className="mt-4 max-w-prose text-body-lg text-muted-fg">
          Every primitive in <code>src/components/ui</code>, in light and dark.
          Use Tab to check focus order and rings.
        </p>
      </header>

      <Demo id="buttons" title="Button">
        <Stack gap={6}>
          <Row label="Variants">
            {variants.map((v) => (
              <Button key={v} variant={v}>
                {v[0].toUpperCase() + v.slice(1)}
              </Button>
            ))}
          </Row>
          <Row label="Sizes">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </Row>
          <Row label="Icons">
            <Button iconLeft={<Icon icon={ShoppingBag} size="sm" />}>
              Add to cart
            </Button>
            <Button
              variant="outline"
              iconRight={<Icon icon={ArrowRight} size="sm" />}
            >
              Continue
            </Button>
            <Button variant="ghost" iconLeft={<Icon icon={Trash2} size="sm" />}>
              Remove
            </Button>
          </Row>
          <Row label="Loading (click: ignored while busy)">
            <LoadingButtonDemo />
          </Row>
          <Row label="Disabled">
            {variants.slice(0, 4).map((v) => (
              <Button key={v} variant={v} disabled>
                Disabled
              </Button>
            ))}
          </Row>
          <Row label="As a link (renders <a>)">
            <Button href="/dev/tokens" variant="outline">
              Go to tokens
            </Button>
            <Button href="/dev/fonts" variant="link">
              Font pairings
            </Button>
          </Row>
          <Button fullWidth size="lg">
            Full width
          </Button>
        </Stack>
      </Demo>

      <Demo
        id="icon-buttons"
        title="IconButton & NotificationDot"
        note="aria-label is required by the type. Counts go in the label (“Cart, 3 items”); the dot itself is hidden from screen readers."
      >
        <Stack gap={6}>
          <Row label="Variants">
            <IconButton aria-label="Add to wishlist" variant="primary">
              <Icon icon={Heart} />
            </IconButton>
            <IconButton aria-label="Add to wishlist" variant="secondary">
              <Icon icon={Heart} />
            </IconButton>
            <IconButton aria-label="Add to wishlist" variant="outline">
              <Icon icon={Heart} />
            </IconButton>
            <IconButton aria-label="Add to wishlist">
              <Icon icon={Heart} />
            </IconButton>
            <IconButton aria-label="Search" disabled>
              <Icon icon={Search} />
            </IconButton>
          </Row>
          <Row label="Sizes">
            <IconButton aria-label="Search" size="sm" variant="outline">
              <Icon icon={Search} size="sm" />
            </IconButton>
            <IconButton aria-label="Search" variant="outline">
              <Icon icon={Search} />
            </IconButton>
            <IconButton aria-label="Search" size="lg" variant="outline">
              <Icon icon={Search} size="lg" />
            </IconButton>
          </Row>
          <Row label="With NotificationDot: 3 · 12 (max 9) · dot · 0 (hidden)">
            {[3, 12, undefined, 0].map((count, i) => (
              <span key={i} className="relative inline-flex">
                <IconButton
                  aria-label={
                    count === undefined
                      ? 'Notifications, new'
                      : `Cart, ${count} items`
                  }
                >
                  <Icon icon={count === undefined ? Bell : ShoppingBag} />
                </IconButton>
                <NotificationDot
                  count={count}
                  className={
                    count === undefined
                      ? 'absolute top-2.5 right-2.5'
                      : 'absolute top-1 right-0.5'
                  }
                />
              </span>
            ))}
          </Row>
        </Stack>
      </Demo>

      <Demo id="badges" title="Badge">
        <Stack gap={6}>
          {(['solid', 'soft', 'outline'] as const).map((appearance) => (
            <Row key={appearance} label={appearance}>
              {tones.map((tone) => (
                <Badge key={tone} tone={tone} appearance={appearance}>
                  {tone === 'sale' ? '−20%' : tone}
                </Badge>
              ))}
            </Row>
          ))}
          <Row label="Status pills (soft + dot + pill), small size">
            <Badge tone="warning" appearance="soft" dot pill>
              Pending
            </Badge>
            <Badge tone="info" appearance="soft" dot pill>
              Shipped
            </Badge>
            <Badge tone="success" appearance="soft" dot pill>
              Delivered
            </Badge>
            <Badge tone="danger" appearance="soft" dot pill>
              Cancelled
            </Badge>
            <Badge size="sm">Sold out</Badge>
            <Badge size="sm" tone="new">
              New
            </Badge>
          </Row>
        </Stack>
      </Demo>

      <Demo
        id="loading"
        title="Spinner & Skeleton"
        note="The spinner keeps turning with reduced motion (it's the message); the skeleton shimmer stops."
      >
        <Stack gap={6}>
          <Row label="Spinner sm · md · lg · inside text">
            <Spinner size="sm" />
            <Spinner />
            <Spinner size="lg" />
            <span className="inline-flex items-center gap-2 text-small text-muted-fg">
              <Spinner size="sm" label={null} /> Loading products…
            </span>
          </Row>
          <div role="status" aria-busy="true" className="grid max-w-xs gap-3">
            <span className="sr-only">Loading product</span>
            <Skeleton className="aspect-4/5 w-full" />
            <Skeleton shape="text" className="w-3/4 text-body" />
            <Skeleton shape="text" className="w-1/3 text-small" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton shape="circle" className="size-12" />
            <Skeleton shape="text" lines={3} className="flex-1 text-small" />
          </div>
        </Stack>
      </Demo>

      <Demo
        id="icons"
        title="Icon"
        note="lucide-react, 1.75 stroke. Sizes xs 14 · sm 16 · md 20 · lg 24 · xl 32."
      >
        <Row label="xs · sm · md · lg · xl">
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
            <Icon key={s} icon={Heart} size={s} />
          ))}
          <Icon
            icon={Heart}
            size="lg"
            label="Favorite"
            className="text-danger"
          />
        </Row>
      </Demo>

      <Demo
        id="layout"
        title="Stack & Divider"
        note="Container (max-w-page + gutter) and Section (py-section) wrap whole pages; this page itself uses them."
      >
        <Stack gap={4}>
          <Stack direction="row" gap={2}>
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="grid size-12 place-items-center rounded-md bg-muted text-small"
              >
                {n}
              </div>
            ))}
          </Stack>
          <Divider />
          <Divider label="or" />
          <Stack direction="row" gap={4} align="center" className="h-8">
            <span className="text-small">Left</span>
            <Divider orientation="vertical" />
            <span className="text-small">Right</span>
          </Stack>
        </Stack>
      </Demo>

      <Demo
        id="inputs"
        title="Input, PasswordInput, Select, Textarea (in FormField)"
      >
        <InputsDemo />
      </Demo>

      <Demo
        id="controls"
        title="Checkbox, Switch, RadioGroup"
        note="Arrow keys move inside a radio group; Space toggles checkboxes and switches."
      >
        <ControlsDemo />
      </Demo>

      <Demo
        id="stepper"
        title="QuantityStepper"
        note="Type a number and press Enter or Tab: it's clamped to min…max. ↑/↓ step, Home/End jump."
      >
        <StepperDemo />
      </Demo>

      <Demo
        id="form"
        title="Form with validation"
        note="Submit empty to see errors. Each error is linked to its field with aria-describedby."
      >
        <FormDemo />
      </Demo>
    </>
  );
}
