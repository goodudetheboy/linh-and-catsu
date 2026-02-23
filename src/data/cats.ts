export interface Cat {
  id: string
  slug: string
  name: string
  ageYears: number
  colorDesc: string
  roomOrder: number
  accentColor: string
}

export const CATS: Cat[] = [
  {
    id: 'rua',
    slug: 'rua',
    name: 'Rua',
    ageYears: 5,
    colorDesc: 'orange tabby',
    roomOrder: 2,
    accentColor: '#f5c842',
  },
  {
    id: 'ri',
    slug: 'ri',
    name: 'RI',
    ageYears: 1.5,
    colorDesc: 'grey',
    roomOrder: 3,
    accentColor: '#b8b8d4',
  },
  {
    id: 'bigga',
    slug: 'bigga',
    name: 'Bigga',
    ageYears: 2.5,
    colorDesc: 'grey/brown tabby',
    roomOrder: 4,
    accentColor: '#c4956a',
  },
]

export const getCatBySlug = (slug: string) =>
  CATS.find((c) => c.slug === slug) ?? null
