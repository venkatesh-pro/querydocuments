import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  fetchMessageFunction,
  sendMessageFunction,
} from "../../function/queryUpload";
import { useSelector } from "react-redux";

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
  };
  return (
    <div className="w-full relative p-10">
      {/* <pre>{JSON.stringify(chat, null, 4)}</pre> */}
      <div className="flex flex-col gap-4 overflow-scroll">
        {chat.map((message, i) => {
          return (
            <div
              key={i}
              className={` border-[#999999] break-words border-2 rounded-xl self-end px-3 py-3 max-w-[80%] ${
                message.isHuman === false &&
                "bg-white bg-opacity-40 backdrop-blur-lg dropshadow-md mr-auto"
              }`}
            >
              <pre className="whitespace-pre-wrap">
                <span>{message.message}</span>
              </pre>
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-0 right-0 w-full flex">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full border-[2px] "
        ></textarea>
        <button
          onClick={() => sendMessage({ message: value, isHuman: true })}
          className="border-[2px]"
        >
          submit
        </button>
      </div>
    </div>
  );
};

export default Chat;
