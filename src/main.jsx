import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from "react-redux";
import store from "./redux/store.js";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap the App component with the Provider component */}
    {/* Provide the Redux store to the App component */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
