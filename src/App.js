import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Profile from './components/Profile';
import MyProfile from './components/MyProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/profile' element={<MyProfile/>}/>
        <Route path='/docprofile' element={<Profile/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
