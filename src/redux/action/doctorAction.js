
import axios from "axios";

import * as actionTypes from '../constants/doctorConstants';

const url='http://localhost:8000';

export const getDoctors = () => async(dispatch) => {
    try{
      const { data } = await axios.get(`${url}/doctor`);
      dispatch({ type: actionTypes.GET_DOCTOR_SUCCESS, payload: data})
    }catch(error){
        dispatch({ type: actionTypes.GET_DOCTOR_FAIL, payload: error.message})
    }
}