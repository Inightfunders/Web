import { CustomSearch } from "@/components/lenders/CustomSearch"
import Notifications from "@/components/shared/Notifications"
import { getUser } from "@/lib/actions/auth"
import { getAllRequests } from "@/lib/actions/investor"
import { getNotifications } from "@/lib/actions/user"
import Image from "next/image"
import Link from "next/link"

export default async function Requests() 
{
    const user = await getUser()
    const requests = await getAllRequests(user?.userInvestor?.id!, 'startups')
    const notifications = await getNotifications(user?.user.id!)

    return (
        <>
        
        <section className="relative flex flex-col flex-1 items-center justify-start gap-6 h-screen max-h-screen px-4 overflow-auto pt-8">
        {/* <div className="flex w-full items-center justify-end">
            <Notifications user={user!} notifications={notifications} />
        </div> */}
               {/* Search Bar */}
       <div className="relative w-full mt-24 lg:mt-0">
              <CustomSearch
                placeholder="Search startups"
                className="pl-10 bg-white border border-gray-300 text-gray-800 font-Montserrat w-full py-2 rounded-md"
              />
            </div>
        {/* Grid Layout for Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {requests?.length > 0 ?
              (requests.map(({ startups, profile_img }) => (
                <Link 
                    href={`/explore/${startups?.id}`} 
                    key={startups?.id} 
                    className="flex flex-col bg-white rounded-xl overflow-hidden shadow-md text-gray-800"
                >
                    {/* Status Label */}
                    <div className="bg-[#222] text-xs font-medium text-white px-4 py-1 w-fit request_button m-3">
                        REQUEST PENDING
                    </div>
    
                    <div className="flex items-center p-4">
                        {/* Company Logo */}
                        <div className="flex items-center justify-center">
                            <Image
                                src={profile_img || '/images/placehodler.jpg'}
                                alt={startups?.company_name || 'Company Logo'}
                                width={50}
                                height={50}
                                className="rounded-[5px]"
                            />
                        </div>
    
                        {/* Company Info */}
                        <div className="ml-4 flex flex-col">
                            <p className="text-lg font-semibold">{startups?.company_name}</p>
                            <p className="text-sm text-gray-800">{startups?.industry_sector}</p>
                        </div>
                    </div>
    
                    {/* Details Section */}
                    <div className="px-4 pb-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Image src="/images/location.svg" alt="location" width={10} height={12} />
                            <p>{startups?.address}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Image src="/images/series.svg" alt="series" width={10} height={12} />
                            <p>{startups?.stage}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Image src="/images/series.svg" alt="series" width={10} height={12} />
                            <p>${startups?.recent_raise}</p>
                        </div>
                    </div>
                </Link>
            ))) : (
                <div className="col-span-full h-20 text-white w-full flex justify-center items-center">No requests found</div>
            )}
        </div>
    </section>
    </>
    )
}