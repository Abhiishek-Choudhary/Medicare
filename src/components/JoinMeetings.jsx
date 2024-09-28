import { Box, Button, TextField,styled } from '@mui/material'
import React, { useState,useCallback } from 'react'
import { useNavigate } from 'react-router-dom';

const Container = styled(Box)`
   display: flex;
   margin-left:100px;
   margin-top: 300px;
`;

const StyledButton = styled(Button)`
   width: 100px;
   padding: 5px;
   margin-left: 5px;
`;

const JoinMeetings = () => {

  const [value, setValue] = useState();

  const navigate = useNavigate();

  const handleChange = useCallback(()=>{
    navigate(`/room/${value}`)
  },[navigate, value]);

  return (
    <Container>
        <Box>
            <TextField label="Enter room Id" 
            value={value}
            onChange={(e)=>setValue(e.target.value)}
            />
        </Box>
        <StyledButton onClick={handleChange} variant='contained'>Join</StyledButton>
    </Container>
  )
}

export default JoinMeetings