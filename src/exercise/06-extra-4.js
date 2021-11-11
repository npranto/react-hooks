// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
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
    throw error
  }
  if (status === 'idle') {
    return 'Submit a pokemon'
  }
  if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  }
  return <PokemonDataView pokemon={pokemon} />
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error) {
    return {hasError: true, error}
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert">
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>
            {this.state?.error?.message || 'lol'}
          </pre>
        </div>
      )
    }

    return this.props.children
  }
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
        <ErrorBoundary>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
