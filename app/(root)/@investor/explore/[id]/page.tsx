import { getUser } from "@/lib/actions/auth";
import { getExploreStartups } from "@/lib/actions/investor";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import FinancialRounds from "./financialrounds";
import RequestMoreFinancialDetailsContainer from "./requestmorefinancialdetails";
import RequestDataContainer from "./requestDataContainer";
import FinancialDetails from "./financialDetails";
import { NonDisclosure } from "./non-disclosure";
import MakeAnOffer from "./makeAnOffer";
import { FileText, Eye, Download } from "lucide-react";

type Props = {
  params: {
    id: string;
  };
};

export default async function SingleStartUpPage({ params }: Props) {
  // const [isOpen, setIsOpen] = useState(false);

  const user = await getUser();

  if (!user?.userInvestor?.accepted) return null;

  const startUpDetails = await getExploreStartups(user?.userInvestor?.id!, {
    id: isNaN(parseInt(params.id)) ? undefined : parseInt(params.id),
  });

  if (startUpDetails.length === 0) return null;

  const startup = startUpDetails[0].startup;

  return (
    <section className="relative flex flex-col flex-1 font-Montserrat items-center justify-start gap-1 h-screen max-h-screen px-4 overflow-auto explore_id_page">
      <div className="explore_id_page cursor-pointer mr-auto text-nowrap font-light font-Montserrat text-white text-xs my-6 flex items-center justify-center gap-2">
        <Link href="/explore" className="">
          <span className="text-xl">{"< "}</span> Back
        </Link>
      </div>
      {/* Startup Info */}
      <div className="w-full flex gap-8 rounded-[2px] bg-[#313131] py-8 px-2 justify-evenly items-center flex-col sm:flex-row ">
        <div className="flex flex-col items-center justify-start">
          <Image
            src="/images/placehodler.jpg"
            alt={startup?.company_name!}
            width={112}
            height={112}
            className="rounded-full w-28 h-28"
          />
        </div>
        <div className="flex flex-col gap-4 items-start w-1/3 justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-1">
              <p className="font-bold text-xs text-white">About</p>
              <div className="h-4 w-16 bg-[#484848] rounded-[2px]" />
            </div>
            <div className="w-16 h-[1px] bg-white" />
          </div>
          <div className="flex justify-between text-white gap-6 w-full">
            <div className="flex gap-2 flex-1 flex-col items-start justify-center">
              <div className="flex gap-1.5 items-center text-xs">
                <Image
                  src="/images/industryName.svg"
                  alt="Industry"
                  width={10}
                  height={12}
                />
                {startup?.industry_sector}
              </div>
              <div className="flex gap-1.5 items-center text-xs">
                <Image
                  src="/images/series2.svg"
                  alt="Stage"
                  width={10}
                  height={12}
                />
                {startup?.stage}
              </div>
              <div className="flex gap-1.5 items-center text-xs">
                <Image
                  src="/images/raised.svg"
                  alt="Raised"
                  width={10}
                  height={12}
                />
                ${startup.recent_raise}
              </div>
            </div>
            <div className="flex gap-2 flex-1 flex-col items-start justify-center">
              <div className="flex gap-1.5 items-center text-xs">
                <Image
                  src="/images/location2.svg"
                  alt="Location"
                  width={10}
                  height={12}
                />
                {startup?.address}
              </div>
              <div className="flex gap-1.5 items-center text-xs">
                <Image
                  src="/images/website.svg"
                  alt="Website"
                  width={10}
                  height={12}
                />
                {startup?.email}
              </div>
              <div className="flex gap-1.5 items-center text-xs">
                <Image
                  src="/images/sector.svg"
                  alt="Sector"
                  width={10}
                  height={12}
                />
                {startup.business_structure}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Additional UI Section */}
      <div className="w-full  py-4 px-2 mt-4 flex flex-col gap-4">
        <NonDisclosure investorId={user.userInvestor.id} startupId={startup.id} />

        <FinancialDetails investorId={user.userInvestor.id} startupId={startup.id} />
      </div>

      {/* Financial Details */}
      <div className="w-full mt-6 bg-[#313131] px-8 py-4 rounded-md">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-2">
          <div>
            <h2 className="font-bold text-white text-sm flex-1">
              Financial Summary
            </h2>
          </div>
          {/* <div className='h-6 w-[1px] bg-blue-500 mx-4' /> */}
          <div className="flex items-center gap-2">
            <Suspense fallback={<Loader2 className="w-6 h-6 animate-spin" />}>
              <RequestDataContainer
                investorId={user.userInvestor.id}
                startupId={startup.id}
              />
            </Suspense>
            <MakeAnOffer startupId={startup.id} />
          </div>
        </div>
        <div className="p-4 rounded-md mt-2">
          <Suspense fallback={<Loader2 className="w-6 h-6 animate-spin" />}>
            <FinancialRounds startupId={startup.id} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
