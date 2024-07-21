import { getUser } from "@/lib/actions/auth"
import { getExploreStartups } from "@/lib/actions/investor"
import Image from "next/image"

export default async function ExplorePage()
{
    const user = await getUser()

    if(!user?.userInvestor?.accepted) return null

    const exploreStartups = await getExploreStartups(user?.userInvestor?.id!)

    return (
        <section className='flex flex-1 items-start justify-center gap-6 max-h-screen pt-12 flex-wrap px-4 mb-auto'>
            {exploreStartups.map(({ startup }) => (
                <div className="flex bg-white max-h-36 min-w-[35vw] flex-1 cursor-pointer">
                    <div className="flex items-center justify-center w-36 h-36 border-r border-2 border-[#00000050]">
                        <Image
                            src='/images/placehodler.jpg'
                            alt={startup?.company_name!}
                            width={144}
                            height={144}
                        />
                    </div>
                    <div className="flex flex-col px-6 py-4 gap-3">
                        <div className="flex flex-col items-start justify-center gap-1">
                            <p className='font-medium text-xs'>    
                                {startup?.company_name}
                            </p>
                            <p className='font-medium text-[10px] text-[#00000099]'>    
                                {startup?.industry_sector}
                            </p>
                        </div>
                        <div className="flex gap-2 flex-col items-start justify-center">
                            <div className="flex gap-0.5 items-center justify-center text-xs">
                                <Image
                                    src='/images/location.svg'
                                    alt='location'
                                    width={10}
                                    height={12}
                                />
                                {startup?.address}
                            </div>
                            <div className="flex gap-0.5 items-center justify-center text-xs">
                                <Image
                                    src='/images/series.svg'
                                    alt='series'
                                    width={10}
                                    height={12}
                                />
                                {startup?.business_structure}
                            </div>
                            <div className="flex gap-0.5 items-center justify-center text-xs">
                                <Image
                                    src='/images/series.svg'
                                    alt='series'
                                    width={10}
                                    height={12}
                                />
                                $ 57,908
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    )
}