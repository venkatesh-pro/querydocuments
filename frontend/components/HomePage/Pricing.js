import React from "react";
import { FileUploader } from "react-drag-drop-files";
import { FileUpload } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import PricingCard from "./Cards/Pricing";
import MobileViewPricingCard from "./Cards/MobileViewPricing";
import { pricingInfo } from "../../constant/HomePage/Pricing";

const Pricing = ({ planFromDb }) => {
  const isDesktop = useMediaQuery("(min-width:768px)");

  return (
    <div id="pricing" className="h-[80vh] flex flex-col items-center  ">
      <div>
        <h1 className="flex flex-col text-center text-3xl ">Pricing</h1>
      </div>
      {/* <div className="mt-10 ">{isDesktop ? "desktop" : "mobile"}</div> */}
      {isDesktop && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 mt-16">
          {pricingInfo.map((info) => {
            return <PricingCard info={info} planFromDb={planFromDb} />;
          })}
        </div>
      )}

      {!isDesktop && (
        <div className="mt-16">
          <MobileViewPricingCard
            pricingInfo={pricingInfo}
            planFromDb={planFromDb}
          />
        </div>
      )}
    </div>
  );
};

export default Pricing;
