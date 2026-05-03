import { Box, Typography, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

function Search({ search, setSearch }) {
    const navigate = useNavigate();

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') navigate('/doctors');
    };

    return (
        <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h5" fontWeight={700} mb={0.5}>
                Search <span style={{ color: '#1976d2' }}>Doctors</span>
            </Typography>
            <Typography color="text.secondary" mb={3}>
                Search your doctor and book an appointment in one click
            </Typography>
            <TextField
                placeholder="Search by name or specialty..."
                value={search || ''}
                onChange={(e) => setSearch?.(e.target.value)}
                onKeyDown={handleKeyDown}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                }}
                sx={{ width: 480, bgcolor: '#fff', borderRadius: 2 }}
            />
        </Box>
    );
}

export default Search;
