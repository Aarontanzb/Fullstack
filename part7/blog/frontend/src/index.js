import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { NotificationContextProvider } from './NotificationContext'
import { LoginContextProvider } from './LoginContext'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <LoginContextProvider>
      <NotificationContextProvider>
        <App />
      </NotificationContextProvider>
    </LoginContextProvider>
  </QueryClientProvider>
)
