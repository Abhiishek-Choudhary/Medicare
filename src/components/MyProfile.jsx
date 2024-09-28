import React, { useEffect, useState } from 'react'
import {styled, Table, TableHead, TableRow, TableBody,TableCell} from '@mui/material'
import { getUserDetails } from '../services/api';

const TableRowWrapper = styled(TableRow)`
   margin-left: 50px;
`

function MyProfile() {

    const [users,setUsers] = useState([]);
    const [id,setId] = useState(0);


   useEffect(()=>{
       const UserDetails = async() => {
          let response = await getUserDetails();
          setUsers(response.data);
       }
       UserDetails();
   },[])
  
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Id</TableCell>
          <TableCell>Firstname</TableCell>
          <TableCell>Lastname</TableCell>
          <TableCell>Age</TableCell>
          <TableCell>Gender</TableCell>
          <TableCell>Issue</TableCell>
          <TableCell>Precription</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
           users.map(user=>(
            <TableRowWrapper >
              <TableCell>{id}</TableCell>
              <TableCell>{user.firstname}</TableCell>
              <TableCell>{user.lastname}</TableCell>
              <TableCell>{user.age}</TableCell>
              <TableCell>{user.gender}</TableCell>
              <TableCell>{user.issues}</TableCell>
              <TableCell>{user.precription}</TableCell>
            </TableRowWrapper>
           ))
        }
      </TableBody>
    </Table>
  )
}

export default MyProfile