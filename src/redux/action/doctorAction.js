import axios from "axios";
import * as actionTypes from '../constants/doctorConstants';

const BASE_URL = 'https://medicare2-0.onrender.com';

export const getDoctors = () => async (dispatch) => {
    try {
        dispatch({ type: actionTypes.GET_DOCTOR_REQUEST });
        const { data } = await axios.get(`${BASE_URL}/alldoctors`);
        dispatch({ type: actionTypes.GET_DOCTOR_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: actionTypes.GET_DOCTOR_FAIL, payload: error.message });
    }
};
