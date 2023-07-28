import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { FileUpload } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { fileTypes } from "../../constant/HomePage/fileType";
import { fileUploadFunction } from "../../function/fileUpload";
import { toast } from "react-hot-toast";
import { CircularProgress } from "@mui/material";

const ChatFileUploadSideBar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFile, setIsFile] = useState(true);

  const { auth } = useSelector((state) => ({ ...state }));
  const router = useRouter();

  const handleUploadFile = async (e) => {
    if (auth?.token) {
      try {
        setIsLoading(true);

        const file = e;
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await fileUploadFunction(auth.token, formData);

        console.log(data);
        setIsLoading(false);

        if (data) router.push(`/chat/${data}`);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
        toast.error(error.response.data.error || "Something went wrong");
      }
    } else {
      console.log("login to upload");
      toast.error("Login To Upload");
    }
  };
  return (
    <div className=" border-2 bg-[#fffaf2] items-center rounded-lg cursor-pointer">
      {isLoading ? (
        <div className="flex items-center p-3 flex-col">
          <CircularProgress size={"28px"} />
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default ChatFileUploadSideBar;
