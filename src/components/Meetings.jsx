import React from 'react'
import { Box,styled } from '@mui/material'
import { Link } from 'react-router-dom';

const Container = styled(Box)`
   display: flex;
   margin: auto;
   margin-left: 400px;
   margin-top: 200px;
`;


function Meetings() {
  return (
    <>
    <Container>
       <Box className="bg-blue-600 text-white p-20 rounded-md shadow-2xl text-xl mr-10 cursor-pointer"><Link to='/create'> Create Meeting </Link></Box>
       <Box className=" p-20 rounded-md shadow-xl text-xl ml-20 cursor-pointer"><Link to='/join'>Join Meeting</Link></Box>
     </Container>
    </>
  )
}

export default Meetings