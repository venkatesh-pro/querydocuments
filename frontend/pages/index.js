import axios from "axios";
import React, { useState } from "react";
import { fileUploadFunction } from "../function/fileUpload";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Home from "../components/HomePage/Home";
import Pricing from "../components/HomePage/Pricing";

const fileTypes = ["pdf", "doc", "docx"];

const index = () => {
  const [isFile, setIsFile] = useState(true);

  const { auth } = useSelector((state) => ({ ...state }));

  const router = useRouter();

  const handleUploadFile = async (e) => {
    if (auth?.token) {
      try {
        const file = e;

        const formData = new FormData();
        formData.append("file", file);
        const { data } = await fileUploadFunction(auth.token, formData);

        console.log(data);
        if (data) router.push(`chat/${data}`);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("login to upload");
    }
  };
  return (
    <div className="w-full h-[92vh]">
      <Home fileTypes={fileTypes} handleUploadFile={handleUploadFile} />
      <Pricing />
    </div>
  );
};

export default index;
