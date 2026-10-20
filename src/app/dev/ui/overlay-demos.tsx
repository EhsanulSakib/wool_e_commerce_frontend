'use client';

import {
  ChevronDown,
  Heart,
  Info,
  LogOut,
  Package,
  Settings,
  User,
} from 'lucide-react';
import { useRef, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  Button,
  Carousel,
  Drawer,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  FormField,
  Icon,
  IconButton,
  Input,
  Modal,
  Popover,
  RatingInput,
  SwatchGroup,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  toast,
  Tooltip,
} from '@/components/ui';
import { useDisclosure } from '@/hooks/useDisclosure';

/* Interactive demos for module 08 on /dev/ui. */

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

export function OverlaysDemo() {
  const modal = useDisclosure();
  const confirm = useDisclosure();
  const [drawerSide, setDrawerSide] = useState<
    'left' | 'right' | 'bottom' | null
  >(null);
  const [sort, setSort] = useState('Newest');

  return (
    <div className="grid gap-6">
      <Row label="Modal">
        <Button onClick={modal.onOpen}>Open size guide</Button>
        <Button variant="outline" onClick={confirm.onOpen}>
          Open confirm (small)
        </Button>
      </Row>
      <Modal
        open={modal.open}
        onClose={modal.onClose}
        title="Size guide"
        description="Measurements in centimetres. Between sizes? Size up for a relaxed fit."
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={modal.onClose}>
              Close
            </Button>
            <Button
              onClick={() => {
                modal.onClose();
                toast.success('Size saved', {
                  description: 'We’ll remember M for you.',
                });
              }}
            >
              Save my size
            </Button>
          </div>
        }
      >
        <table className="w-full text-left text-small">
          <thead className="text-muted-fg">
            <tr>
              {['Size', 'Chest', 'Length', 'Sleeve'].map((h) => (
                <th key={h} className="py-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['S', 96, 66, 60],
              ['M', 102, 68, 62],
              ['L', 108, 70, 64],
              ['XL', 114, 72, 66],
            ].map((row) => (
              <tr key={row[0]} className="border-t border-border">
                {row.map((cell, i) => (
                  <td key={i} className="py-2 tabular-nums">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-6 grid gap-4">
          <FormField
            label="Your chest (cm)"
            hint="Focus starts on the first field; Tab cycles inside."
          >
            <Input inputMode="numeric" placeholder="e.g. 100" />
          </FormField>
          {/* Long content: the body scrolls, the page behind doesn't. */}
          {Array.from({ length: 6 }, (_, i) => (
            <p key={i} className="text-small text-muted-fg">
              Wool relaxes slightly with wear. Hand wash cold, dry flat, and it
              keeps its shape for years. Paragraph {i + 1}.
            </p>
          ))}
        </div>
      </Modal>
      <Modal
        open={confirm.open}
        onClose={confirm.onClose}
        title="Remove this item?"
        description="Merino crew neck, Charcoal / M"
        size="sm"
      >
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={confirm.onClose}>
            Keep it
          </Button>
          <Button
            onClick={() => {
              confirm.onClose();
              toast.info('Item removed', {
                action: {
                  label: 'Undo',
                  onClick: () => toast.success('Item restored'),
                },
              });
            }}
          >
            Remove
          </Button>
        </div>
      </Modal>

      <Row label="Drawer">
        {(['right', 'left', 'bottom'] as const).map((side) => (
          <Button
            key={side}
            variant="outline"
            onClick={() => setDrawerSide(side)}
          >
            From the {side}
          </Button>
        ))}
      </Row>
      <Drawer
        open={drawerSide !== null}
        side={drawerSide ?? 'right'}
        onClose={() => setDrawerSide(null)}
        title={
          drawerSide === 'left'
            ? 'Menu'
            : drawerSide === 'bottom'
              ? 'Filters'
              : 'Your cart'
        }
        footer={
          <Button fullWidth onClick={() => setDrawerSide(null)}>
            {drawerSide === 'bottom' ? 'Show 24 products' : 'Checkout'}
          </Button>
        }
      >
        <ul className="grid gap-3">
          {Array.from({ length: 12 }, (_, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-md bg-muted px-4 py-3 text-small"
            >
              Item {i + 1}
              <Button variant="link" size="sm">
                Action
              </Button>
            </li>
          ))}
        </ul>
      </Drawer>

      <Row label={`DropdownMenu · sort: ${sort}`}>
        <DropdownMenu
          trigger={
            <Button
              variant="outline"
              iconRight={<Icon icon={ChevronDown} size="sm" />}
            >
              Sort: {sort}
            </Button>
          }
        >
          {[
            'Newest',
            'Price: low to high',
            'Price: high to low',
            'Best rated',
          ].map((option) => (
            <DropdownMenuItem key={option} onSelect={() => setSort(option)}>
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenu>
        <DropdownMenu
          align="end"
          trigger={
            <IconButton aria-label="Account menu" variant="outline">
              <Icon icon={User} />
            </IconButton>
          }
        >
          <DropdownMenuLabel>Sakib Hasan</DropdownMenuLabel>
          <DropdownMenuItem
            href="/dev/ui#tabs"
            icon={<Icon icon={Package} size="sm" />}
          >
            Orders
          </DropdownMenuItem>
          <DropdownMenuItem
            icon={<Icon icon={Heart} size="sm" />}
            onSelect={() => toast('Wishlist')}
          >
            Wishlist
          </DropdownMenuItem>
          <DropdownMenuItem icon={<Icon icon={Settings} size="sm" />} disabled>
            Settings (disabled)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            icon={<Icon icon={LogOut} size="sm" />}
            onSelect={() => toast('Signed out')}
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenu>
      </Row>

      <Row label="Popover · Tooltip (hover or Tab to the buttons; try them at the screen edge)">
        <Popover
          label="Delivery"
          trigger={
            <Button variant="outline" iconLeft={<Icon icon={Info} size="sm" />}>
              Delivery info
            </Button>
          }
        >
          <p className="font-medium">Delivery</p>
          <p className="mt-1 text-muted-fg">
            Inside Dhaka 1–2 days (৳60). Outside Dhaka 2–4 days (৳120). Free
            over ৳3,000.
          </p>
          <Button variant="link" size="sm" className="mt-2">
            Shipping policy
          </Button>
        </Popover>
        <Tooltip content="Add to wishlist">
          <IconButton aria-label="Add to wishlist" variant="outline">
            <Icon icon={Heart} />
          </IconButton>
        </Tooltip>
        <Tooltip content="Opens below when there's no room above" side="top">
          <Button variant="ghost">Tooltip (top, flips)</Button>
        </Tooltip>
      </Row>
    </div>
  );
}

export function ToastDemo() {
  const count = useRef(0);
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        onClick={() =>
          toast.success('Added to cart', {
            description: 'Merino crew neck, Charcoal / M',
          })
        }
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error('Payment failed', {
            description: 'Your card was declined.',
            action: { label: 'Try again', onClick: () => toast('Retrying…') },
          })
        }
      >
        Error + action
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning('Only 2 left in stock')}
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.info('Item removed', {
            action: {
              label: 'Undo',
              onClick: () => toast.success('Item restored'),
            },
          })
        }
      >
        Info + Undo
      </Button>
      <Button
        onClick={() => {
          for (let i = 0; i < 4; i++)
            toast(`Toast ${++count.current} of a burst`, {
              description: 'Max 3 on screen; the 4th waits.',
            });
        }}
      >
        Fire 4 at once
      </Button>
      <Button variant="ghost" onClick={() => toast.dismiss()}>
        Dismiss all
      </Button>
    </div>
  );
}

export function TabsDemo() {
  return (
    <Tabs defaultValue="details" label="Product information">
      <TabList>
        <Tab value="details">Details</Tab>
        <Tab value="care">Material & care</Tab>
        <Tab value="shipping">Shipping & returns</Tab>
        <Tab value="reviews" disabled>
          Reviews (soon)
        </Tab>
      </TabList>
      <TabPanel value="details">
        <p className="text-small text-muted-fg">
          A classic crew neck knitted from extra-fine merino. Ribbed cuffs and
          hem, relaxed fit.
        </p>
      </TabPanel>
      <TabPanel value="care">
        <p className="text-small text-muted-fg">
          100% merino wool. Hand wash cold, dry flat, do not tumble dry.
        </p>
      </TabPanel>
      <TabPanel value="shipping">
        <p className="text-small text-muted-fg">
          Free delivery over ৳3,000. Returns within 7 days, unworn.
        </p>
      </TabPanel>
    </Tabs>
  );
}

export function AccordionDemo() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <p className="mb-2 text-caption text-muted-fg">
          type=&quot;single&quot;
        </p>
        <Accordion defaultValue={['fit']}>
          <AccordionItem value="fit" title="How does it fit?">
            True to size with a relaxed body. Size down for a closer fit.
          </AccordionItem>
          <AccordionItem value="itch" title="Is merino itchy?">
            Extra-fine merino (under 19 microns) is soft enough to wear next to
            the skin.
          </AccordionItem>
          <AccordionItem value="pill" title="Will it pill?">
            A little, early on, like all natural wool. A sweater comb removes
            it.
          </AccordionItem>
        </Accordion>
      </div>
      <div>
        <p className="mb-2 text-caption text-muted-fg">
          type=&quot;multiple&quot;
        </p>
        <Accordion type="multiple" defaultValue={['a', 'b']}>
          <AccordionItem value="a" title="Cash on Delivery">
            Available across Bangladesh for Taka orders. An agent calls to
            confirm.
          </AccordionItem>
          <AccordionItem value="b" title="bKash & Nagad">
            Pay online in Taka through SSLCommerz.
          </AccordionItem>
          <AccordionItem value="c" title="Cards">
            Visa, Mastercard and Amex, in Taka or USD.
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

const knit =
  'bg-muted bg-[repeating-linear-gradient(45deg,var(--border)_0_2px,transparent_2px_14px),repeating-linear-gradient(-45deg,var(--border)_0_2px,transparent_2px_14px)]';

export function CarouselDemo() {
  return (
    <div className="grid gap-10">
      <Carousel
        label="New arrivals"
        slideClassName="basis-4/5 sm:basis-1/2 lg:basis-1/3"
      >
        {[
          'Merino crew',
          'Cable cardigan',
          'Lambswool scarf',
          'Ribbed beanie',
          'Alpaca throw',
          'Wool socks',
        ].map((name) => (
          <a
            key={name}
            href="#carousel"
            className="relative isolate grid aspect-4/5 place-items-end rounded-lg p-4"
          >
            <span className={`absolute inset-0 -z-10 rounded-lg ${knit}`} />
            <span className="rounded-sm bg-bg px-2 py-1 text-small font-medium">
              {name}
            </span>
          </a>
        ))}
      </Carousel>
      <Carousel label="Gallery" showDots>
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={`grid aspect-video place-items-center rounded-lg text-h3 ${knit}`}
          >
            {n}
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export function RatingInputDemo() {
  const [value, setValue] = useState(0);
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <RatingInput
        label="Your rating"
        value={value}
        onValueChange={setValue}
        required
      />
      <RatingInput label="With an error" error="Please choose a rating." />
    </div>
  );
}

export function SwatchGroupDemo() {
  return (
    <SwatchGroup
      label="Color"
      defaultValue="charcoal"
      options={[
        { value: 'charcoal', label: 'Charcoal', color: '#36454F' },
        { value: 'cream', label: 'Cream', color: '#F3EBDD' },
        { value: 'camel', label: 'Camel', color: '#B5895B' },
        { value: 'forest', label: 'Forest', color: '#2F4A3A', soldOut: true },
        { value: 'black', label: 'Black', color: '#0A0A0A' },
      ]}
    />
  );
}
