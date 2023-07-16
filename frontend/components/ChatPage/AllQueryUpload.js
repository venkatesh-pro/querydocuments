import React, { useEffect, useState } from "react";
import { getAllUploadsFunction } from "../../function/queryUpload";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { ChatBubbleOutline } from "@mui/icons-material";
import { CardActionArea } from "@mui/material";

const AllQueryUpload = ({ allUploads }) => {
  const router = useRouter();

  return (
    <div className="mt-4">
      {allUploads.map((allUpload) => {
        return (
          <CardActionArea>
            <div className=" pt-2 pb-2">
              <button
                className={`${
                  router.query.id == allUpload._id ? "bg-white" : ""
                } w-full text-start`}
                onClick={() => {
                  router.push(`/chat/${allUpload._id}`);
                }}
              >
                <ChatBubbleOutline fontSize="small" /> {allUpload.fileName}
              </button>
            </div>
          </CardActionArea>
        );
      })}
    </div>
  );
};

export default AllQueryUpload;
