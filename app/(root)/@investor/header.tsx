import Notifications from "@/components/shared/Notifications";
import { getUser } from "@/lib/actions/auth";
import { getNotifications } from "@/lib/actions/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";

export default async function HeaderInvestor() {
  const user = await getUser();
  const notifications = await getNotifications(user?.user.id!);

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between h-fit px-6 md:px-12 py-4 bg-[#212121] text-white w-full gap-3 shadow-lg">
      
    {/* Logo for Small and Medium Screens */}
    <div className="md:block lg:hidden">
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
            <AvatarFallback className="">
              {user?.userInvestor?.company_name?.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center">
            <p className="text-[#FEFFFE] font-light text-sm leading-[17px]">
              {user?.userInvestor?.company_name}
            </p>
            <p className="text-[#FEFFFE] font-light text-xs leading-[17px] self-start">
              {user?.userInfo?.role}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
