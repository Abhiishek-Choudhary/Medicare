import { Typography,Box, Link, styled } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import PinterestIcon from '@mui/icons-material/Pinterest';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import React from 'react'

const Container = styled(Typography)`
    margin-left: 18px;
    font-size: x-large;
    font-weight: 600;
`

const StyledLinks = styled(Link)`
    color:grey;
    text-decoration: none;
    cursor: pointer;
    margin-top: 5px;
    padding: 10px;
`

const RightsContainer = styled(Typography)`
     margin-left: 540px;
     font-size: x-large;
     font-weight: 700;
     color: gainsboro;
`;

function Footer() {
  return (
    <>
    <Box className='flex mt-52 shadow-2xl rounded-lg'>
        <Box className='flex flex-col ml-32 mt-10'>
            <Container>Quick Links</Container>
            <StyledLinks to='#'><ChevronRightIcon/>Home</StyledLinks>
            <StyledLinks to='#'><ChevronRightIcon/>Services</StyledLinks>
            <StyledLinks to='#'><ChevronRightIcon/>About</StyledLinks>
            <StyledLinks to='#'><ChevronRightIcon/>Doctors</StyledLinks>
            <StyledLinks to='#'><ChevronRightIcon/>Medicines</StyledLinks>
            <StyledLinks to='#'><ChevronRightIcon/>Reviews</StyledLinks>
        </Box>
        <Box className='flex flex-col ml-44 mt-10'>
            <Container>Our Services</Container>
            <StyledLinks to='#'><ChevronRightIcon/>Dental Care</StyledLinks>
            <StyledLinks to='#'><ChevronRightIcon/>Cardiology</StyledLinks>
            <StyledLinks to='#'><ChevronRightIcon/>Diagnosis</StyledLinks>
            <StyledLinks to='#'><ChevronRightIcon/>Ambulance Service</StyledLinks>
        </Box>
        <Box className='flex flex-col ml-44 mt-10'>
            <Container>Contact Info</Container>
            <StyledLinks to='#'><PhoneIcon/>+91 7894576321</StyledLinks>
            <StyledLinks to='#'><PhoneIcon/>+91 8976788643</StyledLinks>
            <StyledLinks to='#'><EmailIcon/> Diagnosis</StyledLinks>
            <StyledLinks to='#'><AddLocationIcon/>Ambulance Service</StyledLinks>
        </Box>
        <Box className='flex flex-col ml-44 mt-10'>
            <Container>Follow Us</Container>
            <StyledLinks to='#'><FacebookIcon/> Facebook</StyledLinks>
            <StyledLinks to='#'><TwitterIcon/> Twitter</StyledLinks>
            <StyledLinks to='#'><InstagramIcon/> Instagram</StyledLinks>
            <StyledLinks to='#'><PinterestIcon/> Pinterest</StyledLinks>
        </Box>
    </Box>
    <br/>
    <Box>
        <RightsContainer>All Rights Reserverd!! No CopyRight</RightsContainer>
    </Box>
    </>
  )
}

export default Footer