import React from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";

const PricingCard = ({ info }) => {
  const { auth } = useSelector((state) => ({ ...state }));

  const router = useRouter();

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
            ${info.dollarPrice}/mo
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
        </div>
        <div className="mt-20">
          {auth?.plan.toLocaleLowerCase() === info.plan.toLocaleLowerCase() ? (
            <button className="w-full cursor-default bg-black p-2 rounded-xl text-white">
              Current Plan
            </button>
          ) : (
            <button
              onClick={() => {
                sessionStorage.setItem(
                  "selectedPlan",
                  info.plan.toLocaleLowerCase()
                );
                router.push("/checkout");
              }}
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