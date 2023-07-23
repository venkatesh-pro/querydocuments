import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";
import api from "../../../utils/http-client";
import { useSelector } from "react-redux";

const UrlModal = ({ open, setOpen }) => {
  const [url, setUrl] = useState("");

  const { auth } = useSelector((state) => ({ ...state }));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  function checkUrl(value) {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    if (pattern.test(value)) {
      return true;
      // Do something if it's a valid URL
    } else {
      return false;

      // Do something if it's an invalid URL
    }
  }

  const handleSubmit = async () => {
    try {
      if (checkUrl(url)) {
        const { data } = await api.post(
          `/uploadLink`,
          {
            url: url,
          },
          {
            headers: {
              authtoken: auth.token,
            },
          }
        );
        console.log(data);
        if (data) router.push(`/chat/${data}`);
      } else {
        console.log("In Valid URL");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="sm:w-[60vw] w-[100vw]"></div>
        <DialogTitle id="alert-dialog-title">
          {"Upload Website url like .com .co .in "}
        </DialogTitle>
        <DialogContent className="w-full">
          <DialogContentText id="alert-dialog-description">
            <input
              type="url"
              className="w-full border-2 p-3"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => handleSubmit()} autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UrlModal;
