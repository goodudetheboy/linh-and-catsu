export type CatColorScheme = 'orange' | 'grey' | 'tabby'

export interface Cat {
  id:          string
  slug:        string
  name:        string
  ageYears:    number
  colorDesc:   string
  roomOrder:   number
  accentColor: string
  colorScheme: CatColorScheme  // which sticker image to use
  displaySize: number          // scale multiplier for the Cat component
}

export const CATS: Cat[] = [
  {
    id:          'rua',
    slug:        'rua',
    name:        'Rua',
    ageYears:    5,
    colorDesc:   'orange tabby',
    roomOrder:   2,
    accentColor: '#f5c842',
    colorScheme: 'orange',
    displaySize: 1.00,
  },
  {
    id:          'ri',
    slug:        'ri',
    name:        'Ri',
    ageYears:    1.5,
    colorDesc:   'grey',
    roomOrder:   3,
    accentColor: '#b8b8d4',
    colorScheme: 'grey',
    displaySize: 0.70,
  },
  {
    id:          'bigga',
    slug:        'bigga',
    name:        'Bigga',
    ageYears:    2.5,
    colorDesc:   'grey/brown tabby',
    roomOrder:   4,
    accentColor: '#c4956a',
    colorScheme: 'tabby',
    displaySize: 1.15,
  },
]

export const getCatBySlug = (slug: string) =>
  CATS.find((c) => c.slug === slug) ?? null
