export interface RoomConfig {
  id: string
  label: string
  wallColor: string
  wallPattern?: string
  floorColor: string
  accentColor: string
  catSlug?: string
}

export const ROOMS: RoomConfig[] = [
  {
    id: 'welcome',
    label: 'Linh & Catsu',
    wallColor: '#fde8f0',
    wallPattern: 'dots',
    floorColor: '#f5dfc8',
    accentColor: '#f9c6d0',
  },
  {
    id: 'rua',
    label: "Rua's Room",
    wallColor: '#fff8e0',
    wallPattern: 'stripes',
    floorColor: '#edd5a8',
    accentColor: '#f5c842',
    catSlug: 'rua',
  },
  {
    id: 'ri',
    label: "Ri's Room",
    wallColor: '#eceaf8',
    wallPattern: 'grid',
    floorColor: '#d4cce8',
    accentColor: '#b8b8d4',
    catSlug: 'ri',
  },
  {
    id: 'bigga',
    label: "Bigga's Room",
    wallColor: '#eef5ee',
    wallPattern: 'dots',
    floorColor: '#c8d8c0',
    accentColor: '#c4956a',
    catSlug: 'bigga',
  },
  {
    id: 'together',
    label: 'Together',
    wallColor: '#fdf0f8',
    wallPattern: 'stars',
    floorColor: '#f0d8ec',
    accentColor: '#d5c8f0',
  },
]
