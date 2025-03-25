import Notifications from "@/components/shared/Notifications";
import { getUser } from "@/lib/actions/auth";
import { getNotifications } from "@/lib/actions/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";
import Hamburger from "./hamburger";

export default async function HeaderStartUp() {
  const user = await getUser();
  const notifications = await getNotifications(user?.user.id!);
console.log("getUser:", user);

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between h-fit px-6 md:px-12 py-4 bg-[#212121] text-white w-full gap-3 shadow-lg">
      
    {/* Logo for Small and Medium Screens */}
    <div className="mobile_logo_display_none">
      <Link href="/">
        <Image src="/images/logo.png" width={120} height={30} alt="logo" />
      </Link>
    </div>

    {/* Right Section (Notifications & Profile) */}
    <div className="flex items-center gap-4 ml-auto">
      <Notifications user={user!} notifications={notifications!} />
      <Link href="/profile" className="flex items-center gap-3">
        <Avatar className="bg-[#F1F5F9] text-black border border-custom-gray">
        <AvatarImage src={user?.userInfo?.profile_img || ""} alt="company" />
          <AvatarFallback>
            {user?.userStartUp?.company_name?.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        <p className="text-white font-light text-sm hidden md:block">
          {user?.userStartUp?.company_name}
        </p>
      </Link>
    </div>
  </div>
);
}