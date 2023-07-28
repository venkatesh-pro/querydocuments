import axios from "axios";
import React, { useEffect, useState } from "react";
import Pricing from "../../components/AccountPage/Pricing";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const index = () => {
  const { auth } = useSelector((state) => ({ ...state }));
  const router = useRouter();

  useEffect(() => {
    if (!auth?.token) {
      router.push("/login");
    }
  }, [auth]);
  return (
    <div className="w-full h-[92vh]">
      {auth?.token ? (
        <Pricing />
      ) : (
        <div className="items-center flex justify-center h-[92vh]">
          Login To see
        </div>
      )}
    </div>
  );
};

export default index;
