import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import DeckSelector from '../components/DeckSelector';
import { supabase } from '../lib/supabase';
import { Deck, Card } from '../lib/types';

const Oracle = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [drawnCards, setDrawnCards] = useState<Card[][]>([]);

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

      console.log('drawnCard', drawnCard);
      console.log('selectedDeck', selectedDeck);

      if (!selectedDeck) return;

      if (drawnCards.length === 0) {
        setDrawnCards([[drawnCard]]);
        return;
      }

      if (
        drawnCards[drawnCards.length - 1].some((card) => {
          return card.deck_id === drawnCard.deck_id;
        })
      ) {
        console.log('already drawn');
        setDrawnCards((prevDrawnCards) => {
          return [...prevDrawnCards, [drawnCard]];
        });

        return;
      } else {
        console.log('not drawn yet');
        setDrawnCards((prevDrawnCards) => {
          const lastRow = prevDrawnCards[prevDrawnCards.length - 1];
          const newRow = [...lastRow, drawnCard];
          return [...prevDrawnCards.slice(0, -1), newRow];
        });
      }
    }
  };

  const handleReset = () => {
    setDrawnCards([]);
  };

  console.log('DRAWN CARDS', drawnCards);

  return (
    <Layout>
      <div className="flex pt-8 justify-between width-wrapper">
        <div className="flex-col w-full">
          <div className="flex gap-2 justify-center w-full">
            {decks.map((deck) => {
              if (!deck.isVisible) return null;
              return (
                <div
                  key={deck.id}
                  onClick={() => handleDeckClick(deck)}
                  className="card"
                  style={{
                    background:
                      selectedDeck && deck.id === selectedDeck.id
                        ? 'white'
                        : 'lightgray',
                  }}
                >
                  {deck.title}
                </div>
              );
            })}
          </div>
          <div className="flex flex-col items-center justify-center gap-8">
            {selectedDeck ? (
              <button
                className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 m-3 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                onClick={handleDrawCard}
                disabled={cards.length === 0}
              >
                Draw Card
              </button>
            ) : (
              <div>Please select a deck to view its cards.</div>
            )}
            <div>
              {drawnCards.length > 0 ? (
                <>
                  <div className="flex flex-col w-full gap-2">
                    {drawnCards.map((cardRow, idx) => (
                      <div key={idx} className="flex gap-2">
                        {cardRow.map((card, idx) => (
                          <div
                            key={card.id + idx}
                            className="card"
                            style={{ background: 'gray' }}
                          >
                            {/* <h3>{card.title}</h3> */}
                            <p>{card.prompt}</p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleReset}
                    disabled={drawnCards.length === 0}
                  >
                    Reset
                  </button>
                </>
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
