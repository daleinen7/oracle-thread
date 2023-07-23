export interface Deck {
  id: string;
  title: string;
  description: string;
  user_id: string;
  isVisible?: boolean;
}

export interface Card {
  id: string;
  deck_id: string;
  title: string;
  prompt: string;
}
