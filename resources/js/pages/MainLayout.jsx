import React, { useState } from "react";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Avatar,
  Drawer,
} from "@material-tailwind/react";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  PowerIcon,
  ChevronDownIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

import { Link } from "@inertiajs/react";
import { useUser } from "@/services";
import { ChatGPT } from "@/components";

function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const { data: user } = useUser();

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="candice wu"
            className="border border-blue-500 p-0.5"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
          />
          <Typography
            as="span"
            className="font-normal normal-case px-1 text-white"
          >
            {user?.name || ""}
          </Typography>
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        <a href="/logout">
          <MenuItem
            onClick={closeMenu}
            className="flex items-center gap-2 rounded hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
          >
            {React.createElement(PowerIcon, {
              className: "h-4 w-4 text-red-500",
              strokeWidth: 2,
            })}
            <Typography
              as="span"
              variant="small"
              className="font-normal"
              color="red"
            >
              Logout
            </Typography>
          </MenuItem>
        </a>
      </MenuList>
    </Menu>
  );
}

function NavList() {
  const { data: user } = useUser();
  return (
    <ul className="py-4 lg:py-0 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6 gap-y-4">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium me-5"
      >
        <Link
          href="/catatan"
          className="flex items-center hover:text-blue-500 text-white transition-colors"
        >
          Catatan
        </Link>
      </Typography>
      <ProfileMenu />
    </ul>
  );
}

export default function MainLayout({ children, auth: { user } }) {
  const [openNav, setOpenNav] = React.useState(false);

  const handleWindowResize = () =>
    window.innerWidth >= 960 && setOpenNav(false);

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const [openDrawer, setOpenDrawer] = useState(false);
  const handleCloseDrawer = () => setOpenDrawer(false);

  return (
    <>
      <main className="pt-[3.5rem]">
        <Navbar className="fixed top-0 z-10 h-max max-w-full rounded-none py-2 px-4 lg:px-8 lg:py-2 bg-[#020617] bg-opacity-100 shadow-none border-none">
          <div className="flex items-center justify-between text-blue-gray-900">
            <Typography
              variant="h6"
              className="mr-4 cursor-pointer py-1.5 text-white"
            >
              <Link href="/">AIE-Learning</Link>
            </Typography>
            <div className="hidden lg:block">
              <NavList />
            </div>
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-white hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <XMarkIcon className="h-6 w-6" strokeWidth={2} />
              ) : (
                <Bars3Icon className="h-6 w-6" strokeWidth={2} />
              )}
            </IconButton>
          </div>
          <Collapse open={openNav}>
            <NavList />
          </Collapse>
        </Navbar>
        <section className="grid lg:grid-cols-[4fr_2fr]">
          <div className="p-4 h-[calc(100vh_-_3rem)] overflow-y-auto">
            {children}
          </div>
          <div className="p-4 hidden lg:block">
            <ChatGPT />
          </div>
        </section>

        <IconButton
          variant="outlined"
          className="bg-white fixed bottom-4 right-4 lg:hidden"
          onClick={() => setOpenDrawer(true)}
          ripple={false}
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        </IconButton>
      </main>
      <Drawer placement="right" open={openDrawer} onClose={handleCloseDrawer}>
        <IconButton
          variant="text"
          color="blue-gray"
          className="absolute right-0"
          onClick={handleCloseDrawer}
          ripple={false}
        >
          <XMarkIcon strokeWidth={2} className="h-5 w-5" />
        </IconButton>
        <div className="p-4">
          <ChatGPT />
        </div>
      </Drawer>
    </>
  );
}
