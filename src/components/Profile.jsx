import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Chip, Button, CircularProgress, Divider, Alert, Rating } from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import MailIcon from '@mui/icons-material/Mail';
import StarIcon from '@mui/icons-material/Star';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import Calender from './Calender';
import { getDoctorById } from '../services/api';
import { DataContext } from '../context/DataProvider';

function Profile() {
    const { id } = useParams();
    const { account, role } = useContext(DataContext);
    const [open, setOpen] = useState(false);
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getDoctorById(id).then(res => {
            if (res?.data?.data) setDoctor(res.data.data);
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return (
            <>
                <Navbar />
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                    <CircularProgress />
                </Box>
            </>
        );
    }

    const imageUrl = doctor?.imageUrl || 'https://www.shutterstock.com/image-photo/profile-photo-attractive-family-doc-600nw-1724693776.jpg';
    const name = doctor?.name ? `Dr. ${doctor.name}` : 'Doctor Profile';
    const speciality = doctor?.speciality || 'General Medicine';
    const fee = doctor?.fee ?? 0;
    const email = doctor?.email || '';

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafd' }}>
            <Navbar />

            <Box sx={{ maxWidth: 860, mx: 'auto', px: 3, py: 5 }}>
                {/* Doctor Info Card */}
                <Box sx={{
                    display: 'flex', gap: 4, bgcolor: '#fff', borderRadius: 3,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', p: 4, mb: 4, flexWrap: 'wrap'
                }}>
                    <img
                        src={imageUrl} alt={name}
                        style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 16, flexShrink: 0 }}
                    />
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                        <Typography variant="h5" fontWeight={700} mb={1}>{name}</Typography>
                        <Chip icon={<MedicalServicesIcon />} label={speciality} color="primary" variant="outlined" sx={{ mb: 2 }} />

                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                <CurrencyRupeeIcon fontSize="small" />
                                <Typography variant="body2">{fee} / consultation</Typography>
                            </Box>
                            {email && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                    <MailIcon fontSize="small" />
                                    <Typography variant="body2">{email}</Typography>
                                </Box>
                            )}
                        </Box>

                        {/* Rating */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            {doctor?.averageRating > 0 ? (
                                <>
                                    <Rating value={doctor.averageRating} precision={0.1} readOnly size="small" />
                                    <Typography variant="body2" fontWeight={600} color="#f59e0b">
                                        {doctor.averageRating.toFixed(1)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        ({doctor.totalRatings} {doctor.totalRatings === 1 ? 'review' : 'reviews'})
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <StarIcon sx={{ fontSize: 18, color: '#ccc' }} />
                                    <Typography variant="caption" color="text.secondary">No ratings yet</Typography>
                                </>
                            )}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {role === 'doctor' ? (
                            <Alert severity="info" sx={{ borderRadius: 2 }}>
                                You are logged in as a doctor. Switch to a patient account to book appointments.
                            </Alert>
                        ) : !account ? (
                            <Alert severity="warning" sx={{ borderRadius: 2 }}>
                                Please <strong>login</strong> to book an appointment.
                            </Alert>
                        ) : !open ? (
                            <Button variant="contained" size="large" onClick={() => setOpen(true)} sx={{ borderRadius: 2, px: 4 }}>
                                Book Appointment
                            </Button>
                        ) : (
                            <Button variant="outlined" size="small" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Booking Section */}
                {open && role !== 'doctor' && (
                    <Box sx={{ bgcolor: '#fff', borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', p: 4, mb: 4 }}>
                        <Typography variant="h6" fontWeight={600} mb={3}>Select Appointment Slot</Typography>
                        <Calender doctor={doctor} onBookSuccess={() => setOpen(false)} />
                    </Box>
                )}

                {/* Health Summary */}
                <Box sx={{ bgcolor: '#fff', borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', p: 4 }}>
                    <Typography variant="h6" fontWeight={600} mb={3}>Patient Health Summary</Typography>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
                        {[
                            { label: 'BMI', value: '22.4' },
                            { label: 'Weight', value: '92 kg' },
                            { label: 'Height', value: '175 cm' },
                            { label: 'Blood Pressure', value: '120/80' },
                        ].map(({ label, value }) => (
                            <Box key={label} sx={{ bgcolor: '#f0f4ff', borderRadius: 2, px: 3, py: 2, minWidth: 110, textAlign: 'center' }}>
                                <Typography fontWeight={700} fontSize={18}>{value}</Typography>
                                <Typography variant="body2" color="text.secondary">{label}</Typography>
                            </Box>
                        ))}
                    </Box>
                    <Typography fontWeight={600} mb={1}>Diagnosis</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip label="Obesity" /><Chip label="Uncontrolled type 2" />
                    </Box>
                    <Typography fontWeight={600} mb={1}>Health Barriers</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label="Fear of medication" /><Chip label="Fear of Insulin" />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default Profile;
