"use client";

import { CollapseIcon, IntegrationIcon, MembersIcon, OverviewIcon, PropertiesIcon } from "@/components/ui/Icons";
import { Contact } from "@/components/utils/chatService";
import { IconType } from "react-icons";
import { MdAlternateEmail } from "react-icons/md";
import { RiFolderImageFill, RiListSettingsLine } from "react-icons/ri";
import { LuRefreshCw } from "react-icons/lu";
import { FiEdit3 } from "react-icons/fi";

// Interface for menu items in the rightbar
interface MenuItem {
    icon?: IconType;
    divider?: boolean;
    isImplemented?: boolean;
}

interface RightbarProps {
    contact: Contact | null;
}

// Array of menu items with their icons and implementation status
const menuItems: MenuItem[] = [
  { icon: CollapseIcon, isImplemented: false },  // Collapse sidebar
  { icon: LuRefreshCw, isImplemented: true },    // Refresh content
  { icon: FiEdit3, isImplemented: false },       // Edit mode
  { icon: OverviewIcon, isImplemented: false },  // Overview section
  { icon: PropertiesIcon, isImplemented: false }, // Properties panel
  { icon: IntegrationIcon, isImplemented: false }, // Integrations
  { icon: MembersIcon, isImplemented: false },    // Member management
  { icon: MdAlternateEmail, isImplemented: false }, // Email settings
  { icon: RiFolderImageFill, isImplemented: false }, // Media folder
  { icon: RiListSettingsLine, isImplemented: false }, // List settings
];

// Right sidebar component displaying action buttons
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