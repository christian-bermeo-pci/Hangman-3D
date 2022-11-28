import { useState, useEffect, useCallback, useMemo } from 'react';
// import { HangmanDrawing } from './2D version(not-used)/HangmanDrawing';
import { HangmanDrawing3D } from './HangmanDrawing3D';
import { HangmanWord } from './HangmanWord';
import { Keyboard } from './Keyboard';
import words from './wordList.json';

function getWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function App() {
  // UseState
  const [wordToGuess, setWordToGuess] = useState(getWord);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const incorrectLetters = guessedLetters.filter(
    (letter) => !wordToGuess.includes(letter)
  );

  const isLoser = incorrectLetters.length >= 8; // 8 body parts
  const isWinner = wordToGuess
    .split('')
    .every((letter) => guessedLetters.includes(letter));

  const refresh = (e: any) => {
    e.preventDefault();
    setGuessedLetters([]);
    setWordToGuess(getWord());
  };

  // UseCallback
  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isWinner || isLoser) return;

      setGuessedLetters((currentLetters) => [...currentLetters, letter]);
    },
    [guessedLetters, isWinner, isLoser]
  );

  // UseEffect
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (!key.match(/^[a-z]$/)) return;

      e.preventDefault();
      addGuessedLetter(key);
    };
    document.addEventListener('keypress', handler);

    return () => {
      document.removeEventListener('keypress', handler);
    };
  }, [guessedLetters]);

  const activeLetters = guessedLetters.filter((letter) =>
    wordToGuess.includes(letter)
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (key !== 'Enter') return;

      e.preventDefault();
      setGuessedLetters([]);
      setWordToGuess(getWord());
    };
    document.addEventListener('keypress', handler);

    return () => {
      document.removeEventListener('keypress', handler);
    };
  }, []);

  return (
    <>
      {/* Setting 3D canvas in the background */}
      <HangmanDrawing3D numberOfGuesses={incorrectLetters.length} />

      <div
        style={{
          position: 'absolute',
          left: '10%',
          right: '10%',
          top: 0,
          padding: 0,
          maxHeight: '90%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
            color: 'black',
          }}
        >
          {/* Tittle */}
          <div
            style={{
              fontSize: '2rem',
              textAlign: 'center',
            }}
          >
            {!isWinner && !isLoser ? (
              <div>Welcome to Hangman in 3D</div>
            ) : (
              <div>
                {isWinner && 'Winner! - Press enter to try again'}
                {isLoser && 'Nice try - Press enter to try again'}
              </div>
            )}
          </div>

          {/* Word being Guessed */}
          <HangmanWord
            reveal={isLoser}
            guessedLetters={guessedLetters}
            wordToGuess={wordToGuess}
          />

          <div
            style={{
              fontSize: '1rem',
              textAlign: 'center',
            }}
          >
            {incorrectLetters.length > 0 &&
              !isWinner &&
              !isLoser &&
              `Strike: ${incorrectLetters.length}`}

            {!(incorrectLetters.length > 0) && 'Can you guess this word?'}

            {(isWinner || isLoser) && (
              <button
                style={{
                  width: '80px',
                  padding: '5px',
                  borderRadius: '404px',
                }}
                onClick={(e) => refresh(e)}
              >
                refresh
              </button>
            )}
          </div>

          {/* Keyboard component */}
          {!isWinner || !isLoser ? (
            <Keyboard
              disabled={isWinner || isLoser}
              activeLetters={activeLetters}
              inactiveLetters={incorrectLetters}
              addGuessedLetter={addGuessedLetter}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          alignSelf: 'center',
          left: '38%',
          right: '38%',
          textAlign: 'center',
        }}
      >
        {incorrectLetters.length > 0 && <p>Click & Drag to interact</p>}
        <p>
          <span>by </span>
          <a href='https://christian-bermeo.netlify.app/'>Christian Bermeo</a>
          <br />
          <span> model by </span>
          <a href='https://sketchfab.com/3d-models/lego-dead-pool-c63bbc6f7c574e3899a50b0dd8a2c46d'>
            Ollendorf
          </a>
        </p>
      </div>
    </>
  );
}

export default App;
