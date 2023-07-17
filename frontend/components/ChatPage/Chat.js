import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  fetchMessageFunction,
  sendMessageFunction,
} from "../../function/queryUpload";
import { useSelector } from "react-redux";
import { Button, TextField, TextareaAutosize } from "@mui/material";
import { Send } from "@mui/icons-material";

const Chat = ({}) => {
  const [value, setValue] = useState("");
  const [chat, setChat] = useState([]);
  const { auth } = useSelector((state) => ({ ...state }));
  const router = useRouter();

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
      console.log(value);
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

      setChat((prevChat) => [...prevChat, data]);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full relative h-[92vh] overflow-scroll ">
      {/* <pre>{JSON.stringify(chat, null, 4)}</pre> */}
      <div className="flex p-10 mb-10 flex-col gap-4 overflow-scroll">
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
                <span>{message.message}</span>
              </pre>
            </div>
          );
        })}
      </div>
      <div className="relative bottom-0">
        <TextareaAutosize
          placeholder="Type something..."
          multiline
          maxRows={10}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="z-10 border-4 border-[#e1d0b3] p-3 pr-12 hover:border-[#e1d0b3] outline-[#c0964e] fixed bottom-0 md:w-[calc(100%-240px)]  w-full 	 "
        />
        <Button
          onClick={() => {
            sendMessage({ message: value, isHuman: true });
            setValue("");
          }}
          className="fixed z-20 right-0 bottom-[8px]"
        >
          <Send />
        </Button>
      </div>
    </div>
  );
};

export default Chat;
