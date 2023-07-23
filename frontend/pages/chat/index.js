import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import HeaderChatPage from "../../components/Navbar/HeaderChatPage";
import ChatFileUploadSideBar from "../../components/FileUpload/ChatFileUploadSideBar";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getAllUploadsFunction } from "../../function/queryUpload";
import { useEffect } from "react";
import AllQueryUpload from "../../components/ChatPage/AllQueryUpload";
import FileUploadComponent from "../../components/FileUpload/FileUploadComponent";
import api from "../../utils/http-client";

const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const [allUploads, setAllUploads] = useState([]);
  const [planFromDb, setPlanFromDb] = useState("");

  const { auth } = useSelector((state) => ({ ...state }));
  const router = useRouter();

  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const getAllUploads = async () => {
    const { data } = await getAllUploadsFunction(auth.token);
    setAllUploads(data);
  };

  const whichplanFunction = async () => {
    try {
      const { data } = await api.get(`/whichplan`, {
        headers: {
          authToken: auth.token,
        },
      });

      setPlanFromDb(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (auth?.token) {
      getAllUploads();
      whichplanFunction();
    }
  }, [auth]);
  return (
    <>
      <HeaderChatPage />
      <Box sx={{ display: "flex" }}>
        <Box>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: "none" },
              position: "absolute",
              top: "15px",
              left: "20px",
              zIndex: 12,
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {/* {drawer} */}
            <div className="p-2">
              <ChatFileUploadSideBar />
              {allUploads.length > 0 ? (
                <AllQueryUpload
                  allUploads={allUploads}
                  setAllUploads={setAllUploads}
                />
              ) : (
                ""
              )}
            </div>
          </Drawer>
          <Box
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            className="bg-[#EEE6D8] h-[92vh] overflow-scroll overflow-x-hidden"
          >
            {/* {drawer} */}
            <div className="p-2">
              <ChatFileUploadSideBar />
              {allUploads.length > 0 ? (
                <AllQueryUpload
                  allUploads={allUploads}
                  setAllUploads={setAllUploads}
                />
              ) : (
                ""
              )}
            </div>
          </Box>
        </Box>
        <div className="flex h-[92vh] items-center justify-center w-full">
          {/* change copy from home page one */}
          <FileUploadComponent planFromDb={planFromDb} />
        </div>
      </Box>
    </>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
