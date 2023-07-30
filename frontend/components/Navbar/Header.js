import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { firebaseAuth } from "../../config/firebase";
import { useRouter } from "next/router";
import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { Logout, PersonAdd } from "@mui/icons-material";
import { Element as Scroll } from "react-scroll";
import { toast } from "react-hot-toast";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const [isUser, setIsUser] = useState(false);
  const { auth } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      firebaseAuth.signOut();
      window.localStorage.removeItem("auth");
      dispatch({
        type: "LOGOUT",
        payload: null,
      });
      toast.success("Logout Success");

      router.push("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error || "Something went wrong");
    }
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    if (auth?.token) {
      setIsUser(true);
    }
  }, [auth]);
  return (
    <div className="h-[64px] sticky top-0 bg-[#ffffff] shadow-md z-10 w-full">
      <div className="ml-4 mr-4 flex items-center justify-between h-full">
        <div>
          <Link href={"/"}>
            <h1>querydocuments</h1>
          </Link>
        </div>
        <ul className="h-full items-center flex justify-between">
          <li>
            <Scroll
              activeClass="active"
              to="pricing"
              spy={true}
              smooth={true}
              offset={50}
              duration={500}
              className="cursor-pointer"
            >
              <Link href={"/#pricing"}>Pricing</Link>
            </Scroll>
          </li>

          {isUser && auth?.token ? (
            <>
              {/* <li className="ml-10">
                <button onClick={handleLogout}>Logout</button>
              </li> */}
              <li className="ml-10">
                <Link href={"/chat"}>Chat</Link>
              </li>
              {/* avatar */}
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-haspopup="true"
                >
                  <Avatar
                    sx={{ width: 42, height: 42 }}
                    alt={auth?.name}
                    src={auth.picture}
                  />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              <li className="ml-10">
                <button>
                  <Link href={"/register"}>Register</Link>
                </button>
              </li>
              <li className="ml-10">
                <button>
                  <Link href={"/login"}>Login</Link>
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
      {isUser && (
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={anchorEl}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem>
            <Link href={"/account"} className="flex">
              <Avatar
                sx={{ width: 42, height: 42 }}
                alt={auth?.name}
                src={auth?.picture}
              />
              My account
            </Link>
          </MenuItem>

          <Divider />
          <MenuItem>
            <Link
              target="_blank"
              href={"https://wa.me/+916385487401"}
              className="flex"
            >
              Get Support
            </Link>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      )}
    </div>
  );
};

export default Header;
