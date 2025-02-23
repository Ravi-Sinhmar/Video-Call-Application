
import { createRoot } from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import App from './App.jsx'
import './main.css'
createRoot(document.getElementById('root')).render(
  <RecoilRoot>
        <App />
  </RecoilRoot>


)
