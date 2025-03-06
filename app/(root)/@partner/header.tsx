import Notifications from "@/components/shared/Notifications";
import { getUser } from "@/lib/actions/auth";
import { getNotifications } from "@/lib/actions/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";

export default async function HeaderStartUp() {
  const user = await getUser();
  const notifications = await getNotifications(user?.user.id!);

  return (
    <div className="ml-auto flex sticky items-center top-0 z-30 justify-end h-fit px-12 py-6 bg-[#212121] text-white w-full gap-3 shadow-lg navbarmobilemenu">
          {/* Logo for Small and Medium Screens */}
    <div className="md:block lg:block xl:hidden">
      <Link href="/">
        <Image src="/images/logo.png" width={120} height={30} alt="logo" />
      </Link>
    </div>
      
    <div className="flex items-center gap-4 ml-auto">
        <Notifications user={user!} notifications={notifications!} />
        <Link
          href="/profile"
          className="flex items-center justify-center gap-3"
        >
          <Avatar className="bg-[#F1F5F9] text-black border border-custom-gray">
            <AvatarImage src="" alt="company" />
            <AvatarFallback className="">
              {user?.userStartUp?.company_name?.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <p className="text-white font-light text-sm userName">
            {user?.userStartUp?.company_name}
          </p>
        </Link>
      </div>
    </div>
  );
}
