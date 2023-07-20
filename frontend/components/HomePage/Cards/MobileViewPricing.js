import React from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import {
  Box,
  Button,
  CardActionArea,
  CardActions,
  Tab,
  Tabs,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
const MobileViewPricingCard = ({ pricingInfo, planFromDb }) => {
  const [value, setValue] = React.useState(2);

  const { auth } = useSelector((state) => ({ ...state }));
  const router = useRouter();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyItems: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Free" {...a11yProps(0)} />
          <Tab label="Basic" {...a11yProps(1)} />
          <Tab label="Pro" {...a11yProps(2)} />
        </Tabs>
      </Box>

      {pricingInfo.map((info, i) => {
        return (
          <CustomTabPanel
            value={value}
            index={i}
            style={{
              width: "270px",
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
              <div className="mt-16">
                {planFromDb?.toLocaleLowerCase() ===
                info.plan.toLocaleLowerCase() ? (
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
          </CustomTabPanel>
        );
      })}
    </Box>
  );
};

export default MobileViewPricingCard;
