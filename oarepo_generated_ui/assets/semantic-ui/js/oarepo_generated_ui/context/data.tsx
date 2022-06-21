// Copyright (c) 2022 CESNET
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { LayoutFragmentData } from '../types';

type Action = { type: 'set', value: LayoutFragmentData }
type Dispatch = (action: Action) => void
type State = LayoutFragmentData
type GlobalDataContextProviderProps = { children: React.ReactNode, value?: LayoutFragmentData }


function globalDataReducer (_state: State, action: Action) {
  if (action.type === 'set') {
    return action.value
  } else {
    throw new Error(`Unhandled action type: ${action.type}`)
  }
}


function GlobalDataContextProvider ({ children, value }: GlobalDataContextProviderProps) {
  const [state, dispatch] = React.useReducer(globalDataReducer, value || {})
  const stateValue = { state, dispatch }

  return (
    <GlobalDataContext.Provider value={stateValue}>
      {children}
    </GlobalDataContext.Provider>
  )
}


const GlobalDataContext = React.createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);


export { GlobalDataContext, GlobalDataContextProvider }