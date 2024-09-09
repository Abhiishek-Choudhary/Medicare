import React, { useEffect, useState } from 'react'
import {Box,styled,Avatar, Typography} from '@mui/material'
import { getUserDetails } from '../services/api';

const Wrapper = styled(Box)`
    margin-left: 30px;
    margin-top: 50px;
`;

function MyProfile() {

    const [users,setUsers] = useState([]);

   useEffect(()=>{
       const UserDetails = async() => {
          let response = await getUserDetails();
          setUsers(response.data);
       }
       UserDetails();
   })

  return (
    <Wrapper className="rounded-lg shadow-lg w-72 h-auto bg-sky-100">
      <Box style={{marginLeft: 120,paddingTop:5}}>
        <Avatar/>
      </Box>
      <Box>
        {
            users.map(user=>(
                <>
                    <Box style={{display:'flex',marginLeft:65,padding:5}}>
                        <Typography style={{marginRight:5}}>{user.firstname}</Typography>
                        <Typography style={{marginRight:5}}>{user.age}</Typography>
                        <Typography>{user.gender}</Typography>
                    </Box>
                    <Box className="m-7">
                        <Typography>{user.issues}</Typography>
                        <Typography style={{marginTop:5, paddingBottom:10,paddingTop:10}}>{user.precription}</Typography>
                    </Box>
                    </>
            ))
        }
      </Box>
    </Wrapper>
  )
}

export default MyProfile