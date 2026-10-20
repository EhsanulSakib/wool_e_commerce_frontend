// Mock cart lines for the cart drawer shell (module 30 replaces them with the
// real cart). Kept apart from CartDrawer so the navbar's badge can use them
// without loading the drawer's code.

export interface MockCartLine {
  id: string;
  name: string;
  variant: string;
  color: string;
  price: number;
  compareAt?: number;
  quantity: number;
  stock: number;
}

export const mockCartLines: MockCartLine[] = [
  {
    id: 'merino-crew-charcoal-m',
    name: 'Merino crew neck',
    variant: 'Charcoal / M',
    color: '#36454F',
    price: 1800,
    compareAt: 2400,
    quantity: 1,
    stock: 5,
  },
  {
    id: 'ribbed-beanie-cream',
    name: 'Ribbed beanie',
    variant: 'Cream / One size',
    color: '#F3EBDD',
    price: 650,
    quantity: 1,
    stock: 12,
  },
];
