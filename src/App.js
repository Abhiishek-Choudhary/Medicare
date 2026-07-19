import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import DataProvider from './context/DataProvider';
import CartProvider from './context/CartProvider';
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
import Pharmacy from './components/pharmacy/Pharmacy';
import MedicineDetail from './components/pharmacy/MedicineDetail';
import Cart from './components/pharmacy/Cart';
import Checkout from './components/pharmacy/Checkout';
import Orders from './components/pharmacy/Orders';
import OrderDetail from './components/pharmacy/OrderDetail';
import AdminGuard from './components/admin/AdminGuard';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminCustomers from './components/admin/AdminCustomers';
import AdminCustomerDetail from './components/admin/AdminCustomerDetail';
import AdminDoctors from './components/admin/AdminDoctors';
import AdminDoctorDetail from './components/admin/AdminDoctorDetail';
import AdminOrders from './components/admin/AdminOrders';
import AdminAppointments from './components/admin/AdminAppointments';
import AdminMedicines from './components/admin/AdminMedicines';
import AdminPrescriptions from './components/admin/AdminPrescriptions';
import AdminBloodDonors from './components/admin/AdminBloodDonors';
import AdminBloodHospitals from './components/admin/AdminBloodHospitals';
import BloodBank from './components/blood/BloodBank';
import DonorRegister from './components/blood/DonorRegister';
import HospitalAuth from './components/hospital/HospitalAuth';
import HospitalDashboard from './components/hospital/HospitalDashboard';
import HospitalsList from './components/hospital/HospitalsList';
import HospitalDetail from './components/hospital/HospitalDetail';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <DataProvider>
                <CartProvider>
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
                    <Route path='/pharmacy' element={<Pharmacy />} />
                    <Route path='/pharmacy/medicine/:id' element={<MedicineDetail />} />
                    <Route path='/pharmacy/cart' element={<Cart />} />
                    <Route path='/pharmacy/checkout' element={<Checkout />} />
                    <Route path='/pharmacy/orders' element={<Orders />} />
                    <Route path='/pharmacy/orders/:id' element={<OrderDetail />} />
                    <Route path='/admin' element={<AdminGuard><AdminDashboard /></AdminGuard>} />
                    <Route path='/admin/customers' element={<AdminGuard><AdminCustomers /></AdminGuard>} />
                    <Route path='/admin/customers/:id' element={<AdminGuard><AdminCustomerDetail /></AdminGuard>} />
                    <Route path='/admin/doctors' element={<AdminGuard><AdminDoctors /></AdminGuard>} />
                    <Route path='/admin/doctors/:id' element={<AdminGuard><AdminDoctorDetail /></AdminGuard>} />
                    <Route path='/admin/orders' element={<AdminGuard><AdminOrders /></AdminGuard>} />
                    <Route path='/admin/appointments' element={<AdminGuard><AdminAppointments /></AdminGuard>} />
                    <Route path='/admin/medicines' element={<AdminGuard><AdminMedicines /></AdminGuard>} />
                    <Route path='/admin/prescriptions' element={<AdminGuard><AdminPrescriptions /></AdminGuard>} />
                    <Route path='/admin/blood/donors' element={<AdminGuard><AdminBloodDonors /></AdminGuard>} />
                    <Route path='/admin/blood/hospitals' element={<AdminGuard><AdminBloodHospitals /></AdminGuard>} />
                    <Route path='/blood' element={<BloodBank />} />
                    <Route path='/blood/register' element={<DonorRegister />} />
                    <Route path='/hospitals' element={<HospitalsList />} />
                    <Route path='/hospitals/:id' element={<HospitalDetail />} />
                    <Route path='/hospital/login' element={<HospitalAuth initialTab={0} />} />
                    <Route path='/hospital/register' element={<HospitalAuth initialTab={1} />} />
                    <Route path='/hospital/dashboard' element={<HospitalDashboard />} />
                </Routes>
                </CartProvider>
            </DataProvider>
        </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
