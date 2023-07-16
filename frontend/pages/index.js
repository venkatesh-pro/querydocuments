import axios from "axios";
import React, { useState } from "react";

import Home from "../components/HomePage/Home";
import Pricing from "../components/HomePage/Pricing";

const index = () => {
  return (
    <div className="w-full h-[92vh]">
      <Home />
      <Pricing />
    </div>
  );
};

export default index;
