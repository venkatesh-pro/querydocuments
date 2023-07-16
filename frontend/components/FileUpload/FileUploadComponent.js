import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { FileUpload } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { fileTypes } from "../../constant/HomePage/fileType";
import { fileUploadFunction } from "../../function/fileUpload";

const FileUploadComponent = () => {
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
    <>
      <FileUploader
        handleChange={handleUploadFile}
        name="file"
        types={fileTypes}
      >
        <div className="cursor-pointer  sm:w-[600px] w-[90vw] h-[300px] border-2 items-center justify-center flex flex-col  bg-[#EEE6D8] relative rounded-2xl">
          <FileUpload fontSize="large" />
          <h3>Drop File</h3>
          <p>
            Accepts:{" "}
            {fileTypes.map((type, i) => {
              return `${i > 0 ? "," : ""}${type}`;
            })}
          </p>
        </div>
      </FileUploader>
    </>
  );
};

export default FileUploadComponent;
