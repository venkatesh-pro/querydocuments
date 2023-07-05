import axios from "axios";
import React from "react";
import { fileUploadFunction } from "../function/fileUpload";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const index = () => {
  const { auth } = useSelector((state) => ({ ...state }));

  const router = useRouter();

  const handleUploadFile = async (e) => {
    if (auth.token) {
      try {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await fileUploadFunction(auth.token, formData);

        console.log(data);
        if (data) router.push(`chat/${data}`);
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
