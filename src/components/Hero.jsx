import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  styled,
  TextField,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import React, { useState } from "react";
import { userDetails } from "../services/api";

const ImageContainer = styled(Box)`
  width: 500px;
  margin-left: 330px;
`;
const TextContainer = styled(Typography)`
  margin-left: 100px;
  margin-top: 50px;
  font-size: xx-large;
  font-weight: bold;
`;

const ButtonContainer = styled(Button)`
  position: relative;
  margin-left: 100px;
  margin-top: 20px;
  padding: 10px;
`;

const TextWrapper = styled(Typography)`
  margin-top: 240px;
  margin-left: 100px;
  color: grey;
`;

const DialogWrapper = styled(DialogTitle)`
  margin: auto;
  font-size: larger;
  font-weight: 600;
`;

const CustomButton = styled(Button)`
    margin-top: 10px;
    margin-bottom: 30px;
    width: 535px;
    margin-left: 25px;
`;

function Hero() {

  const [form,setForm] = useState({});
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onValueChange = (e)=> {
    setForm({...form,[e.target.name]: e.target.value});
  }

  const handleSubmit = async() => {
     const response = await userDetails(form);
     if(response){
      handleClose();
     }
     else return;
  };

  const url =
    "https://img.freepik.com/premium-photo/four-people-wearing-lab-coats-are-posing-photo_198067-951158.jpg?w=740";
  return (
    <>
      <Box className="flex mt-20 absolute">
        <TextContainer>
          Find & Book <span style={{ color: "blue" }}>Appointment</span> with
          <br /> your <span style={{ color: "blue" }}> favouriate </span>doctor.
        </TextContainer>
        <ImageContainer>
          <img style={{ borderRadius: "1rem" }} src={url} alt="doctor" />
        </ImageContainer>
      </Box>
      <TextWrapper>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Impedit quam
        illo nostrum alias,
        <br /> at sequi animi asperiores dolorem molestias laborum debitis
        harum, numquam,
        <br /> architecto dicta earum quibusdam soluta officiis ipsam iusto
        cumque commodi rerum
        <br /> nam? Non quo, quibusdam{" "}
      </TextWrapper>
      <ButtonContainer variant="contained" onClick={handleOpen}>
        Getting Started
      </ButtonContainer>
      <Dialog
        open={open}
         onClose={handleClose}
        fullWidth={750}
      >
        <DialogWrapper>Patient Form</DialogWrapper>
        <Box className="m-5">
          <TextField
            variant="outlined"
            label="firstname"
            style={{ marginLeft: 10 }}
            name="firstname"
            onChange={(e)=>onValueChange(e)}
          ></TextField>
          <TextField
            variant="outlined"
            label="lastname"
            style={{ marginLeft: 90 }}
            name="lastname"
            onChange={(e)=>onValueChange(e)}
          ></TextField>
        </Box>
        <Box className="m-5">
          <TextField
            variant="outlined"
            label="Age"
            style={{ marginLeft: 10 }}
            name="age"
            onChange={(e)=>onValueChange(e)}
          ></TextField>
          <TextField
            variant="outlined"
            label="Gender"
            style={{ marginLeft: 90 }}
            name="gender"
            onChange={(e)=>onValueChange(e)}
          ></TextField>
        </Box>
        <Box className="m-5">
          <TextField
            variant="outlined"
            label="Issues"
            style={{ marginLeft: 10, width: 535 }}
            name="issues"
            onChange={(e)=>onValueChange(e)}
          ></TextField>
        </Box>
        <Box className='m-7'>
          <Typography>Have you consulted any doctor before?</Typography>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
            >
              <FormControlLabel
                control={<Radio />}
                label="Yes"
                name="radio"
                onChange={(e)=>onValueChange(e)}
              />
              <FormControlLabel value="male" control={<Radio />} label="No" name="radio" onChange={(e)=>onValueChange(e)}/>
            </RadioGroup>
          </FormControl>
        </Box>
        <Box className="ml-6">
          <Typography style={{marginLeft:3,marginBottom:3}}>Any Precription/Medicine you are taking?</Typography>
          <TextField variant="outlined" style={{width:535}} name="precription" onChange={(e)=>onValueChange(e)}></TextField>
        </Box>
        <CustomButton variant="contained" onClick={()=>handleSubmit()}>Submit</CustomButton>
      </Dialog>
    </>
  );
}

export default Hero;
