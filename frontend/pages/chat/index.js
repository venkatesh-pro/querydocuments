import React, { useEffect, useState } from "react";
import AllQueryUpload from "../../components/ChatPage/AllQueryUpload";
import Chat from "../../components/ChatPage/Chat";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import {
  getAllUploadsFunction,
  sendMessageFunction,
} from "../../function/queryUpload";

const index = () => {
  const [allUploads, setAllUploads] = useState([]);

  const router = useRouter();
  const { auth } = useSelector((state) => ({ ...state }));

  const getAllUploads = async () => {
    const { data } = await getAllUploadsFunction(auth.token);
    setAllUploads(data);
  };
  useEffect(() => {
    if (auth?.token) {
      getAllUploads();
    }
  }, [auth]);

  return (
    <div className="flex">
      {allUploads.length > 0 && (
        <>
          <AllQueryUpload
            allUploads={allUploads}
            setAllUploads={setAllUploads}
          />

          <div>we need to add upload pdf feature here</div>
        </>
      )}
    </div>
  );
};

export default index;
