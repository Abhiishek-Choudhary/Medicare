import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Snackbar, Alert, Divider } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function CreateMeetings() {
    const navigate = useNavigate();
    const [roomId] = useState(() => Math.random().toString(36).slice(2, 10).toUpperCase());
    const [copied, setCopied] = useState(false);

    const roomLink = `${window.location.origin}/room/${roomId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(roomLink);
        setCopied(true);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafd' }}>
            <Navbar />

            <Box sx={{
                maxWidth: 520,
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
                    boxShadow: '0 4px 24px rgba(25,118,210,0.08)',
                    textAlign: 'center',
                }}>
                    <Box sx={{
                        width: 72, height: 72, borderRadius: '50%',
                        bgcolor: '#e3f0ff', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        mx: 'auto', mb: 3,
                    }}>
                        <VideoCallIcon sx={{ fontSize: 36, color: '#1976d2' }} />
                    </Box>

                    <Typography variant="h5" fontWeight={700} mb={1}>
                        Your Meeting is Ready
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={4}>
                        Share the room ID or link below with your doctor or patient before starting.
                    </Typography>

                    {/* Room ID */}
                    <Box sx={{
                        bgcolor: '#f0f7ff', border: '1px dashed #90caf9',
                        borderRadius: 2, px: 3, py: 2, mb: 2,
                    }}>
                        <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                            Room ID
                        </Typography>
                        <Typography variant="h5" fontWeight={700} letterSpacing={3} color="#1976d2">
                            {roomId}
                        </Typography>
                    </Box>

                    {/* Copy link */}
                    <Button
                        variant="outlined"
                        startIcon={<ContentCopyIcon />}
                        onClick={handleCopy}
                        fullWidth
                        sx={{ borderRadius: 2, mb: 3, fontWeight: 600 }}
                    >
                        Copy Meeting Link
                    </Button>

                    <Divider sx={{ mb: 3 }}>
                        <Typography variant="caption" color="text.secondary">then</Typography>
                    </Divider>

                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={() => navigate(`/room/${roomId}`)}
                        sx={{ borderRadius: 2.5, fontWeight: 600, py: 1.5 }}
                    >
                        Join This Meeting
                    </Button>

                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/meetings')}
                        sx={{ mt: 2, color: 'text.secondary' }}
                    >
                        Back to Meetings
                    </Button>
                </Paper>
            </Box>

            <Snackbar
                open={copied}
                autoHideDuration={2500}
                onClose={() => setCopied(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>
                    Meeting link copied to clipboard!
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default CreateMeetings;
