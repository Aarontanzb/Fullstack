import { createContext, useReducer, useContext } from 'react'

const LoginReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    default:
      return state
  }
}

const LoginContext = createContext()

export const LoginContextProvider = (props) => {
  const [login, loginDispatch] = useReducer(LoginReducer, null)

  return (
    <LoginContext.Provider value={[login, loginDispatch]}>
      {props.children}
    </LoginContext.Provider>
  )
}

export const useLoginValue = () => {
  const loginAndDispatch = useContext(LoginContext)
  return loginAndDispatch[0]
}

export const useLoginDispatch = () => {
  const loginAndDispatch = useContext(LoginContext)
  return loginAndDispatch[1]
}

export default LoginContext
