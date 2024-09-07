import { Input,Box,styled,Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import React from 'react'

const SearchContainer = styled(Box)`
    margin-top: 70px;
    margin-left: 500px;
    &>p{
       font-size: x-large
    }
`

function Search() {
  return (
    <>
     <SearchContainer>
        <Typography><b style={{marginLeft: 200}}>Search <span style={{color: 'blue'}}> Doctors </span></b></Typography>
        <Typography style={{color: 'grey'}}>Search your doctor and book appointment in one click</Typography>
        <Box><SearchIcon/><input style={{padding: 7, marginTop: 10, width: 525, borderRadius: '20px', border: '1px solid grey'}} type='text' placeholder='Search Doctor' /></Box>
     </SearchContainer>
     <Box></Box>
    </>
  )
}

export default Search