
import React from 'react'
import PhoneIcon from '@mui/icons-material/Phone';
import MailIcon from '@mui/icons-material/Mail';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import SearchAppBar from './SearchAppBar'
import { Box, Typography,Chip, Button } from '@mui/material'

function Profile() {

  const url = "https://www.shutterstock.com/image-photo/profile-photo-attractive-family-doc-600nw-1724693776.jpg"

  return (
    <>
       <SearchAppBar/>
       <Box className="flex m-10 h-44 rounded-xl shadow-md" >
         <img className='rounded-xl m-4' src={url} alt='doctor'/>
        <Box className="m-6">
         <Box className="flex ">
          <Typography style={{marginRight:5,marginLeft:5,marginTop:1.5}}>Dr. Preeti Singh</Typography>
          <Box className="mr-2 "><PhoneIcon/></Box>
          <Box className="mr-2"><MailIcon/> </Box>   
        </Box> 
        <Box className="flex mt-3">
         <Box className="text-sm mr-1"><PersonIcon/></Box><Typography style={{marginRight:5,color:'grey'}}>Male</Typography>    
         <Box className="text-sm mr-1"><LocationOnIcon/></Box><Typography style={{marginRight:5,color:'grey'}}>NewYork US</Typography>    
         <Box className="text-sm mr-1"><AccountBalanceIcon/></Box><Typography style={{marginRight:5,color:'grey'}}>₹4000</Typography>    
         <Box className="text-sm mr-1"><CalendarMonthIcon/></Box><Typography style={{marginRight:5,color:'grey'}}>08 March 2000</Typography>    
        </Box> 
        <Box className="flex">
          <Box className="shadow-sm bg-slate-100 " style={{width: 100, height:50, marginTop:20}}>
            <Typography style={{marginLeft: 8, marginTop:3,fontSize:14,fontWeight:600}}>22.4</Typography>
            <Box className='flex ml-2 text-gray-500'>
             <Typography>BMI</Typography>
             <Box className='text-green-500'><ArrowDropDownIcon/>10</Box> 
            </Box>
           </Box>    
           <Box className="shadow-sm bg-slate-100" style={{ width: 100, height:50, marginTop:20, marginLeft:65}}>
           <Typography style={{marginLeft:3 ,marginTop:3,fontSize:14,fontWeight:600}}>92kg</Typography>
            <Box className='flex text-gray-500'>
             <Typography style={{marginLeft:3}}>Weight</Typography>
             <Box className='text-green-500 '><ArrowDropDownIcon/>10</Box> 
            </Box>
           </Box>     
          <Box className="flex flex-col shadow-sm bg-slate-100" style={{display:'flex', width: 100, height:50, marginTop:20, marginLeft:65}}>
            <Typography style={{marginLeft:8,marginTop:3,fontSize:14,fontWeight:600}}>175 CM</Typography>
            <Typography style={{marginLeft:10,color: 'grey'}}>Height</Typography>
          </Box>    
          <Box className="bg-slate-100" style={{ width: 160, height:50, marginTop:20,marginLeft:65}}>
            <Typography style={{marginLeft:3,marginTop:3,fontSize:14,fontWeight:600}}>120/80</Typography>
            <Box className='flex'>
             <Typography style={{marginLeft:4,color:'grey'}}>Blood Presure</Typography>
             <Box className='text-red-500'><ArrowDropUpIcon/>10</Box> 
            </Box>
           </Box>     
        </Box> 
        </Box> 
        <Box className="ml-60 mt-3">
          <Box className="ml-36 "><Button variant='contained'>Edit</Button></Box>
          <Typography style={{marginLeft:130,marginTop:3,fontSize:14,fontWeight:600}}>Own Diagnosis</Typography>  
          <Box className="ml-10">
            <Chip label="Obesity"/>
            <Chip label="Uncontrolled type2"/>
          </Box>
          <Typography style={{marginLeft:130,fontSize:14,fontWeight:600}}>Health Barriers</Typography>
          <Box>
            <Chip label="Fear of medication"/>
            <Chip label="Fear of Insulin"/>
          </Box>
        </Box> 
       </Box>    
    </>
  )
}

export default Profile