import axios from 'axios';

const url = 'http://localhost:8000';

export const authenticateSignUp = async(user)=>{
    try{
       return await axios.post(`${url}/signup`,user);
    }catch(error){
        console.log('Error while calling the signup api ',error);
    }
}

export const authenticateLogin = async(user)=>{
    try{
       return await axios.post(`${url}/login`,user);
    }catch(error){
        console.log('Error while calling the login api ',error);
    }
}

export const userDetails = async(user)=>{
    try{
      return await axios.post(`${url}/details`,user);
    }catch(error){
        console.log('Error while calling the details api',error);
    }
}

export const getUserDetails = async()=>{
    try{
      return await axios.get(`${url}/profile`);
    }
    catch(error){
        console.log(`Error while calling the get user details api`,error);
    }
}