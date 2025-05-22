"use client";

import { CollapseIcon, IntegrationIcon, MembersIcon, OverviewIcon, PropertiesIcon } from "@/utils/Icons";
import { Contact } from "@/utils/chatService";
import { IconType } from "react-icons";
import { MdAlternateEmail } from "react-icons/md";
import { RiFolderImageFill, RiListSettingsLine } from "react-icons/ri";
import { LuRefreshCw } from "react-icons/lu";
import { FiEdit3 } from "react-icons/fi";

interface MenuItem {
    icon?: IconType;
    divider?: boolean;
    isImplemented?: boolean;
}

interface RightbarProps {
    contact: Contact | null;
}

const menuItems: MenuItem[] = [
  { icon: CollapseIcon, isImplemented: false },
  { icon: LuRefreshCw, isImplemented: true },
  { icon: FiEdit3, isImplemented: false },
  { icon: OverviewIcon, isImplemented: false },
  { icon: PropertiesIcon, isImplemented: false },
  { icon: IntegrationIcon, isImplemented: false },
  { icon: MembersIcon, isImplemented: false },
  { icon: MdAlternateEmail, isImplemented: false },
  { icon: RiFolderImageFill, isImplemented: false },
  { icon: RiListSettingsLine, isImplemented: false },
];


const Rightbar: React.FC<RightbarProps> = ({ contact }) => {
    return (
        <aside className="w-14 border-l pt-10 border-gray-200 p-2 flex flex-col gap-4 h-full">
          {menuItems.map(
            (item, index) =>
              item.icon && (
                <button
                  key={index}
                  className="w-full p-1.5 rounded-md cursor-pointer hover:bg-gray-100 text-gray-500 flex items-center justify-center relative"
                >
                  <item.icon className="h-5 w-5" />
                </button>
              )
          )}
        </aside>
    )
};

export default Rightbar;