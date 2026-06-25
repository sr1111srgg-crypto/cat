export type CatBreed = 'tabby' | 'tuxedo' | 'siamese' | 'calico' | 'orange' | 'white' | 'black' | 'persian';

export type CatPattern = 'solid' | 'stripes' | 'bicolor' | 'points' | 'spots';

export type EyeType = 'cute' | 'sparkling' | 'derp' | 'sleepy' | 'angry' | 'funny';

export type MouthExpression = 'smile' | 'meh' | 'pout' | 'shocked' | 'smug' | 'tongue';

export interface CatConfig {
  id: string;
  name: string;
  breed: CatBreed;
  pattern: CatPattern;
  colors: {
    primary: string;     // Hex color for body
    secondary: string;   // Hex color for chest/paws/belly
    eyes: string;        // Hex color for irises
    stripes?: string;    // Hex color for patterns
  };
  eyeType: EyeType;
  expression: MouthExpression;
  accessories: string[]; // List of accessory IDs
  personalityTraits: string[]; // Custom habits selected
  
  // AI-generated fields (optional or loaded via Gemini)
  funnyName?: string;
  title?: string;
  secretBackground?: string;
  traits?: string[];
  thoughts?: string[];
  currentThought?: string;
}

export type PlayAction = 'idle' | 'walking' | 'running' | 'sleeping' | 'sitting' | 'eating' | 'pouncing' | 'in_box';

export interface ActiveCat {
  config: CatConfig;
  x: number;
  y: number;
  targetX?: number;
  targetY?: number;
  action: PlayAction;
  direction: 'left' | 'right';
  hunger: number;     // 0 (full) to 100 (starving)
  energy: number;     // 0 (tired) to 100 (hyped)
  thoughtBubbleTime: number; // Duration of current thought bubble
  currentThought?: string;
  insideBoxId?: string; // ID of the box the cat is in
}

export type InteractableType = 'food' | 'box' | 'toy_mouse' | 'laser';

export interface InteractableObject {
  id: string;
  type: InteractableType;
  x: number;
  y: number;
  state?: 'full' | 'empty' | 'placed';
  pouncedCount?: number;
}
