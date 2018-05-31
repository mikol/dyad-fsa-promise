# Dyad FSA Promise Middleware

## Installation

```
npm install dyad-fsa-promise
```

## Usage

```js
const Dyad = require('dyad')
const {middleware} = require('dyad-fsa-promise')

const store = Dyad.getInstance()

store.use(middleware)

store.bind({
  ACTION_TYPE: (_, __, action) => console.log(action.payload)
})

store.dispatch({type: 'ACTION_TYPE', payload: Promise.resolve('Hello, World!')})

// Logs 'Hello, World!'
```
