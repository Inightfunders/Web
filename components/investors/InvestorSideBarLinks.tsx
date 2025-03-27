"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function InvestorSideBarLinks() {
  const pathname = usePathname();
  const [isReferralOpen, setIsReferralOpen] = useState(false);

  const isReferralActive = pathname.startsWith("/referral");

  return (
    <div className="flex flex-col w-full mt-8 sidebardashboardMenuLinks">
      <Link
        href="/"
        className={cn(
          "py-4 text-sm font-Montserrat w-full px-2 md:px-6 text-left",
          !pathname.startsWith("/earnings") &&
            !pathname.startsWith("/payment-setup") &&
            !pathname.startsWith("/explore") &&
            !pathname.startsWith("/requests") &&
            !pathname.startsWith("/referral")
            ? "bg-white font-medium text-black h-fit"
            : "text-white"
        )}
      >
        Dashboard
      </Link>
      <Link
        href="/explore"
        className={cn(
          "py-4 text-sm font-Montserrat w-full px-2 md:px-6 text-left",
          pathname.startsWith("/explore")
            ? "bg-white font-medium text-black h-fit"
            : "text-white"
        )}
      >
        Explore
      </Link>
      <Link
        href="/requests"
        className={cn(
          "py-4 text-sm font-Montserrat w-full px-2 md:px-6 text-left",
          pathname.startsWith("/requests")
            ? "bg-white font-medium text-black h-fit"
            : "text-white"
        )}
      >
        Requests
      </Link>

      {/* Referral Dropdown Section */}
      <div className="w-full relative">
        <button
          onClick={() => setIsReferralOpen(!isReferralOpen)}
          className={cn(
            "py-4 text-sm font-Montserrat w-full px-2 md:px-6 flex justify-between items-center text-left",
            pathname.startsWith("/referral") && !isReferralOpen
              ? "bg-white font-medium text-black"
              : "text-white"
          )}
        >
          <span className="w-full text-left">Referral</span>
          {isReferralOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {isReferralOpen && (
          <div className="bg-gray-800 flex flex-col">
            <Link
              href="/referral"
              className={cn(
                "py-3 text-sm font-Montserrat w-full px-2 block",
                pathname === "/referral"
                  ? "bg-white font-medium text-black"
                  : "text-white"
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/earnings"
              className={cn(
                "py-3 text-sm font-Montserrat w-full px-2 block",
                pathname === "/earnings"
                  ? "bg-white font-medium text-black"
                  : "text-white"
              )}
            >
              Earnings
            </Link>
            <Link
              href="/payment-setup"
              className={cn(
                "py-3 text-sm font-Montserrat w-full px-2 block",
                pathname === "/payment-setup"
                  ? "bg-white font-medium text-black"
                  : "text-white"
              )}
            >
              Payment Setup
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
