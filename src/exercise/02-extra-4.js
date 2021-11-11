// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const SPECIAL_NAMES = ['Kobe', 'LeBron', 'Magic']
const isNameSpecial = name =>
  SPECIAL_NAMES.some(n => n.toLowerCase() === name.toLowerCase())

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorage(initialName)

  const [isSpecialName, setIsSpecialName] = useLocalStorage(
    'isSpecialName',
    isNameSpecial(name),
  )

  function handleChange(event) {
    setName(event.target.value)
    setIsSpecialName(isNameSpecial(event.target.value))
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
        <span>{isSpecialName && <i>(Special)</i>}</span>
      </form>

      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function useLocalStorage(
  key,
  initialValue = '',
  {stringify = JSON.stringify, parse = JSON.parse} = {},
) {
  const prevKeyRef = React.useRef(key)
  const [value, setValue] = React.useState(() => {
    try {
      return parse(window.localStorage.getItem(key))
    } catch (e) {
      window.localStorage.removeItem(key)
    }
    return initialValue
  })

  React.useEffect(() => {
    if (prevKeyRef.current !== key) {
      window.localStorage.removeItem(prevKeyRef.current)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, stringify(value))
  }, [key, stringify, value])

  return [value, setValue]
}

function App() {
  return <Greeting />
}

export default App
