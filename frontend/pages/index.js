import axios from "axios";
import React from "react";
import { fileUploadFunction } from "../function/fileUpload";
import { useSelector } from "react-redux";

const index = () => {
  const { auth } = useSelector((state) => ({ ...state }));

  const handleUploadFile = async (e) => {
    if (auth.token) {
      try {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await fileUploadFunction(auth.token, formData);

        console.log(data);
      } catch (error) {
        console.log(error);
      }
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
