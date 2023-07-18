import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { FileUpload } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { fileTypes } from "../../constant/HomePage/fileType";
import { fileUploadFunction } from "../../function/fileUpload";

const ChatFileUploadSideBar = () => {
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
        if (data) router.push(`/chat/${data}`);
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
        <div className="flex border-2 bg-[#fffaf2] p-3 items-center rounded-lg cursor-pointer">
          <FileUpload fontSize="small" />
          <h3>Drop File Here</h3>
        </div>
      </FileUploader>
    </>
  );
};

export default ChatFileUploadSideBar;
