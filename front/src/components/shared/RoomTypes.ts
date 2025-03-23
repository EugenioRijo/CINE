export interface RoomFeature {
  icon: string;
  text: string;
}

export interface DetailedFeature {
  icon: string;
  title: string;
  description: string;
}

export interface Room {
  id: string;
  name: string;
  type: string;
  price: string;
  capacity: number;
  description: string;
  features: RoomFeature[];
  detailedFeatures?: DetailedFeature[];
}

export const rooms: Record<string, Room> = {
  'sala-standard-1': {
    id: 'sala-standard-1',
    name: 'Sala 1',
    type: 'Standard',
    price: '$10',
    capacity: 120,
    description: 'Perfecta para disfrutar de películas con la mejor relación calidad-precio. Asientos cómodos y excelente calidad de imagen.',
    features: [
      { icon: '🎵', text: 'Sonido Dolby Digital' },
      { icon: '❄️', text: 'Aire Acondicionado' },
      { icon: '📺', text: 'Pantalla 4K' }
    ]
  },
  'sala-3d': {
    id: 'sala-3d',
    name: 'Sala 2',
    type: '3D',
    price: '$15',
    capacity: 120,
    description: 'Experiencia 3D inmersiva con la última tecnología. Incluye gafas 3D de alta calidad.',
    features: [
      { icon: '🎵', text: 'Sonido Dolby Digital' },
      { icon: '❄️', text: 'Aire Acondicionado' },
      { icon: '📺', text: 'Pantalla 4K' }
    ]
  },
  'sala-4dx': {
    id: 'sala-4dx',
    name: 'Sala 3',
    type: '4DX',
    price: '$20',
    capacity: 80,
    description: 'Experiencia cinematográfica con efectos multisensoriales. Movimiento sincronizado y efectos especiales.',
    features: [
      { icon: '🎵', text: 'Sonido Dolby Digital' },
      { icon: '❄️', text: 'Aire Acondicionado' },
      { icon: '📺', text: 'Pantalla 4K' }
    ]
  },
  'sala-screenx': {
    id: 'sala-screenx',
    name: 'Sala ScreenX',
    type: 'ScreenX',
    price: '$18',
    capacity: 100,
    description: 'Experiencia panorámica envolvente de 270 grados. Proyección lateral para máxima inmersión.',
    features: [
      { icon: '🎦', text: 'Pantalla 270°' },
      { icon: '🔊', text: 'Sonido Envolvente' },
      { icon: '📽️', text: 'Triple Proyección' }
    ]
  },
  'sala-vip': {
    id: 'sala-vip',
    name: 'Sala VIP Gold',
    type: 'VIP',
    price: '$25',
    capacity: 40,
    description: 'Máximo confort con servicio personalizado. Asientos reclinables y menú premium a la butaca.',
    features: [
      { icon: '🛋️', text: 'Asientos Reclinables' },
      { icon: '🍽️', text: 'Servicio a la Butaca' },
      { icon: '🍷', text: 'Menú Premium' }
    ],
    detailedFeatures: [
      {
        icon: '🛋️',
        title: 'Asientos Reclinables Premium',
        description: 'Butacas de cuero con reclinación total de 180° y reposapiés eléctrico'
      },
      {
        icon: '🍽️',
        title: 'Servicio a la Butaca',
        description: 'Menú gourmet exclusivo servido directamente en tu asiento'
      },
      {
        icon: '🎵',
        title: 'Sonido Personalizado',
        description: 'Sistema de audio individual con control de volumen en cada asiento'
      },
      {
        icon: '❄️',
        title: 'Clima Controlado',
        description: 'Control de temperatura individual por zona'
      }
    ]
  },
  'sala-imax': {
    id: 'sala-imax',
    name: 'Sala IMAX',
    type: 'IMAX',
    price: '$22',
    capacity: 200,
    description: 'La experiencia cinematográfica definitiva en formato IMAX. Pantalla gigante y sonido envolvente.',
    features: [
      { icon: '📽️', text: 'Proyección Láser' },
      { icon: '🎵', text: 'Sonido IMAX' },
      { icon: '🎬', text: 'Pantalla IMAX' }
    ],
    detailedFeatures: [
      {
        icon: '🎥',
        title: 'Pantalla Gigante',
        description: 'Pantalla curva de piso a techo con tecnología IMAX'
      },
      {
        icon: '📽️',
        title: 'Proyección Láser',
        description: 'Doble proyector láser 4K para máxima nitidez y brillo'
      },
      {
        icon: '🎧',
        title: 'Sonido IMAX',
        description: 'Sistema de sonido patentado con 12 canales independientes'
      },
      {
        icon: '👁️',
        title: 'Relación de Aspecto',
        description: 'Formato exclusivo 1.43:1 para máxima inmersión'
      }
    ]
  }
}; 