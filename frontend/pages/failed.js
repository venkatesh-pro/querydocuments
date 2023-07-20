import Link from "next/link";
import React from "react";

const cancelled = () => {
  return (
    <div className="flex items-center flex-col h-[92vh] justify-center">
      <h1 className="text-2xl">Payment Failed</h1>
      <div className="mt-4">
        <Link
          className="p-2 rounded-lg bg-green-700 text-white"
          href={"/#pricing"}
        >
          Continue Subscription
        </Link>
      </div>
    </div>
  );
};

export default cancelled;
