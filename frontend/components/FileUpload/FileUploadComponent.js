import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { FileUpload } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { fileTypes } from "../../constant/HomePage/fileType";
import { fileUploadFunction } from "../../function/fileUpload";
import UrlModal from "./UrlModal/UrlModal";
import { toast } from "react-hot-toast";
import { CircularProgress } from "@mui/material";

const FileUploadComponent = ({ planFromDb }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFile, setIsFile] = useState(true);
  const [isUrlModal, setIsUrlModal] = useState(false);

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

        if (data) router.push(`chat/${data}`);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
        toast.error(error.response.data.error || "Something went wrong");
      }
    } else {
      toast.error("Login To Upload");
      console.log("login to upload");
    }
  };

  const openUrlModal = () => {
    setIsUrlModal(true);
  };
  return (
    <div className="relative">
      <div className="sm:w-[600px] w-[90vw] h-[300px] border-2 items-center justify-center flex flex-col  bg-[#EEE6D8] relative rounded-2xl">
        {isLoading ? (
          <div className="flex items-center flex-col">
            <CircularProgress />
            <p>Please Stay, it takes some time</p>
          </div>
        ) : (
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
        )}
      </div>

      {planFromDb.toLocaleLowerCase() === "pro" && (
        <p
          onClick={openUrlModal}
          className="p-3 cursor-pointer absolute bottom-0 right-0 text-sm"
        >
          From Url
        </p>
      )}
      <UrlModal open={isUrlModal} setOpen={setIsUrlModal} />
    </div>
  );
};

export default FileUploadComponent;
