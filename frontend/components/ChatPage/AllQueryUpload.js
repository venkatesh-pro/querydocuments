import React, { useEffect, useState } from "react";
import { getAllUploadsFunction } from "../../function/queryUpload";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const AllQueryUpload = ({ allUploads }) => {
  const router = useRouter();

  return (
    <div className="h-[92vh] w-[10vw] bg-red-300 overflow-scroll">
      {allUploads.map((allUpload) => {
        return (
          <div>
            <button
              className={`${
                router.query.id == allUpload._id ? "bg-white" : ""
              }`}
              onClick={() => {
                router.push(`/chat/${allUpload._id}`);
              }}
            >
              {allUpload.fileName}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default AllQueryUpload;
