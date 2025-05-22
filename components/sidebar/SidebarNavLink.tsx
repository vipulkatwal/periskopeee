"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { IconType } from "react-icons";
import { BsStars } from "react-icons/bs";

interface SidebarNavLinkProps {
  href: string;
  icon: IconType;
  isNew?: boolean;
  isImplemented?: boolean;
}

const SidebarNavLink: React.FC<SidebarNavLinkProps> = ({
  href,
  icon: Icon,
  isNew = false,
  isImplemented = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(false);

  const isActive = pathname === href;

  const handleClick = (e: React.MouseEvent) => {
    if (!isImplemented && href !== "/chats") {
      e.preventDefault();
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
      }, 2000);
    }
  };

  return (
    <div className="relative" onMouseLeave={() => setShowTooltip(false)}>
      <Link
        href={isImplemented || href === "/chats" ? href : "#"}
        onClick={handleClick}
      >
        <div
          className={`relative flex items-center justify-center px-2 py-1.5 rounded-md hover:bg-gray-100 cursor-pointer text-gray-600 ${
            isActive ? "bg-gray-100 text-green-700" : ""
          }`}
        >
          <Icon className="h-5 w-5 shrink-0" />
          {isNew && (
            <BsStars className="absolute top-1 right-1 text-yellow-500 h-3 w-3 rounded-full" />
          )}
        </div>
      </Link>
    </div>
  );
};

export default SidebarNavLink;