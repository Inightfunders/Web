import { UserType } from "@/lib/types/user";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import LogOutSlider from "../investors/LogOutSlider";
import StartupSideBarLinks from "./StartupSideBarLinks";
import Image from "next/image";
import { getUser } from "@/lib/actions/auth";
import {
  getCapTable,
  getFinancialStatements,
  getLegalDocuments,
  getPitchDeck,
  getTaxReturns,
  getOtherDocuments,
  getFinancialProjection,
  getBankStatements,
  getNda
} from "@/lib/actions/startup";

type Props = {
  user: UserType;
  userPreference: string; // Add userPreference alongside user
};

export default async function StartupSideBar() {
  const pitchDeck = await getPitchDeck();
  const capTable = await getCapTable();
  const taxReturns = await getTaxReturns();
  const financialStatements = await getFinancialStatements();
  const legalDocuments = await getLegalDocuments();
  const otherDocuments = await getOtherDocuments();
  const financialProjection = await getFinancialProjection();
  const bankStatements = await getBankStatements();
  const nda = await getNda();

  return (
    <aside className="bg-[#212121] h-screen flex w-[250px] flex-col items-center justify-between py-6 sidebardashboard ">
      <div className="flex flex-col items-center justify-between w-full gap-12 md:gap-4 sidebardashboard">
        {/* Hide Sidebar Logo on Medium Screens */}
        <div className="hidden lg:block">
          <Link href="/">
            <Image src="/images/logo.png" width={130} height={30} alt="logo" />
          </Link>
        </div>
        <StartupSideBarLinks
          pitchDeck={pitchDeck}
          capTable={capTable}
          taxReturns={taxReturns}
          financialStatements={financialStatements}
          legalDocuments={legalDocuments}
          otherDocuments={otherDocuments}
          financialProjection={financialProjection}
          bankStatements={bankStatements}
          nda={nda}
        />
      </div>
      <LogOutSlider />
    </aside> 
  );
}
