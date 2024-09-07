import React from 'react'
import { useState,useContext } from 'react';
import { Box,TextField,styled,Button, Typography } from '@mui/material';
import { Link,useNavigate } from 'react-router-dom';
import { authenticateSignUp } from '../services/api';

// import { DataContext } from '../context/DataProvider';

const StyledBox = styled(Box)`
    margin: auto;
    display: flex;
    flex-direction: column;
    margin-right: 200px;
    height: 50%;
    width: 30%;
`;

const InputFeild = styled(TextField)`
  margin-bottom: 20px;
`

const CustomButton = styled(Button)`
   padding: 10px;
`;

const RandomBox = styled(Box)`
    display: flex;
    margin-top: 5px;
    color: #0188ff;
`

const signupInitialValues = {
    username:'',
    email: '',
    password: '',
}

function Register() {
  
    const [signup, setSignUp] = useState(signupInitialValues);

    const url =
    "https://boldist.co/wp-content/uploads/2023/06/What-Is-Social-Login-and-Does-Your-Business-Need-It_.jpg";
  
    const navigate = useNavigate();

    // const {setAccount} = useContext(DataContext);

    const onInputChange = (e) => {
         setSignUp({...signup,[e.target.name]:e.target.value})
    }

    const handleSubmit = async() => {
       let response = await authenticateSignUp(signup);
       if(response){
        //  setAccount(signup.username);
         navigate('/login');
       }
      else return;
    }

  return (
        <Box className="flex">
          <Box>
            <img
              src={url}
              alt="Hospital"
              style={{ width: "80%", height: "100vh" }}
            />
          </Box>
          <StyledBox>
            <InputFeild onChange={(e)=>onInputChange(e)} label="Username" name="username">
            </InputFeild>
            <InputFeild onChange={(e)=>onInputChange(e)} label="Email" name="email">
            </InputFeild>
            <InputFeild onChange={(e)=>onInputChange(e)} label="Password" name="password">
            </InputFeild>
            <CustomButton variant="contained" onClick={()=>handleSubmit()}>
              Register
            </CustomButton>
            <RandomBox>
            <Typography>Already Registered User</Typography>
            <Typography style={{marginLeft: '120px',cursor: 'pointer'}}><Link to="/login">Login</Link></Typography>
            </RandomBox>
          </StyledBox>
        </Box>
  )
}

export default Register