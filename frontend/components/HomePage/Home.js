import React from "react";
import { FileUploader } from "react-drag-drop-files";
import { FileUpload } from "@mui/icons-material";
const Home = ({ fileTypes, handleUploadFile }) => {
  return (
    <div
      id="home"
      className="h-[100vh] mt-[-40px] w-full  flex flex-col items-center justify-center "
    >
      <div>
        <h1 className="flex flex-col text-center sm:text-3xl text-xl ">
          <span>Query Your documents.</span>
          <span>And</span>
          <span> Any Website Link</span>
        </h1>
      </div>
      <div className="mt-10 w-full flex justify-center">
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
      </div>
    </div>
  );
};

export default Home;
