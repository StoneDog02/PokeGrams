import "./styles.css";
import pikachu from "./pokiapi-pikachu.json";
import { useEffect, useState } from "react";

function sum(a, b) {
  return () => a + b;
}
const five = sum(3, 2);
console.log(five());

function saveTheFirstChoice(choiceIndex, firstChoice, setFirstChoice) {
  // vvvvvwrite conditional

  if (firstChoice === null) {
    setFirstChoice(choiceIndex);
  }

  // ^^^^^write conditional
}

// Steps for functioning App:
// 1. Choose the pokemon to initiate game (pika-pika) (poke api)
// 2. Make "shadow" area of chosen pokemon
// 3. Get name of chosen pokemon
// 4. Scramble pokemon name
// 5. Render scrambled pokemon name
// 6. Allow for click and drag to unscramble name
//    6b. click two letters to swap positions in scrambled name
//    6c. (click same letter twice, unclicks selected letter)
// 7. Reveal pokemon when name is unscrambled
// 8. Pull in a new random pokemon from poke api

// Non MVP Options:
// 1. Track which pokemon has been used before using that same pokemon
// 2. Choose generations of pokemon to play from
// 3. Time based losing mechanic

function PokemonShadow({ pokemonImg }) {
  return <img src={pokemonImg} alt="A pokemon's shadow" />;
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ];
  }

  return array;
}
function PokemonName({ pokemonNameChars, handleButtonClick }) {
  return pokemonNameChars?.map((letter, index) => (
    <button onClick={() => handleButtonClick(letter, index)}>{letter}</button>
  ));
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max + 1);
}

export default function App() {
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    async function getPokemon() {
      const randomNumber = getRandomInt(151);
      // fetch(`https://pokeapi.co/api/v2/pokemon/${randomNumber}`)
      //   .then((response) => response.json())
      //   .then((data) => setPokemon(data));
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${randomNumber}`
      );
      const data = await response.json();
      setPokemon(data);
    }
    if (pokemon === null) {
      getPokemon();
    }
  }, [pokemon]);

  const [shuffleChars, setShuffleChars] = useState([]);
  // move shuffleChars into a useeffect so it
  // can set shuffleChars when we have a pokemon
  useEffect(() => {
    if (pokemon !== null) {
      setShuffleChars(shuffle(pokemon.name.split(``)));
    }
  }, [pokemon]);
  const [firstIndex, setFirstIndex] = useState(null);
  const [secondIndex, setSecondIndex] = useState(null);
  function handleButtonClick(letter, index) {
    saveTheFirstChoice(index, firstIndex, setFirstIndex);
    // if (firstIndex === null) {
    //   setFirstIndex(index);
    // }
    if (firstIndex !== null && secondIndex === null) {
      setSecondIndex(index);
    }
  }

  useEffect(() => {
    if (firstIndex !== null && secondIndex !== null) {
      console.log(firstIndex, secondIndex);
      // 1. See what current list looks like
      console.log([...shuffleChars]);
      // 2. Swap index places
      const b = shuffleChars[firstIndex];
      shuffleChars[firstIndex] = shuffleChars[secondIndex];
      shuffleChars[secondIndex] = b;
      // 3. Show what changed list looks like
      console.log([...shuffleChars]);
      // 4. Commit and rerender
      setShuffleChars([...shuffleChars]);
      setFirstIndex(null);
      setSecondIndex(null);
    }
  }, [firstIndex, secondIndex, shuffleChars]);

  // Whether they have won:
  // 1. Check if pokemon name is unscrambled correctly
  // 2. If it is, set pokemon to null
  useEffect(() => {
    if (shuffleChars.join("") === pokemon?.name) {
      setPokemon(null);
    }
    console.log(setShuffleChars, shuffleChars.join(), pokemon?.name);
  }, [shuffleChars, pokemon]);

  return (
    <div className="App">
      <h1>PokeGrams</h1>
      <div className="container">
        <PokemonShadow
          pokemonImg={pokemon !== null ? pokemon.sprites.front_default : null}
        />
        <PokemonName
          handleButtonClick={handleButtonClick}
          pokemonNameChars={shuffleChars}
        />
      </div>
    </div>
  );
}
