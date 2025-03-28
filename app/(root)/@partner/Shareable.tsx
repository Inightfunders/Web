"use client";

import { useRef, useState, useEffect } from "react";
import { getUser } from "@/lib/actions/auth";

import { FacebookShareButton, LinkedinShareButton, WhatsappShareButton, EmailShareButton, TwitterShareButton,} from "react-share";


const Shareable = () => {
  const linkdin = "/socials/linkedin.svg";
  const whatsapp = "/socials/whatsapp.svg";
  const instagram = "/socials/instagram.svg";
  const mail = "/socials/mail.svg";
  const chat = "/socials/chat.svg";
  const x = "/socials/x-orange.svg";
 


  const [user, setUser] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData);
    };
    fetchUser();
  }, []);

  const referralLink = `${process.env.NEXT_PUBLIC_Reff_BASE_URL!}?key=${user?.user?.user_metadata?.sub || ""}`;
  const title = "Join our credit marketplace to get funded!";

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      alert("Copied to clipboard!"); 
    }
  };

  return (
    <div className="bg-[#212121] border-none rounded-[8px] text-white">
      <div className="py-[40px] px-[32px]">
        <p className="font-bold text-left text-lg pb-2">
          Share with your friends to help them get funded!
        </p>
        <p className="text-sm pb-4">
          Earn 20% on our facilitation fee when you refer a qualified borrower or lender to our credit marketplace.
        </p>

        {/* Referral Link with Copy Button */}
        <div className="flex gap-4 pb-6  flex-col md:flex-row">
          <input
            ref={inputRef}
            value={referralLink}
            readOnly
            className="w-[90%]  py-3 px-4 text-xs border border-[#EAEAEA] rounded-[8px] bg-transparent"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="flex rounded-[8px] w-[100px] sm:w-[90px] md:w-[130px] lg:w-[140px] xl:w-[150px] items-center gap-2 bg-[#FF7A00] text-white px-4 py-3"
          >
            <img src="/images/copy.svg" alt="Copy icon" className="w-4 md:w-3" />
            <span className="text-sm font-semibold">Copy</span>
          </button>
        </div>

        {/* Social Icons */}
        {/* <div className="flex gap-3">
          {socialIcons.map((el, index) => (
            <div key={index} className="flex items-center bg-[#FF7A0014] p-3 rounded-[12px]">
              <img src={el.iconPath} alt={`Share on ${el.iconPath}`} />
            </div>
          ))}
        </div> */}
        <div className="flex  gap-4 items-center rounded-[12px]">
        <LinkedinShareButton url={referralLink} title={title}>
        <div className="flex items-center bg-[#FF7A0014] sm:p-3 rounded-[12px]">
        <img src={linkdin} alt={`Share on ${linkdin}`} />
        </div>
      </LinkedinShareButton>
      <FacebookShareButton url={referralLink} title={title}>
        <div className="flex items-center bg-[#FF7A0014] sm:p-3 rounded-[12px]">
        <img src={chat} alt={`Share on ${chat}`} />
        </div>
      </FacebookShareButton>
      <WhatsappShareButton url={referralLink} title={title}>
        <div className="flex items-center bg-[#FF7A0014] sm:p-3 rounded-[12px]">
        <img src={whatsapp} alt={`Share on ${whatsapp}`} />
        </div>
      </WhatsappShareButton>
      <EmailShareButton url={referralLink} title={title}>
        <div className="flex items-center bg-[#FF7A0014] sm:p-3 rounded-[12px]">
        <img src={mail} alt={`Share on ${mail}`} />
        </div>
      </EmailShareButton>

      <TwitterShareButton url={referralLink} title={title}>
        <div className="flex items-center bg-[#FF7A0014] sm:p-3 rounded-[12px]">
        <img src={x} alt={`Share on ${x}`} />
        </div>
      </TwitterShareButton>
      
            </div>
            
      </div>
    </div>
  );
};

export default Shareable;
