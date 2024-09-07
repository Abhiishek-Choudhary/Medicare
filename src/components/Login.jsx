import { useState } from 'react';
import { Box,TextField,styled,Button, Typography } from '@mui/material';
import {Link,useNavigate} from 'react-router-dom'
import { authenticateLogin } from '../services/api';


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

const loginInitailvalues = {
    email:'',
    password:'',
}

function Login() {

  const [login, setLogin] = useState(loginInitailvalues);

  const navigate = useNavigate();

  const onValueChange = (e)=> {
      setLogin({...login,[e.target.name]: e.target.value});
  }

  const handleSubmit = async() => {
      const response = await authenticateLogin(login);
      console.log(response);
      if(response){
        navigate('/');
      }
      else return;
  }

  const url =
    "https://boldist.co/wp-content/uploads/2023/06/What-Is-Social-Login-and-Does-Your-Business-Need-It_.jpg";

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
        <InputFeild label="Email" name="email" onChange={(e)=>onValueChange(e)}>
        </InputFeild>
        <InputFeild label="Password" name="password" onChange={(e)=>onValueChange(e)}>
        </InputFeild>
        <CustomButton variant="contained" onClick={()=>handleSubmit()}>
          Login
        </CustomButton>
        <Box className="flex">
        <Typography style={{marginTop:4}}>New user</Typography>
        <Link className='ml-52 mt-1 text-blue-500' to="/register">Register</Link>
        </Box>
      </StyledBox>
    </Box>
  );
}

export default Login;
