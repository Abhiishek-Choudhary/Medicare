
import Doctor from '../model/DoctorSchema.js'

export const getDoctor = async(request,response) => {
    try{
      const doctor = await Doctor.find({});

      response.status(200).json(doctor);
    }catch(error){
        response.status(500).json({ message: error.message });
    }
}