import React, { useContext, useState } from 'react';
import { Box, Typography, Button, Alert, Chip, TextField } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaymentIcon from '@mui/icons-material/Payment';
import { createAppointment, createOrder, verifyPayment, savePayment } from '../services/api';
import { DataContext } from '../context/DataProvider';

const TIME_SLOTS = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
];

const loadRazorpayScript = () =>
    new Promise((resolve) => {
        if (document.getElementById('razorpay-script')) { resolve(true); return; }
        const script = document.createElement('script');
        script.id = 'razorpay-script';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

function Calender({ doctor, onBookSuccess }) {
    const { account } = useContext(DataContext);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const today = new Date().toISOString().split('T')[0];

    const handlePayAndBook = async () => {
        if (!account) { setError('Please login to book an appointment.'); return; }
        if (!selectedDate || !selectedTime) { setError('Please select a date and time slot.'); return; }

        setLoading(true);
        setError('');

        // 1. Load Razorpay SDK
        const loaded = await loadRazorpayScript();
        if (!loaded) {
            setError('Failed to load payment gateway. Check your internet connection.');
            setLoading(false);
            return;
        }

        // 2. Create order on backend
        const orderRes = await createOrder({ amount: doctor?.fee, currency: 'INR' });
        if (!orderRes?.data?.id) {
            setError('Could not initiate payment. Please try again.');
            setLoading(false);
            return;
        }

        const { id: orderId, amount: orderAmount, currency, key_id } = orderRes.data;

        if (!key_id) {
            setError('Payment gateway not configured. Contact support.');
            setLoading(false);
            return;
        }

        // 3. Open Razorpay checkout
        const options = {
            key: key_id,
            amount: orderAmount,
            currency,
            name: 'Medicare',
            description: `Appointment with Dr. ${doctor?.name}`,
            order_id: orderId,
            prefill: {
                name: account.name || account.username,
                email: account.email,
            },
            theme: { color: '#1976d2' },
            handler: async (paymentResponse) => {
                // 4. Verify payment signature
                const verifyRes = await verifyPayment({
                    razorpay_order_id: paymentResponse.razorpay_order_id,
                    razorpay_payment_id: paymentResponse.razorpay_payment_id,
                    razorpay_signature: paymentResponse.razorpay_signature,
                });

                if (verifyRes?.data?.status !== 'success') {
                    setError('Payment verification failed. Contact support.');
                    setLoading(false);
                    return;
                }

                // 5. Create appointment
                const dateTime = new Date(`${selectedDate} ${selectedTime}`);
                const apptPayload = {
                    doctorId: doctor?._id,
                    userId: account.id || account._id,
                    customerEmail: account.email,
                    doctorName: doctor?.name,
                    customerName: account.name || account.username,
                    date: dateTime.toISOString(),
                    fee: doctor?.fee,
                    paymentId: paymentResponse.razorpay_payment_id,
                };

                const apptRes = await createAppointment(apptPayload);
                const appointmentId = apptRes?.data?.appointment?._id;

                // 6. Save payment record
                await savePayment({
                    patientId: account.id || account._id,
                    doctorId: doctor?._id,
                    appointmentId: appointmentId || null,
                    amount: doctor?.fee,
                    paymentMethod: 'Razorpay',
                    transactionId: paymentResponse.razorpay_payment_id,
                });

                setLoading(false);
                setSuccess(true);
                onBookSuccess?.();
            },
            modal: {
                ondismiss: () => {
                    setLoading(false);
                    setError('Payment was cancelled.');
                },
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    if (success) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <CheckCircleIcon sx={{ fontSize: 64, color: '#2e7d32', mb: 2 }} />
                <Typography variant="h6" fontWeight={700} color="#2e7d32">
                    Appointment Confirmed!
                </Typography>
                <Typography color="text.secondary" mt={1}>
                    {selectedDate} at {selectedTime} with Dr. {doctor?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                    Confirmation sent to {account?.email}
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}

            {/* Date picker */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight={600} mb={1} color="text.secondary">
                    Select Date
                </Typography>
                <TextField
                    type="date"
                    value={selectedDate}
                    onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(''); }}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: today }}
                    size="small"
                    sx={{ minWidth: 220 }}
                />
            </Box>

            {/* Time slots */}
            {selectedDate && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" fontWeight={600} mb={1.5} color="text.secondary">
                        Available Time Slots
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {TIME_SLOTS.map(slot => (
                            <Chip
                                key={slot}
                                label={slot}
                                onClick={() => setSelectedTime(slot)}
                                color={selectedTime === slot ? 'primary' : 'default'}
                                variant={selectedTime === slot ? 'filled' : 'outlined'}
                                sx={{ cursor: 'pointer' }}
                            />
                        ))}
                    </Box>
                </Box>
            )}

            {/* Booking summary */}
            {selectedDate && selectedTime && (
                <Box sx={{ bgcolor: '#f0f7ff', border: '1px solid #bbdefb', borderRadius: 2, p: 2.5, mb: 3 }}>
                    <Typography fontWeight={600} mb={1}>Booking Summary</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Doctor: <b>Dr. {doctor?.name}</b> — {doctor?.speciality}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Date & Time: <b>{selectedDate}</b> at <b>{selectedTime}</b>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Consultation Fee: <b>₹{doctor?.fee}</b>
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                        Payment is processed securely via Razorpay.
                    </Typography>
                </Box>
            )}

            <Button
                variant="contained"
                size="large"
                onClick={handlePayAndBook}
                disabled={loading || !selectedDate || !selectedTime}
                startIcon={<PaymentIcon />}
                sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}
            >
                {loading ? 'Processing...' : `Pay ₹${doctor?.fee} & Confirm`}
            </Button>
        </Box>
    );
}

export default Calender;
