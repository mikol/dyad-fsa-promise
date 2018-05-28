import {expect} from 'chai'
import * as Dyad from 'dyad'
import * as sinon from 'sinon'

import middleware from '../src/dyad-fsa-promise'

const spy = sinon.spy(middleware)
const store = Dyad.getInstance()

describe('dyad-fsa-promise', () => {
  before(() => store.initialize())

  afterEach(() => {
    spy.resetHistory()
    store.initialize()
  })

  it('can dispatch actions', () => {
    const expectedAction = {type: 'X', nonstandard: true}

    return new Promise((resolve, reject) => {
      store.use(spy)

      store.bind({
        X: (_, __, action: Dyad.Action) => {
          try {
            expect(spy.callCount).to.equal(1)
            expect(action).to.equal(expectedAction)
            resolve()
          } catch (error) {
            reject(error)
          }
        }
      })

      store.dispatch(expectedAction)
    })
  })

  it('can then actions', () => {
    const expectedAction = {type: 'X', nonstandard: true}

    return new Promise((resolve, reject) => {
      store.use(spy)

      store.bind({
        X: (_, __, action: Dyad.Action) => {
          try {
            expect(spy.callCount).to.equal(2)
            expect(action).to.equal(expectedAction)
            resolve()
          } catch (error) {
            reject(error)
          }
        }
      })

      store.dispatch(Promise.resolve(expectedAction))
    })
  })

  it('can reject actions', () => {
    return new Promise((resolve, reject) => {
      store.use(spy)
      store.bind({X: (_, __, ___) => reject(new Error('Called reducer'))})
      store.dispatch(Promise.reject(new Error('3rr0r'))).catch(resolve)
    })
  })

  it('can dispatch FSA actions', () => {
    const payload = {}
    const expectedAction = {type: 'X', payload}

    return new Promise((resolve, reject) => {
      store.use(spy)

      store.bind({
        X: (_, __, action: Dyad.Action) => {
          try {
            expect(spy.callCount).to.equal(1)
            expect(action.payload).to.equal(payload)
            resolve()
          } catch (error) {
            reject(error)
          }
        }
      })

      store.dispatch(expectedAction)
    })
  })

  it('can then FSA actions', () => {
    const payload = {}
    const expectedAction = {type: 'X', payload: Promise.resolve(payload)}

    return new Promise((resolve, reject) => {
      store.use(spy)

      store.bind({
        X: (_, __, action: Dyad.Action) => {
          try {
            expect(spy.callCount).to.equal(2)
            expect(action.payload).to.equal(payload)
            resolve()
          } catch (error) {
            reject(error)
          }
        }
      })

      store.dispatch(expectedAction)
    })
  })

  it('can reject FSA actions', () => {
    const payload = new Error('3rr0r')
    const expectedAction = {type: 'X', payload: Promise.reject(payload)}

    return new Promise((resolve, reject) => {
      store.use(spy)

      store.bind({
        X: (_, __, action: Dyad.Action) => {
          try {
            expect(spy.callCount).to.equal(2)
            expect(action.error).to.be.true
            expect(action.payload).to.equal(payload)
            resolve()
          } catch (error) {
            reject(error)
          }
        }
      })

      store.dispatch(expectedAction)
        .then(() => reject(new Error('Expected rejection')))
        .catch(resolve)
    })
  })
})
