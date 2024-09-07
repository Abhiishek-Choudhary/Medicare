import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Search from "./Search";
import Card from "./Card";

import { Box } from "@mui/material";

import { getDoctors } from "../redux/action/doctorAction";

import { useDispatch, useSelector } from "react-redux";
import Footer from "./Footer";
import DataProvider from "../context/DataProvider";

function Home() {

  const { doctors } = useSelector((state) => state.getDoctors);
  console.log(doctors);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDoctors());
  }, [dispatch]);

  return (
    <>
    <DataProvider>
      <Navbar />
      <Hero />
      <Search />
      <Box className="flex ml-28 mt-10 ">
        <Card doctors={doctors}/>
        <Box style={{marginLeft: 15}}>
        <Card doctors={doctors} />
        </Box>
      </Box>
      <Footer/>
      </DataProvider>
    </>
  );
}

export default Home;
