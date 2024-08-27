import {
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Button,
  Skeleton,
  Switch,
} from "@nextui-org/react";
import cimicoIcon from "../../../assets/logo-cabecera-m.png";

export const Navbarr = () => {
  return (
    <>
      <nav className=" w-screen flex flex-row m-0 justify-between bg-transparent p-2 border-y-large border-gray-200 fixed z-10">
        <ul className="flex flex-row justify-between w-full">
          <li className="flex gap-0 align-middle">
            <Button
              className="bg-transparent"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasExample"
              aria-controls="offcanvasExample"
            >
              <Skeleton className="rounded-medium w-14 h-full" />
              <p className="self-center">Menu</p>
            </Button>
          </li>
          <li className="flex flex-row gap-2">
            <ul className="w-full flex flex-row gap-0">
              <li>
                <Button className="bg-transparent">
                  <Skeleton className="rounded-medium w-14 h-full" />
                </Button>
              </li>
              <li>
                <Button className="bg-transparent">
                  <Skeleton className="rounded-medium w-14 h-full" />
                </Button>
              </li>
              <li>
                <Button className="bg-transparent relative">
                  <Skeleton className="rounded-medium w-14 h-full" />
                </Button>
              </li>
            </ul>
            <div className="mr-4 flex flex-row gap-2">
              <p className="text-tiny self-center"><span className="badge text-black text-sm font-thin">Juan</span></p>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform border-blue-bg-slate-500"
                    name="Jason Hughes"
                    size="md"
                    src={cimicoIcon}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">zoey@example.com</p>
                  </DropdownItem>
                  <DropdownItem key="settings">My Settings</DropdownItem>
                  <DropdownItem key="team_settings">Team Settings</DropdownItem>
                  <DropdownItem key="analytics">Analytics</DropdownItem>
                  <DropdownItem key="system">System</DropdownItem>
                  <DropdownItem key="configurations">
                    Configurations
                  </DropdownItem>
                  <DropdownItem key="help_and_feedback">
                    Help & Feedback
                  </DropdownItem>
                  <DropdownItem key="logout" className="text-red-400">
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </li>
        </ul>
      </nav>
      <div
        className="offcanvas offcanvas-start"
        tabIndex={-1}
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel">
            Offcanvas
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div>
            Some text as placeholder. In real life you can have the elements you
            have chosen. Like, text, images, lists, etc.
          </div>
          <div className="dropdown mt-3">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              Dropdown button
            </button>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" href="#">
                  Action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Another action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Something else here
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
