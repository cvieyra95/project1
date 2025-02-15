import logo from './logo.svg';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import './App.css';
import Login from './Components/Login/Login'
import Chat from './Components/Chat/Chat'
import Signup from './Components/SignUp/signUp';
import UserProvider from './Components/UserContext';

function App() {
  return (
    <BrowserRouter>
    <UserProvider>
      <Routes>
      <Route path = '/' element={<Login/>}/>
        <Route path = '/login' element={<Login/>}/>
        <Route path = '/chat' element={<Chat/>}/>
        <Route path = '/signup' element={<Signup/>}/>
      </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
