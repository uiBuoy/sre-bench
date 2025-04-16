
import './App.css'
import TerminalPage from './pages/terminal/TerminalPage'
import HomePage from './pages/home/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/terminal' element={<TerminalPage/>}/>
    </Routes>
      
    </BrowserRouter>
  )
}

export default App
