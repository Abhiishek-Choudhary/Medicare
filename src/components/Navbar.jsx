import React,{useContext} from 'react'
import { Box, Typography,styled,Button } from '@mui/material'
import {Link} from 'react-router-dom'

import { DataContext } from '../context/DataProvider'

const StyledBox = styled(Box)`
    display: flex;
    margin: 30px ;
    & > p{
       margin-left: 100px;
       margin-top: 5px;
       cursor: pointer;
    }
`

function Navbar() {

    const url2="https://img.freepik.com/premium-vector/avatar-portrait-young-caucasian-boy-man-round-frame-vector-cartoon-flat-illustration_551425-19.jpg"
     
    const url = 'https://marketplace.canva.com/EAE8eSD-Zyo/1/0/1600w/canva-blue%2C-white-and-green-medical-care-logo-oz1ox2GedbU.jpg'

    const {account} = useContext(DataContext);

    return (
    <Box className="flex shadow-lg rounded-md">
      <Box><img width={100} src={url} alt='logo'/></Box>
      <StyledBox>
        <Typography>Home</Typography>
        <Typography><Link to='/profile'>About</Link></Typography>
        <Typography>Doctor</Typography>
        <Typography>Payments</Typography>
      </StyledBox>
      {
        // <img src={url2} alt='profile' style={{width:50, marginLeft:660, cursor:'pointer'}}/> 
        <Button style={{marginLeft: 650 }}><Link to='/login'>Login</Link></Button>
      }
    </Box>
  )
}

export default Navbar