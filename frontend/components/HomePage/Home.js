import React from "react";
import { FileUploader } from "react-drag-drop-files";
import FileUploadComponent from "../FileUpload/FileUploadComponent";
const Home = () => {
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
        <FileUploadComponent />
      </div>
    </div>
  );
};

export default Home;
