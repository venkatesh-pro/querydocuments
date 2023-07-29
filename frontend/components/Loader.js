import React from "react";
import { Box, CircularProgress, Stack } from "@mui/material";

const Loader = ({ size }) => (
  <Box>
    <CircularProgress
      size={size}
      style={{
        // background: "white",
        color: "white",
      }}
    />
  </Box>
);

export default Loader;
