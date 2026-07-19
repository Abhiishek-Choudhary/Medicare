import * as actionType from '../constants/doctorConstants';

export const getDoctorReducer = (state = { doctors: [], loading: true }, action) => {
    switch (action.type) {
        case actionType.GET_DOCTOR_REQUEST:
            return { ...state, loading: true };
        case actionType.GET_DOCTOR_SUCCESS:
            return { doctors: action.payload, loading: false };
        case actionType.GET_DOCTOR_FAIL:
            return { doctors: [], loading: false, error: action.payload };
        default:
            return state;
    }
};
