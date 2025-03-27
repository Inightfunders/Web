import { UserType } from "@/lib/types/user";
import Link from "next/link";
import LogOutSlider from "./LogOutSlider";
import InvestorSideBarLinks from "./InvestorSideBarLinks";
import Image from "next/image";

type Props = {
  user: UserType;
};

export default async function InvestorSideBar() {
  return (
    <aside className="bg-[#212121] h-screen flex w-[250px] flex-col items-center justify-between py-6 sidebardashboard ">
      <div className="flex flex-col items-center justify-between w-full gap-12 md:gap-4 sidebardashboard">
        {/* Hide Sidebar Logo on Medium Screens */}
        <div className="display_none_1030">
          <Link href="/">
            <Image src="/images/logo.png" width={130} height={30} alt="logo" />
          </Link>
        </div>
        <InvestorSideBarLinks />
      </div>
      <div className="display_none_1030 w-full">
        <LogOutSlider />
      </div> 
    </aside>
  );
}
