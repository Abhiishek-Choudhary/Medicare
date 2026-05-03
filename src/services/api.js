import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

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

export const getAllDoctors = async () => {
    try {
        return await axios.get(`${BASE_URL}/alldoctors`);
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
