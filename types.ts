export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface TreeLayerProps {
  scale: number;
  position: [number, number, number];
  color: string;
}

export enum ThemeColor {
  GOLD = '#FFD700',
  EMERALD = '#023825',
  RUBY = '#D40000',
  SILVER = '#C0C0C0',
  // Chiikawa Palette
  CHIIKAWA_WHITE = '#FFFDF5', // Warm milk white
  CHIIKAWA_PINK = '#FFB7C5',  // Blush pink
  HACHIWARE_BLUE = '#89CFF0', // Pastel blue
  USAGI_YELLOW = '#FFFDD0',   // Cream yellow
  COOKIE_BROWN = '#D2691E'    // Baked cookie color
}

export interface InteractiveState {
  lightsOn: boolean;
  rotationSpeed: number;
  setLightsOn: (on: boolean) => void;
  setRotationSpeed: (speed: number) => void;
  isScattered: boolean;
  setIsScattered: (scattered: boolean) => void;
}