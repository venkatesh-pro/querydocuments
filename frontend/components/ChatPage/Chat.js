import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import {
  fetchMessageFunction,
  sendMessageFunction,
} from "../../function/queryUpload";
import { useSelector } from "react-redux";
import {
  Button,
  TextField,
  TextareaAutosize,
  useMediaQuery,
} from "@mui/material";
import { Send } from "@mui/icons-material";

const Chat = ({ isDesktop }) => {
  const [value, setValue] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoadingForMessage, setIsLoadingForMessage] = useState(false);

  const { auth } = useSelector((state) => ({ ...state }));
  const router = useRouter();

  const chatContainerRef = useRef();
  const typeWriterRef = useRef();

  const fetchMessages = async () => {
    const { data } = await fetchMessageFunction(auth.token, router.query.id);

    console.log(data);
    setChat(data);
  };
  useEffect(() => {
    console.log("fetch", router.query.id);
    if (router.query.id) {
      fetchMessages();
    }
  }, [router.query]);

  const sendMessage = async (value) => {
    try {
      setIsLoadingForMessage(true);
      console.log(value);
      if (value.message !== "") {
        setChat((prevChat) => [
          ...prevChat,
          {
            message: value.message,
            isHuman: true,
          },
        ]);
        const { data } = await sendMessageFunction(auth.token, {
          message: value.message,
          fileId: router.query.id,
        });

        console.log(data);
        data.new = true;
        typeText(data.message);
        setChat((prevChat) => [...prevChat, data]);
      }
      setIsLoadingForMessage(false);
    } catch (error) {
      console.log(error);
      setIsLoadingForMessage(false);
    }
  };
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    // Scroll the chat container to the bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [chat]);

  function typeText(text) {
    let index = 0;
    let interval = setInterval(() => {
      if (index < text.length) {
        // element.innerHTML += text.charAt(index);
        typeWriterRef.current.innerHTML += text.charAt(index);

        // const chatContainer = chatContainerRef.current;
        // chatContainer.scrollTop = chatContainer.scrollHeight;
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);
  }
  return (
    <div
      className="w-full relative h-[92vh] overflow-scroll"
      ref={chatContainerRef}
    >
      {/* <pre>{JSON.stringify(chat, null, 4)}</pre> */}
      <div className="flex p-10  flex-col gap-4 overflow-scroll">
        {chat.map((message, i) => {
          return (
            <div
              key={i}
              className={` border-[#999999] break-words bg-[#e1d0b3] border-2 rounded-xl self-end px-3 py-3 max-w-[80%] ${
                message.isHuman === false &&
                "bg-transparent bg-opacity-40  backdrop-blur-lg dropshadow-md mr-auto"
              }`}
            >
              <pre className="whitespace-pre-wrap">
                <span ref={typeWriterRef}>
                  {!message.new && message.message}
                </span>
              </pre>
            </div>
          );
        })}
        {/* <pre>{JSON.stringify(chat, null, 4)}</pre> */}

        {isLoadingForMessage && (
          <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}
      </div>
      <div className="h-10"></div>
      <div className="fixed bottom-0 flex ">
        <TextareaAutosize
          placeholder="Type something..."
          multiline
          autoFocus={true}
          maxRows={10}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="z-10 border-4 border-[#e1d0b3] p-3 pr-12 hover:border-[#e1d0b3] outline-[#c0964e] fixed bottom-0 md:w-[calc(100%-240px)]  w-full 	 "
        />
      </div>
      {/* <Button> */}
      <Send
        onClick={() => {
          sendMessage({ message: value, isHuman: true });
          setValue("");
        }}
        style={{
          position: "fixed",
          bottom: "15px",
          right: "15px",
          zIndex: 20,
          cursor: "pointer",
        }}
      />
      {/* </Button> */}
    </div>
  );
};

export default Chat;
