import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { FileUpload } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import PricingCard from "./Cards/Pricing";
import { pricingInfo } from "../../constant/HomePage/Pricing";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import api from "../../utils/http-client";
import { toast } from "react-hot-toast";

const Pricing = ({ fileTypes, handleUploadFile }) => {
  const isDesktop = useMediaQuery("(min-width:768px)");

  const [planFromDb, setPlanFromDb] = useState("");
  const { auth } = useSelector((state) => ({ ...state }));
  const router = useRouter();

  const handleCancelSubscription = async () => {
    try {
      if (confirm("Are you sure, Want to Cancel your Subscription")) {
        console.log("clicked");
        // post for security reason
        const { data } = await api.post(
          `/cancelSubscribe`,
          {},
          {
            headers: {
              authToken: auth.token,
            },
          }
        );

        console.log(data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error || "Something went wrong");
    }
  };
  const whichplanFunction = async () => {
    try {
      const { data } = await api.get(`/whichplan`, {
        headers: {
          authToken: auth.token,
        },
      });
      console.log("data", data);

      setPlanFromDb(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (auth?.token) {
      whichplanFunction();
    }
  }, [auth]);
  return planFromDb === "free" ? (
    <div className="h-[80vh] flex items-center justify-center">
      Subscribe to See the page
    </div>
  ) : (
    <div
      id="pricing"
      className="h-[80vh] flex flex-col items-center  justify-center"
    >
      <div>
        <h1 className="flex flex-col text-center text-xl ">
          Current Plan You Subscribed
        </h1>
        <h1 className="flex mt-3 flex-col text-center text-3xl ">
          {planFromDb.toUpperCase()}
        </h1>
      </div>
      <div className="mt-10">
        {pricingInfo.map((info, i) => {
          if (
            info.plan.toLocaleLowerCase() === planFromDb.toLocaleLowerCase()
          ) {
            return (
              <PricingCard
                key={i}
                info={info}
                handleCancelSubscription={handleCancelSubscription}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default Pricing;
