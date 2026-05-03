import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function Meetings() {
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafd' }}>
            <Navbar />

            <Box sx={{
                maxWidth: 860,
                mx: 'auto',
                px: 3,
                py: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Video Consultations
                    </Typography>
                    <Typography variant="body1" color="text.secondary" maxWidth={480} mx="auto">
                        Start an instant video call or join an existing meeting with your doctor or patient.
                    </Typography>
                </Box>

                {/* Cards */}
                <Box sx={{
                    display: 'flex',
                    gap: 4,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    width: '100%',
                }}>
                    {/* Create Meeting */}
                    <Paper elevation={0} sx={{
                        flex: '1 1 300px',
                        maxWidth: 360,
                        borderRadius: 4,
                        p: 5,
                        textAlign: 'center',
                        border: '1px solid #e3eaf2',
                        boxShadow: '0 4px 24px rgba(25,118,210,0.08)',
                        transition: 'box-shadow 0.2s',
                        '&:hover': { boxShadow: '0 8px 32px rgba(25,118,210,0.15)' },
                    }}>
                        <Box sx={{
                            width: 72, height: 72, borderRadius: '50%',
                            bgcolor: '#e3f0ff', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            mx: 'auto', mb: 3,
                        }}>
                            <VideoCallIcon sx={{ fontSize: 36, color: '#1976d2' }} />
                        </Box>
                        <Typography variant="h6" fontWeight={700} mb={1}>
                            Create Meeting
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={4} lineHeight={1.7}>
                            Start a new video consultation. Share the room ID with your doctor or patient to join.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={() => navigate('/create')}
                            sx={{ borderRadius: 2.5, fontWeight: 600, py: 1.5 }}
                        >
                            Start New Meeting
                        </Button>
                    </Paper>

                    {/* Join Meeting */}
                    <Paper elevation={0} sx={{
                        flex: '1 1 300px',
                        maxWidth: 360,
                        borderRadius: 4,
                        p: 5,
                        textAlign: 'center',
                        border: '1px solid #e3eaf2',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                        transition: 'box-shadow 0.2s',
                        '&:hover': { boxShadow: '0 8px 32px rgba(0,0,0,0.12)' },
                    }}>
                        <Box sx={{
                            width: 72, height: 72, borderRadius: '50%',
                            bgcolor: '#f0fdf4', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            mx: 'auto', mb: 3,
                        }}>
                            <MeetingRoomIcon sx={{ fontSize: 36, color: '#2e7d32' }} />
                        </Box>
                        <Typography variant="h6" fontWeight={700} mb={1}>
                            Join Meeting
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={4} lineHeight={1.7}>
                            Have a room ID? Enter it to join an ongoing consultation instantly.
                        </Typography>
                        <Button
                            variant="outlined"
                            size="large"
                            fullWidth
                            color="success"
                            onClick={() => navigate('/join')}
                            sx={{ borderRadius: 2.5, fontWeight: 600, py: 1.5, borderWidth: 1.5 }}
                        >
                            Join Existing Meeting
                        </Button>
                    </Paper>
                </Box>

                {/* Info bar */}
                <Box sx={{
                    mt: 6, display: 'flex', gap: 4, flexWrap: 'wrap',
                    justifyContent: 'center', color: 'text.secondary',
                }}>
                    {['HD Video & Audio', 'Screen Sharing', 'No Sign-up Required'].map(feature => (
                        <Typography key={feature} variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            ✓ {feature}
                        </Typography>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default Meetings;
