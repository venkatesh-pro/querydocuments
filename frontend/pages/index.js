import axios from "axios";
import React from "react";
import { fileUploadFunction } from "../function/fileUpload";
import { useSelector } from "react-redux";

const index = () => {
  const { auth } = useSelector((state) => ({ ...state }));

  const handleUploadFile = async (e) => {
    if(auth.token){
      const { data } = await fileUploadFunction(auth.token);

      console.log(data);
    }
  };
  return (
    <div>
      <h1>Upload file</h1>
      <input type="file" onChange={handleUploadFile} />
    </div>
  );
};

export default index;
