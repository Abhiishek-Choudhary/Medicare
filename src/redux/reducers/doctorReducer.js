import * as actionType from '../constants/doctorConstants'

export const getDoctorReducer = (state = { doctors: [] }, action) => {
     switch(action.type){
        case actionType.GET_DOCTOR_SUCCESS:
            return { doctors: action.payload }
        case actionType.GET_DOCTOR_FAIL:
            return { error: action.payload }
        default:
            return state;
     }
}