import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DataProvider from './context/DataProvider';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Doctors from './components/Doctors';
import Profile from './components/Profile';
import MyProfile from './components/MyProfile';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import DoctorRegister from './components/DoctorRegister';
import Meetings from './components/Meetings';
import CreateMeetings from './components/CreateMeetings';
import JoinMeetings from './components/JoinMeetings';
import Rooms from './components/Rooms';

function App() {
    return (
        <BrowserRouter>
            <DataProvider>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/doctors' element={<Doctors />} />
                    <Route path='/docprofile/:id' element={<Profile />} />
                    <Route path='/docprofile' element={<Profile />} />
                    <Route path='/profile' element={<MyProfile />} />
                    <Route path='/patient-dashboard' element={<PatientDashboard />} />
                    <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
                    <Route path='/doctor-register' element={<DoctorRegister />} />
                    <Route path='/meetings' element={<Meetings />} />
                    <Route path='/create' element={<CreateMeetings />} />
                    <Route path='/join' element={<JoinMeetings />} />
                    <Route path='/room/:roomId' element={<Rooms />} />
                </Routes>
            </DataProvider>
        </BrowserRouter>
    );
}

export default App;
