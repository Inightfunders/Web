import { getUser } from "@/lib/actions/auth";
import { getDataRequests } from "@/lib/actions/startup";
import { format } from "date-fns";
import ActionButtons from "./actionbuttons";
import Image from "next/image";

export default async function DataRequests() {
  const user = await getUser();
  // console.log(user);
  const requests = await getDataRequests(user?.userStartUp?.id!);
  // console.log("requestsssss",requests);

  return (
    <section className="flex flex-1 items-start justify-between gap-6 h-screen py-12 px-12 flex-wrap">
      {requests.length ? (
        requests.map(({ investor, id, accepted }) => (
          <div className="flex flex-col gap-4 px-6 items-start justify-center bg-white w-[310px] rounded-[8px] h-[150px] py-4">
            <div className="flex gap-2">
              <Image
                src="/images/requestlogo.svg"
                width={50}
                height={50}
                alt="request"
              />
              <div className="flex flex-col gap-1 items-start justify-center">
                <p className="text-sm font-medium font-Montserrat text-black">
                  {investor?.user?.first_name} {investor?.user?.last_name}
                </p>
                <p className="text-sm font-extralight font-Montserrat text-black">
                  {investor?.investor_type}
                </p>
              </div>
            </div>
            <ActionButtons user={user!} requestId={id!} accepted={accepted!} />
          </div>
        ))
      ) : (
        <p className="mb-auto flex items-center justify-center mt-12 text-white w-full">
          There are no requests at the moment, but you’ll be notified if an
          interested lender requests to review your data
        </p>
      )}
    </section>
  );
}
