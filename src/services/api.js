import axios from 'axios';

const BASE_URL = 'https://medicare2-0.onrender.com';

// Axios instance for pharmacy endpoints (auto-attaches JWT)
export const pharmacyApi = axios.create({ baseURL: `${BASE_URL}/pharmacy` });

pharmacyApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('medicare_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ── Pharmacy: catalog ─────────────────────────────────────────
export const listMedicines = (params = {}) => pharmacyApi.get('/medicines', { params });
export const getMedicine = (id) => pharmacyApi.get(`/medicines/${id}`);
export const listCategories = () => pharmacyApi.get('/categories');

// ── Pharmacy: cart ────────────────────────────────────────────
export const getCart = () => pharmacyApi.get('/cart');
export const addToCart = (medicineId, quantity = 1) =>
    pharmacyApi.post('/cart/add', { medicineId, quantity });
export const updateCartItem = (medicineId, quantity) =>
    pharmacyApi.put('/cart/update', { medicineId, quantity });
export const removeFromCart = (medicineId) => pharmacyApi.delete(`/cart/remove/${medicineId}`);
export const clearCart = () => pharmacyApi.delete('/cart/clear');

// ── Pharmacy: addresses ───────────────────────────────────────
export const listAddresses = () => pharmacyApi.get('/addresses');
export const createAddress = (address) => pharmacyApi.post('/addresses', address);
export const updateAddress = (id, address) => pharmacyApi.put(`/addresses/${id}`, address);
export const deleteAddress = (id) => pharmacyApi.delete(`/addresses/${id}`);

// ── Pharmacy: prescriptions ───────────────────────────────────
export const uploadPrescription = (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return pharmacyApi.post('/prescriptions', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
export const listMyPrescriptions = () => pharmacyApi.get('/prescriptions/me');

// ── Pharmacy: orders ──────────────────────────────────────────
export const placeMedicineOrder = (payload) => pharmacyApi.post('/orders', payload);
export const verifyMedicineOrderPayment = (payload) => pharmacyApi.post('/orders/verify', payload);
export const listMyOrders = () => pharmacyApi.get('/orders/me');
export const getOrder = (id) => pharmacyApi.get(`/orders/${id}`);
export const cancelOrder = (id, reason) => pharmacyApi.put(`/orders/${id}/cancel`, { reason });

// ── Admin ─────────────────────────────────────────────────────
export const adminApi = axios.create({ baseURL: `${BASE_URL}/admin` });
adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('medicare_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const adminGetStats = () => adminApi.get('/stats');
export const adminGetActivity = () => adminApi.get('/activity');
export const adminListCustomers = (params = {}) => adminApi.get('/customers', { params });
export const adminGetCustomer = (id) => adminApi.get(`/customers/${id}`);
export const adminListDoctors = (params = {}) => adminApi.get('/doctors', { params });
export const adminGetDoctor = (id) => adminApi.get(`/doctors/${id}`);
export const adminListAppointments = (params = {}) => adminApi.get('/appointments', { params });
export const adminListOrders = (params = {}) => adminApi.get('/orders', { params });
export const adminUpdateOrderStatus = (id, payload) => adminApi.put(`/orders/${id}/status`, payload);
export const adminUpdateCustomer = (id, payload) => adminApi.put(`/customers/${id}`, payload);
export const adminDeleteCustomer = (id) => adminApi.delete(`/customers/${id}`);
export const adminUpdateDoctor = (id, payload) => adminApi.put(`/doctors/${id}`, payload);
export const adminDeleteDoctor = (id) => adminApi.delete(`/doctors/${id}`);
export const adminListPendingPrescriptions = () => adminApi.get('/prescriptions/pending');
export const adminVerifyPrescription = (id, payload) => adminApi.put(`/prescriptions/${id}/verify`, payload);

// ── Hospital ──────────────────────────────────────────────────
export const hospitalApi = axios.create({ baseURL: `${BASE_URL}/hospital` });
hospitalApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('medicare_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Public
export const listHospitalsPublic = (params = {}) => hospitalApi.get('/list', { params });
export const getHospitalPublic = (id) => hospitalApi.get(`/${id}`);
export const getHospitalSlots = (id, params) => hospitalApi.get(`/${id}/slots`, { params });
export const bookHospitalSlot = (id, payload) => hospitalApi.post(`/${id}/book`, payload);
export const getMyHospitalBookings = () => hospitalApi.get('/me/bookings');
export const cancelHospitalBooking = (id, reason) => hospitalApi.put(`/me/bookings/${id}/cancel`, { reason });

// Auth
export const hospitalSignup = (payload) => hospitalApi.post('/signup', payload);
export const hospitalLogin = (payload) => hospitalApi.post('/login', payload);

// Hospital self-service
export const getMyHospital = () => hospitalApi.get('/me');
export const updateMyHospital = (payload) => hospitalApi.put('/me', payload);
export const addHospitalService = (payload) => hospitalApi.post('/me/services', payload);
export const updateHospitalService = (sid, payload) => hospitalApi.put(`/me/services/${sid}`, payload);
export const deleteHospitalService = (sid) => hospitalApi.delete(`/me/services/${sid}`);
export const setHospitalDoctors = (doctorIds) => hospitalApi.put('/me/doctors', { doctorIds });
export const setHospitalMedicines = (medicineIds) => hospitalApi.put('/me/medicines', { medicineIds });
export const getHospitalBookingsInbox = (params = {}) => hospitalApi.get('/me/bookings-inbox', { params });
export const updateHospitalBookingStatus = (id, payload) => hospitalApi.put(`/me/bookings-inbox/${id}/status`, payload);

// ── Me (profile) ──────────────────────────────────────────────
export const meApi = axios.create({ baseURL: `${BASE_URL}/me` });
meApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('medicare_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
export const getMe = () => meApi.get('/');
export const updateMe = (payload) => meApi.put('/', payload);
export const getMyActivity = () => meApi.get('/activity');

// ── Blood Bank ────────────────────────────────────────────────
export const bloodApi = axios.create({ baseURL: `${BASE_URL}/blood` });
bloodApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('medicare_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const getBloodMeta = () => bloodApi.get('/meta');
export const searchDonors = (params = {}) => bloodApi.get('/donors', { params });
export const getDonor = (id) => bloodApi.get(`/donors/${id}`);
export const listHospitals = (params = {}) => bloodApi.get('/hospitals', { params });
export const registerDonor = (payload) => bloodApi.post('/donors', payload);
export const getMyDonorProfile = () => bloodApi.get('/donors/me');
export const updateMyDonorProfile = (payload) => bloodApi.put('/donors/me', payload);
export const deleteMyDonorProfile = () => bloodApi.delete('/donors/me');

// Admin
export const adminListDonors = (params = {}) => adminApi.get('/blood/donors', { params });
export const adminVerifyDonor = (id, verified) => adminApi.put(`/blood/donors/${id}/verify`, { verified });
export const adminDeleteDonor = (id) => adminApi.delete(`/blood/donors/${id}`);
export const adminListHospitals = (params = {}) => adminApi.get('/blood/hospitals', { params });
export const adminCreateHospital = (payload) => adminApi.post('/blood/hospitals', payload);
export const adminUpdateHospital = (id, payload) => adminApi.put(`/blood/hospitals/${id}`, payload);
export const adminDeleteHospital = (id) => adminApi.delete(`/blood/hospitals/${id}`);

// Catalog CRUD reuses /pharmacy endpoints (already protected by adminOnly)
export const adminCreateMedicine = (payload) => pharmacyApi.post('/medicines', payload);
export const adminUpdateMedicine = (id, payload) => pharmacyApi.put(`/medicines/${id}`, payload);
export const adminDeleteMedicine = (id) => pharmacyApi.delete(`/medicines/${id}`);
export const adminUpdateStock = (id, stock) => pharmacyApi.put(`/medicines/${id}/stock`, { stock });
export const adminCreateCategory = (payload) => pharmacyApi.post('/categories', payload);

export const authenticateSignUp = async (user) => {
    try {
        return await axios.post(`${BASE_URL}/signup`, user);
    } catch (error) {
        console.log('Error while calling the signup api', error);
    }
};

export const authenticateLogin = async (user) => {
    try {
        return await axios.post(`${BASE_URL}/login`, user);
    } catch (error) {
        console.log('Error while calling the login api', error);
    }
};

export const authenticateDocLogin = async (data) => {
    try {
        return await axios.post(`${BASE_URL}/doclogin`, data);
    } catch (error) {
        console.log('Error while calling the doclogin api', error);
    }
};

export const userDetails = async (user) => {
    try {
        return await axios.post(`${BASE_URL}/details`, user);
    } catch (error) {
        console.log('Error while calling the details api', error);
    }
};

export const getUserDetails = async () => {
    try {
        return await axios.get(`${BASE_URL}/profile`);
    } catch (error) {
        console.log('Error while calling the get user details api', error);
    }
};

export const getAllDoctors = async (params = {}) => {
    try {
        return await axios.get(`${BASE_URL}/alldoctors`, { params });
    } catch (error) {
        console.log('Error fetching all doctors', error);
    }
};

export const getDoctorById = async (id) => {
    try {
        return await axios.get(`${BASE_URL}/doctor/${id}`);
    } catch (error) {
        console.log('Error fetching doctor by id', error);
    }
};

export const createAppointment = async (appointment) => {
    try {
        return await axios.post(`${BASE_URL}/api/appointments`, appointment);
    } catch (error) {
        console.log('Error creating appointment', error);
    }
};

export const getUserAppointments = async (userId) => {
    try {
        return await axios.get(`${BASE_URL}/user/${userId}`);
    } catch (error) {
        console.log('Error fetching user appointments', error);
    }
};

export const getDoctorAppointments = async (doctorId) => {
    try {
        return await axios.get(`${BASE_URL}/doctor/appointments/${doctorId}`);
    } catch (error) {
        console.log('Error fetching doctor appointments', error);
    }
};

export const cancelAppointment = async (id) => {
    try {
        return await axios.delete(`${BASE_URL}/delete/${id}`);
    } catch (error) {
        console.log('Error cancelling appointment', error);
    }
};

export const cancelAppointmentByDoctor = async (id) => {
    try {
        return await axios.put(`${BASE_URL}/cancel/${id}`);
    } catch (error) {
        console.log('Error cancelling appointment by doctor', error);
    }
};

export const rescheduleAppointment = async (id, newDate) => {
    try {
        return await axios.put(`${BASE_URL}/reschedule/${id}`, { newDate });
    } catch (error) {
        console.log('Error rescheduling appointment', error);
    }
};

export const createOrder = async (data) => {
    try {
        return await axios.post(`${BASE_URL}/order`, data);
    } catch (error) {
        console.log('Error creating order', error);
    }
};

export const verifyPayment = async (data) => {
    try {
        return await axios.post(`${BASE_URL}/verify`, data);
    } catch (error) {
        console.log('Error verifying payment', error);
    }
};

export const savePayment = async (data) => {
    try {
        return await axios.post(`${BASE_URL}/save`, data);
    } catch (error) {
        console.log('Error saving payment', error);
    }
};

export const getUserPayments = async (userId) => {
    try {
        return await axios.get(`${BASE_URL}/payments/${userId}`);
    } catch (error) {
        console.log('Error fetching payment history', error);
    }
};

export const submitRating = async (appointmentId, rating, review = '') => {
    try {
        return await axios.post(`${BASE_URL}/rate`, { appointmentId, rating, review });
    } catch (error) {
        console.log('Error submitting rating', error);
    }
};
