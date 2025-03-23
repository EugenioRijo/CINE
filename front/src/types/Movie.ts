export interface Movie {
  id: number;
  title: string;
  imageUrl: string;
  duration: number;
  description: string;
  genre: string[];
  rating: string;
  isTop?: boolean;
}

export interface ShowTime {
  id: number;
  time: string;
  duration: number;
  cleaningTime: number;
}

export interface Seat {
  id: number;
  row: string;
  number: number;
  isOccupied: boolean;
  isSelected: boolean;
} 