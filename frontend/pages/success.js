import Link from "next/link";
import React from "react";

const cancelled = () => {
  return (
    <div className="flex items-center flex-col h-[92vh] justify-center">
      <h1 className="text-2xl">Payment Success</h1>
      <div className="mt-4">
        <Link className="p-2 rounded-lg bg-green-700 text-white" href={"/chat"}>
          Start Chat
        </Link>
      </div>
    </div>
  );
};

export default cancelled;
