import React, { useState, useEffect } from 'react';
import { Deck } from '../lib/types';

interface DeckSelectorProps {
  onDeckToggle: (deckId: string, isVisible: boolean) => void;
  decks: Deck[];
}

const DeckSelector: React.FC<DeckSelectorProps> = ({ onDeckToggle, decks }) => {
  const handleDeckToggle = (deckId: string, isVisible: boolean) => {
    onDeckToggle(deckId, isVisible);
  };

  return (
    <div className="container:sm">
      <h3>Decks</h3>
      <ul>
        {decks.map((deck) => (
          <li key={deck.id}>
            <label>
              <input
                type="checkbox"
                checked={deck.isVisible}
                onChange={() => handleDeckToggle(deck.id, !deck.isVisible)}
              />
              {deck.title}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeckSelector;
