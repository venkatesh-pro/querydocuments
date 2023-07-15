import React from "react";
import { FileUploader } from "react-drag-drop-files";
import { FileUpload } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import PricingCard from "./Cards/Pricing";
import MobileViewPricingCard from "./Cards/MobileViewPricing";

const Pricing = ({ fileTypes, handleUploadFile }) => {
  const isDesktop = useMediaQuery("(min-width:768px)");
  const pricingInfo = [
    {
      plan: "Free",
      price: 0,
      totalFilesPerDay: 3,
      totalPagesPerFile: 20,
      totalQuestionPerDay: 30,
    },
    {
      plan: "Basic",
      price: 3,
      totalFilesPerDay: 5,
      totalPagesPerFile: 100,
      totalQuestionPerDay: 100,
    },
    {
      plan: "Pro",
      price: 15,
      totalFilesPerDay: 7,
      totalPagesPerFile: 500,
      totalQuestionPerDay: 300,
    },
  ];

  return (
    <div id="pricing" className="h-[80vh] flex flex-col items-center  ">
      <div>
        <h1 className="flex flex-col text-center text-3xl ">Pricing</h1>
      </div>
      {/* <div className="mt-10 ">{isDesktop ? "desktop" : "mobile"}</div> */}
      {isDesktop && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 mt-16">
          {pricingInfo.map((info) => {
            return <PricingCard info={info} />;
          })}
        </div>
      )}

      {!isDesktop && (
        <div className="mt-16">
          <MobileViewPricingCard pricingInfo={pricingInfo} />
        </div>
      )}
    </div>
  );
};

export default Pricing;
