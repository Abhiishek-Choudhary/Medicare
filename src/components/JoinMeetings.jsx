import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, InputAdornment } from '@mui/material';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function JoinMeetings() {
    const [value, setValue] = useState('');
    const navigate = useNavigate();

    const handleJoin = () => {
        const trimmed = value.trim();
        if (trimmed) navigate(`/room/${trimmed}`);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafd' }}>
            <Navbar />

            <Box sx={{
                maxWidth: 480,
                mx: 'auto',
                px: 3,
                py: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Paper elevation={0} sx={{
                    width: '100%',
                    borderRadius: 4,
                    p: 5,
                    border: '1px solid #e3eaf2',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                    textAlign: 'center',
                }}>
                    <Box sx={{
                        width: 72, height: 72, borderRadius: '50%',
                        bgcolor: '#f0fdf4', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        mx: 'auto', mb: 3,
                    }}>
                        <MeetingRoomIcon sx={{ fontSize: 36, color: '#2e7d32' }} />
                    </Box>

                    <Typography variant="h5" fontWeight={700} mb={1}>
                        Join a Meeting
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={4}>
                        Enter the room ID shared by your doctor or patient.
                    </Typography>

                    <TextField
                        label="Room ID"
                        placeholder="e.g. AB12CD34"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                        fullWidth
                        autoFocus
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MeetingRoomIcon sx={{ color: '#2e7d32', fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': { borderRadius: 2 },
                        }}
                    />

                    <Button
                        variant="contained"
                        color="success"
                        size="large"
                        fullWidth
                        onClick={handleJoin}
                        disabled={!value.trim()}
                        sx={{ borderRadius: 2.5, fontWeight: 600, py: 1.5, mb: 1 }}
                    >
                        Join Meeting
                    </Button>

                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/meetings')}
                        sx={{ color: 'text.secondary' }}
                    >
                        Back to Meetings
                    </Button>
                </Paper>
            </Box>
        </Box>
    );
}

export default JoinMeetings;
