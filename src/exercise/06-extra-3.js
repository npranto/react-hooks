// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
import {PokemonForm} from '../pokemon'

const defaultState = {
  status: 'idle',
  error: null,
  pokemon: null,
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState(defaultState)

  React.useEffect(() => {
    if (!pokemonName) return
    setState({status: 'pending', error: null, pokemon: null})
    fetchPokemon(pokemonName)
      .then(pokemon => {
        setState({status: 'resolved', error: null, pokemon})
      })
      .catch(error => {
        setState({status: 'rejected', error, pokemon: null})
      })
  }, [pokemonName])

  const {status, error, pokemon} = state || {}

  if (status === 'rejected') {
    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    )
  }
  if (status === 'idle') {
    return 'Submit a pokemon'
  }
  if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  }
  return <PokemonDataView pokemon={pokemon} />
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
