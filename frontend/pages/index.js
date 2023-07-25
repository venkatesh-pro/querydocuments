import axios from "axios";
import React, { useEffect, useState } from "react";

import Home from "../components/HomePage/Home";
import Pricing from "../components/HomePage/Pricing";
import api from "../utils/http-client";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const index = () => {
  const [country, setCountry] = useState("");
  const [planFromDb, setPlanFromDb] = useState("");

  const { auth } = useSelector((state) => ({ ...state }));
  const router = useRouter();

  const whichplanFunction = async () => {
    try {
      const { data } = await api.get(`/whichplan`, {
        headers: {
          authToken: auth.token,
        },
      });
      console.log("data", data);

      setPlanFromDb(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (auth?.token) {
      whichplanFunction();
    }
  }, [auth]);

  const getCountry = async () => {
    if (auth?.token) {
      try {
        const { data } = await api.get(`/paymentCheckoutpage`);
        console.log("data:", data);

        setCountry(data);
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    getCountry();
  }, []);

  return (
    <div className="w-full h-[92vh]">
      <Home planFromDb={planFromDb} />
      <Pricing planFromDb={planFromDb} country={country} />
    </div>
  );
};

export default index;
