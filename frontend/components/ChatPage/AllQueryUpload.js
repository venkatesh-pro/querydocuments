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
      {allUploads.map((allUpload, i) => {
        return (
          <div className="" key={i}>
            <CardActionArea>
              <button
                className={`${
                  router.query.id == allUpload._id ? "bg-[#fffaf2]" : ""
                } w-full h-full text-start p-2`}
                onClick={() => {
                  router.push(`/chat/${allUpload._id}`);
                }}
              >
                <ChatBubbleOutline fontSize="small" /> {allUpload.fileName}
              </button>
            </CardActionArea>
          </div>
        );
      })}
    </div>
  );
};

export default AllQueryUpload;
