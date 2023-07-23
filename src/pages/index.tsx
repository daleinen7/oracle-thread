import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import DeckSelector from '../components/DeckSelector';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/AuthProvider';
import { Deck, Card } from '../lib/types';

const Oracle = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [drawnCards, setDrawnCards] = useState<Card[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const { data, error } = await supabase.from('decks').select('*');
        if (error) throw error;

        const processedDecks: Deck[] = data.map((deck) => ({
          ...deck,
          isVisible: false,
        }));

        setDecks(processedDecks);
      } catch (error) {
        console.error('Error fetching decks:', error);
      }
    };

    fetchDecks();
  }, []);

  const fetchCards = async (deckId: string) => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('deck_id', deckId);
      if (error) throw error;
      setCards(data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const onDeckToggle = async (deckId: string, isVisible: boolean) => {
    const updatedDecks = decks.map((deck) => {
      if (deck.id === deckId) {
        return { ...deck, isVisible };
      }
      return deck;
    });
    setDecks(updatedDecks);
  };

  const handleDeckClick = (deck: Deck) => {
    setSelectedDeck(deck);
    fetchCards(deck.id);
  };

  const handleDrawCard = () => {
    if (cards.length > 0) {
      const randomIndex = Math.floor(Math.random() * cards.length);
      const drawnCard = cards[randomIndex];
      setDrawnCards((prevCards) => [...prevCards, drawnCard]);
      setCards((prevCards) =>
        prevCards.filter((card, index) => index !== randomIndex)
      );
    }
  };

  const handleReset = () => {
    setDrawnCards([]);
  };

  return (
    <Layout>
      <div className="flex justify-between">
        <div className="flex-col">
          <div style={{ display: 'flex' }}>
            {decks.map((deck) => {
              if (!deck.isVisible) return null;
              return (
                <div
                  key={deck.id}
                  onClick={() => handleDeckClick(deck)}
                  style={{
                    border: '1px solid black',
                    padding: '10px',
                    cursor: 'pointer',
                    marginRight: '10px',
                    background:
                      selectedDeck && deck.id === selectedDeck.id
                        ? 'lightgray'
                        : 'white',
                  }}
                >
                  {deck.title}
                </div>
              );
            })}
          </div>
          <div>
            {selectedDeck ? (
              <div>
                <button onClick={handleDrawCard} disabled={cards.length === 0}>
                  Draw Card
                </button>
                <button
                  onClick={handleReset}
                  disabled={drawnCards.length === 0}
                >
                  Reset
                </button>
              </div>
            ) : (
              <div>Please select a deck to view its cards.</div>
            )}
            <div>
              {drawnCards.length > 0 ? (
                drawnCards.map((card) => (
                  <div key={card.id}>
                    <h3>{card.title}</h3>
                    <p>{card.prompt}</p>
                  </div>
                ))
              ) : (
                <div>No cards drawn yet.</div>
              )}
            </div>
          </div>
        </div>
        <DeckSelector decks={decks} onDeckToggle={onDeckToggle} />
      </div>
    </Layout>
  );
};

export default Oracle;
