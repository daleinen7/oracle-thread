import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import DeckSelector from '../components/DeckSelector';
import { supabase } from '../lib/supabase';
import { Deck, Card } from '../lib/types';
import { useAuth } from '../auth/AuthProvider';

const Oracle = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [drawnCards, setDrawnCards] = useState<Card[][]>([]);

  const { user } = useAuth();

  useEffect(() => {
    const fetchSelectedDecks = async () => {
      try {
        if (!user) return; // Make sure the user is logged in

        // Fetch the deck_ids of decks saved by the user from the user_decks table
        const { data: userDeckData, error: userDeckError } = await supabase
          .from('user_decks')
          .select('deck_id')
          .eq('user_id', user.id);

        if (userDeckError) throw userDeckError;

        const deckIds = userDeckData?.map((item) => item.deck_id) || [];

        // Fetch the selected decks from the decks table based on the deck_ids
        const { data: deckData, error: deckError } = await supabase
          .from('decks')
          .select('*')
          .in('id', deckIds);

        if (deckError) throw deckError;

        const selectedDecks: Deck[] =
          deckData?.map((deck) => ({
            ...deck,
            isVisible: false,
          })) || [];

        // Update the selected decks state
        setDecks(selectedDecks);
      } catch (error) {
        console.error('Error fetching selected decks:', error);
      }
    };

    fetchSelectedDecks();
  }, [user]);

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
