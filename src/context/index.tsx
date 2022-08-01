import {
  createContext,
  Dispatch,
  ReactNode,
  Reducer,
  useContext,
  useReducer
} from "react"
import { Dark, Light } from "../styles"

const initialState = { theme: Light }
type State = typeof initialState
interface Action {
  type: "SWITCH_THEME"
  payload: any
}

const actions = {
  switchTheme: () => ({ type: "SWITCH_THEME" })
}
const reducer: Reducer<State, Action> = (state, { type, payload }) =>
  ({
    SWITCH_THEME: {
      ...state,
      theme: state.theme.name === Light.name ? Dark : Light
    }
  }[type] as State)

interface ContextValue {
  state: State
  dispatch: Dispatch<Action>
  actions: typeof actions
}
const MyContext = createContext<ContextValue>(null!)
export const useMyContext = () => useContext(MyContext)
export const MyContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <MyContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </MyContext.Provider>
  )
}
const BridgeContext = createContext<ContextValue>(null!)
export const useBridgeContext = () => useContext(MyContext)
export const BridgeContextProvider = ({
  value,
  children
}: {
  value: ContextValue
  children: ReactNode
}) => <MyContext.Provider value={value}>{children}</MyContext.Provider>
