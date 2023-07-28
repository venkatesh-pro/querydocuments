import React from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";

const PricingCard = ({ info, planFromDb, country }) => {
  const { auth } = useSelector((state) => ({ ...state }));

  const router = useRouter();
  const handleSubscribe = async () => {
    if (auth?.token) {
      sessionStorage.setItem("selectedPlan", info.plan.toLocaleLowerCase());
      router.push("/checkout");
    } else {
      router.push("/login");
    }
  };
  return (
    <Card
      style={{
        width: "260px",
        height: "300px",
        background: "#EEE6D8",
      }}
    >
      <CardContent>
        <div className="flex justify-between">
          <Typography gutterBottom variant="p" component="div">
            {info.plan}
          </Typography>
          <Typography
            gutterBottom
            variant="p"
            className="font-bold"
            component="div"
          >
            {country === "IN"
              ? `₹ ${info.indianPrice}`
              : `$${info.dollarPrice}`}
            /mo
          </Typography>
        </div>
        <div className="mt-9 flex flex-col">
          <Typography variant="p" color="text.secondary">
            {info.totalFilesPerDay} files/day
          </Typography>
          <Typography variant="p" color="text.secondary">
            {info.totalPagesPerFile} pages/file
          </Typography>
          <Typography variant="p" color="text.secondary">
            {info.totalQuestionPerDay} questions/day
          </Typography>

          {info.plan.toLocaleLowerCase() === "pro" && (
            <Typography variant="p" color="text.secondary">
              Put Any Website Url
            </Typography>
          )}
        </div>
        <div
          className={`${
            info.plan.toLocaleLowerCase() === "pro" ? "mt-14" : "mt-20"
          }`}
        >
          {planFromDb?.toLocaleLowerCase() === info.plan.toLocaleLowerCase() ? (
            <button className="w-full cursor-default bg-black p-2 rounded-xl text-white">
              Current Plan
            </button>
          ) : info.plan.toLocaleLowerCase() == "free" ? (
            <button
              disabled
              className="w-full block text-center bg-black p-2 rounded-xl text-white"
            >
              Default
            </button>
          ) : (
            <button
              onClick={handleSubscribe}
              className="w-full block text-center bg-black p-2 rounded-xl text-white"
            >
              Subscribe
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
