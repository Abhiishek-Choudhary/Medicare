import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Profile from './components/Profile';
import MyProfile from './components/MyProfile';
import Meetings from './components/Meetings';
import CreateMeetings from './components/CreateMeetings';
import JoinMeetings from './components/JoinMeetings';
import Rooms from './components/Rooms';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/profile' element={<MyProfile/>}/>
        <Route path='/docprofile' element={<Profile/>}/>
        <Route path='/meetings' element={<Meetings/>}/>
        <Route path='/create' element={<CreateMeetings/>}/>
        <Route path='/join' element={<JoinMeetings/>}/>
        <Route path='/room/:roomId' element={<Rooms/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
