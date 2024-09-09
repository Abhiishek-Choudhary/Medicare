import User from "../model/UserSchema.js";

export const userSignUp = async (request, response) => {
  try {
    const exsit = await User.findOne({ username: request.body.username });
    if (exsit) {
      return response.status(401).json({ message: "User already exists" });
    }
    const user = request.body;
    const newUser = new User(user);
    await newUser.save();
    response.status(200).json({ mesage: user });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const userLogin = async (request, response) => {
  try {
    let user = await User.findOne({ email: request.body.email, password: request.body.password });
    if(user){
      return response.status(200).json(`${request.body.username} login successful`);
    }
    else{
      return response.status(401).json('Invalid Login');
    }
  } catch (error) {
     response.status(500).json('Error: ',error.message);
  }
};
