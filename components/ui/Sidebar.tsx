'use client';

import { AnalyticsIcon, BroadcastIcon, PeriskopeIcon } from "./Icons";
import { IconType } from "react-icons";
import { IoChatbubbleEllipses, IoTicket } from "react-icons/io5";
import { FaListUl } from "react-icons/fa";
import { RiContactsBookFill, RiFolderImageFill } from "react-icons/ri";
import { MdChecklist } from "react-icons/md";
import { BsGearFill } from "react-icons/bs";
import { TbStarsFilled } from "react-icons/tb";
import { AiFillHome } from "react-icons/ai";
import { LogOut, Wand2 } from "lucide-react";

interface MenuItem {
  href?: string;
  icon?: IconType | React.ComponentType<{ size?: number }>;
  divider?: boolean;
  isNew?: boolean;
  isImplemented?: boolean;
}

const Sidebar: React.FC = () => {
  // WhatsApp-style icon order and types
  const menuItems: MenuItem[] = [
    { href: "/dashboard", icon: AiFillHome },
    { href: "/chats", icon: IoChatbubbleEllipses },
    { href: "/tickets", icon: IoTicket },
    { href: "/analytics", icon: AnalyticsIcon },
    { href: "/list", icon: FaListUl },
    { href: "/broadcast", icon: BroadcastIcon },
    { href: "/rules", icon: Wand2 }, // Sparkles/magic wand
    { href: "/contacts", icon: RiContactsBookFill },
    { href: "/media", icon: RiFolderImageFill },
    { href: "/logs", icon: MdChecklist },
    { href: "/settings", icon: BsGearFill },
  ];

  return (
    <div className="h-screen w-14 flex flex-col justify-between bg-white shadow-md">
      <div className="flex flex-col gap-y-1 pt-3">
        <div className="flex justify-center items-center mb-2">
          <PeriskopeIcon className="h-9 w-9" />
        </div>
        <div className="flex flex-col items-center gap-1">
          {menuItems.map((item, index) =>
            item.divider ? (
              <hr key={`divider-${index}`} className="border-gray-200 m-1" />
            ) : (
              item.href && item.icon && (
                <SidebarIcon key={item.href} icon={item.icon} />
              )
            )
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 mb-2">
        <SidebarIcon icon={TbStarsFilled} />
        <SidebarIcon icon={LogOut} extraClass="mb-1" />
      </div>
    </div>
  );
};

function SidebarIcon({ icon: Icon, extraClass = "" }: { icon: React.ComponentType<{ size?: number }>, extraClass?: string }) {
  return (
    <div
      className={`flex items-center justify-center w-10 h-10 rounded-full cursor-pointer text-[#3a3d42] transition-colors duration-200 hover:bg-gray-100 hover:text-green-500 ${extraClass}`}
    >
      <Icon size={20} />
    </div>
  );
}

export default Sidebar;