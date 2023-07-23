import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';

interface Deck {
  id: string;
  title: string;
  description: string;
  user_id: string;
}

const DecksPage: React.FC = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const { user } = useAuth();
  const [savedDecks, setSavedDecks] = useState<string[]>([]); // Array of deck IDs saved by the user

  useEffect(() => {
    fetchDecks();
    fetchSavedDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      // Fetch all available decks from the database
      const { data, error } = await supabase.from('decks').select('*');
      if (error) {
        console.error('Error fetching decks:', error);
        return;
      }
      setDecks(data || []);
    } catch (error) {
      console.error('Error fetching decks:', error);
    }
  };

  const fetchSavedDecks = async () => {
    try {
      if (!user) return;

      // Fetch the IDs of decks saved by the user
      const { data, error } = await supabase
        .from('user_decks')
        .select('deck_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching saved decks:', error);
        return;
      }

      // Extract the deck IDs from the data array and update the state
      const savedDeckIds = data?.map((item) => item.deck_id) || [];
      setSavedDecks(savedDeckIds);
    } catch (error) {
      console.error('Error fetching saved decks:', error);
    }
  };

  const handleSaveDeck = async (deckId: string) => {
    try {
      if (!user) {
        console.error('User is not logged in.');
        return;
      }

      // Check if the deck is already saved by the user
      const isSaved = savedDecks.includes(deckId);

      if (isSaved) {
        // The deck is already saved, so unsave it
        const { error } = await supabase
          .from('user_decks')
          .delete()
          .eq('user_id', user.id)
          .eq('deck_id', deckId);

        if (error) {
          console.error('Error deleting deck from saved decks:', error);
          return;
        }
      } else {
        // The deck is not saved, so save it
        const { error } = await supabase.from('user_decks').insert([
          {
            user_id: user.id,
            deck_id: deckId,
          },
        ]);

        if (error) {
          console.error('Error saving deck to user decks:', error);
          return;
        }
      }

      // Refresh the saved decks after saving or unsaving a deck
      fetchSavedDecks();
    } catch (error) {
      console.error('Error saving/unsaving deck:', error);
    }
  };

  const deckIsSaved = (deckId: string) => {
    return savedDecks.includes(deckId);
  };

  return (
    <Layout>
      <h2>Select Your Decks</h2>
      <ul className="flex flex-wrap gap-4">
        {decks.map((deck) => (
          <li key={deck.id} className="bg-gray-300 max-w-xs">
            <h3>{deck.title}</h3>
            <p>{deck.description}</p>
            <button onClick={() => handleSaveDeck(deck.id)}>
              {user && deckIsSaved(deck.id) ? 'Unsave' : 'Save'}
            </button>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default DecksPage;
