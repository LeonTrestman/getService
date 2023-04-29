import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { type FC, Fragment, useState } from "react";
import { UserRole } from "./Auth";
import Link from "next/link";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { Menu, Popover, Transition } from "@headlessui/react";

interface NavbarProps {
  firstName: string;
  lastName: string;
  role: UserRole;
}

const Navbar: FC<NavbarProps> = ({ firstName, lastName, role }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex flex-col gap-4 bg-indigo-600 px-2 pt-1 shadow-md">
      <div className="flex justify-between">
        <LeftNavBar firstName={firstName} lastName={lastName} />
        <RightNavBar role={role} />
      </div>
    </div>
  );
};

interface LeftNavBarProps {
  firstName: string;
  lastName: string;
}

interface RoleProps {
  role: UserRole;
}

const LeftNavBar: FC<LeftNavBarProps> = ({ firstName, lastName }) => {
  return (
    <div className=" flex items-center gap-4">
      <div className="text-3xl font-bold text-yellow-400 transition-colors  ">
        Get Service
      </div>
      <h1 className="text-sm text-white "> {`${firstName} ${lastName}`}</h1>
    </div>
  );
};

const RightNavBar: FC<RoleProps> = ({ role }) => {
  return (
    <div className="flex ">
      <div className="hidden place-items-center gap-8 md:flex">
        <Links role={role} />
      </div>

      {/* <Popover.Button className="w-8 md:hidden"> */}
      <Menu as="div" className="text-center text-white md:hidden ">
        <Menu.Button
          className={`justify-center focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 md:max-w-xl `}
        >
          {({ open }) => (
            <Bars3Icon
              className={`${
                open ? "rotate-90 transform " : " transform"
              }h-8 w-8 fill-yellow-400 `}
            />
            // <span
            //   className={`${
            //     open ? "bg-indigo-800 text-yellow-500" : "text-white"
            //   } h-full w-full rounded-t-md p-2`}
            // >
            //   burger
            // </span>
          )}
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          {/* todo: fix this */}
          <Menu.Items className="absolute left-0 z-10 w-full  rounded-b-md bg-indigo-600 focus:outline-none  ">
            <div>
              <Menu.Item>
                {({ active }) => (
                  <Link href={"/call"}>
                    <button
                      className={`${
                        active ? "bg-indigo-800 text-yellow-500" : "text-white"
                      } w-full  p-2`}
                    >
                      status
                    </button>
                  </Link>
                )}
              </Menu.Item>
            </div>

            <div>
              <Menu.Item>
                {({ active }) => (
                  <Link href={"/call/create"}>
                    <button
                      className={`${
                        active ? "bg-indigo-800 text-yellow-500" : "text-white"
                      }  w-full  p-2`}
                    >
                      create
                    </button>
                  </Link>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

const Links: FC<RoleProps> = ({ role }) => {
  return (
    <>
      {/* user links  */}
      <CallsMenu />

      {/* worker/admin links  */}
      {(role === UserRole.ADMIN || role === UserRole.WORKER) && (
        <Link className="navLink" href={"/work/pick"}>
          Pick
        </Link>
      )}

      {/* admin links  */}
      {role === UserRole.ADMIN && (
        <Link className="navLink" href={"/backoffice/users"}>
          Users
        </Link>
      )}

      <LogoutBtn />
    </>
  );
};

const BurgerMenu: FC<RoleProps> = ({ role }) => {
  return (
    <div className="  flex flex-col gap-4 text-center md:hidden">
      <Links role={role} />
    </div>
  );
};

const LogoutBtn: FC = () => {
  const queryClient = useQueryClient();

  const onClickHandler = async () => {
    await signOut();
    await queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  return (
    <button
      onClick={void onClickHandler}
      className="rounded-lg bg-yellow-400  p-1 font-bold text-slate-700 hover:bg-yellow-500"
    >
      Logout
    </button>
  );
};

export default Navbar;

const CallsMenu: FC = () => {
  return (
    <Menu as="div" className=" relative inline-block text-center text-white ">
      <div className="">
        <Menu.Button className="inline-flex h-full w-full justify-center focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 md:max-w-xl ">
          {({ open }) => (
            <span
              className={`${
                open ? "bg-indigo-800 text-yellow-500" : "text-white"
              } w-full rounded-t-md p-2`}
            >
              Calls
            </span>
          )}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className=" grid w-full overflow-hidden rounded-b-md bg-indigo-700 focus:outline-none md:absolute ">
          <div>
            <Menu.Item>
              {({ active }) => (
                <Link href={"/call"}>
                  <button
                    className={`${
                      active ? "bg-indigo-800 text-yellow-500" : "text-white"
                    } w-full  p-2`}
                  >
                    status
                  </button>
                </Link>
              )}
            </Menu.Item>
          </div>

          <div>
            <Menu.Item>
              {({ active }) => (
                <Link href={"/call/create"}>
                  <button
                    className={`${
                      active ? "bg-indigo-800 text-yellow-500" : "text-white"
                    }  w-full  p-2`}
                  >
                    create
                  </button>
                </Link>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
