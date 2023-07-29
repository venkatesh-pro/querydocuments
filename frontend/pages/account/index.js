import axios from "axios";
import React, { useEffect, useState } from "react";
import Pricing from "../../components/AccountPage/Pricing";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const index = () => {
  const [isUser, setIsUser] = useState(false);

  const { auth } = useSelector((state) => ({ ...state }));
  const router = useRouter();

  useEffect(() => {
    if (!auth?.token) {
      router.push("/login");
    }
  }, [auth]);
  useEffect(() => {
    if (auth?.token) {
      setIsUser(true);
    }
  }, [auth]);
  return (
    <div className="w-full h-[92vh]">
      {isUser && auth?.token ? (
        <Pricing />
      ) : (
        <div className="items-center flex justify-center h-[92vh]">
          Login To see
        </div>
      )}
    </div>
  );
};

export default index;
