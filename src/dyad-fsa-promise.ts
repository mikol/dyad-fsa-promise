import * as Dyad from 'dyad'
import {isFSA} from 'flux-standard-action'

const store = Dyad.getInstance()

export default function middleware(action: any, next: Dyad.Dispatch): any {
  if (isFSA(action)) {
    const _payload: any = action.payload

    if (_payload && typeof _payload.then === 'function') {
      return _payload.then((payload: any) => {
        store.dispatch({...action, payload})
      }).catch((payload: Error) => {
        store.dispatch({...action, payload, error: true})
        return Promise.reject(payload)
      })
    }

    return next(action)
  }

  return action && typeof action.then === 'function'
    ? action.then((x: any) => store.dispatch(x))
    : next(action)
}
