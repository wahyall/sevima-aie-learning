import { memo, useEffect, useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";

import {
  Input,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { For } from "react-haiku";
import { toast } from "react-toastify";

const ChatGPT = memo(() => {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const { mutate, isLoading } = useMutation(
    (message) => axios.post("/api/chat", { message }).then((res) => res.data),
    {
      onSuccess: (data) => {
        setChats((prev) => [...prev, data]);
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  const body = useRef(null);
  function handleSubmit() {
    mutate(message);
    setChats((prev) => [...prev, { message, type: "human" }]);
    setMessage("");
  }

  useEffect(() => {
    setTimeout(() => {
      body.current.scrollTop = body.current.scrollHeight;
    });
  }, [chats]);

  return (
    <section className="h-[calc(100vh_-_3rem)] overflow-y-auto grid grid-rows-[36px_auto_150px] border-s">
      <h6 className="border-b font-bold px-4">AIE Chat</h6>
      <div
        ref={body}
        className="flex-fill overflow-y-auto flex flex-col px-2 py-4 border-b"
      >
        <For
          each={chats}
          render={(chat) =>
            chat.type === "human" ? (
              <div className="bg-blue-500 p-4 rounded-md text-white max-w-xs w-[fit-content] ms-auto mb-8">
                {chat.message}
              </div>
            ) : (
              <div className="relative">
                <div className="bg-blue-100 p-4 rounded-md text-black max-w-xs w-[fit-content] mb-8">
                  {chat.message}
                </div>
                <Menu>
                  <MenuHandler>
                    <IconButton
                      variant="text"
                      className="!absolute top-0 right-8"
                    >
                      <EllipsisVerticalIcon className="h-6 w-6" />
                    </IconButton>
                  </MenuHandler>
                  <MenuList className="p-1">
                    <MenuItem>Simpan</MenuItem>
                  </MenuList>
                </Menu>
              </div>
            )
          }
        />
      </div>
      <div className="px-2 py-4">
        <Input
          label="Mau tanya apa?"
          value={message}
          onChange={(ev) => setMessage(ev.target.value)}
        />
        <Button
          fullWidth
          className="mt-2"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          Kirim
        </Button>
      </div>
    </section>
  );
});

export { ChatGPT };
