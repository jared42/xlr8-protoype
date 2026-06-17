export type Category = 'Peptides' | 'Nootropics' | 'Supplies';

export interface Product {
  id: string;
  name: string;
  spec: string;
  price: number;
  cat: Category;
  tag?: string;
  storeSlug?: string; // for per-product deep links when ready
}

export const PRODUCTS: Product[] = [
  { id: 'reta',   name: 'Retatrutide',        spec: '30mg',       price: 249.99, cat: 'Peptides',   tag: 'Top seller' },
  { id: 'tesa',   name: 'Tesamorelin',         spec: '20mg',       price: 109.99, cat: 'Peptides',   tag: 'Featured' },
  { id: 'bpc',    name: 'BPC-157',             spec: '10mg',       price:  59.99, cat: 'Peptides' },
  { id: 'cjc10',  name: 'CJC-1295 no DAC',     spec: '10mg',       price: 109.99, cat: 'Peptides' },
  { id: 'cjcipa', name: 'CJC-1295 / IPA',      spec: '5mg / 5mg',  price:  99.99, cat: 'Peptides' },
  { id: 'cjcdac', name: 'CJC-1295 w/ DAC',     spec: '5mg',        price:  89.99, cat: 'Peptides' },
  { id: 'ghk',    name: 'GHK-Cu',              spec: '100mg',      price:  59.99, cat: 'Peptides' },
  { id: 'epi',    name: 'Epitalon',            spec: '50mg',       price:  59.99, cat: 'Peptides' },
  { id: 'dsip',   name: 'DSIP',               spec: '10mg',       price:  49.99, cat: 'Peptides' },
  { id: 'ara',    name: 'ARA-290',             spec: '10mg',       price:  49.99, cat: 'Peptides' },
  { id: 'aod',    name: 'AOD-9604',            spec: '10mg',       price:  99.99, cat: 'Peptides' },
  { id: 'fox',    name: 'FOX-04',              spec: '10mg',       price: 149.99, cat: 'Peptides' },
  { id: 'amq',    name: '5-Amino-1MQ',         spec: '50mg',       price:  99.99, cat: 'Nootropics' },
  { id: 'bac',    name: 'BAC Water',           spec: '3ml',        price:   9.99, cat: 'Supplies',  tag: 'Free for members' },
];

export const CAT_COLOR: Record<Category, string> = {
  Peptides:   '#36D1C4',
  Nootropics: '#FFC857',
  Supplies:   '#8B96A0',
};

export const MEMBER_RATE = 0.15;

export const memberPrice = (retail: number) => retail * (1 - MEMBER_RATE);
export const money = (n: number) => `$${n.toFixed(2)}`;

export const STORE_URL = 'https://xlr8research.com/shop'; // replace with live URL
export const storeUrl = (p: Product) =>
  p.storeSlug ? `${STORE_URL}/product/${p.storeSlug}` : STORE_URL;
