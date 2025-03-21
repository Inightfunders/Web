"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUser } from "@/lib/actions/auth";
import { Edit } from "lucide-react";
import Link from "next/link";
import BasicInfoDetails from "./basic-info-details";
import { createClient } from "@/utils/supabase/client";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation"; // Import useRouter

export default function BasicInfo() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter(); 


  useEffect(() => {
    async function fetchUser() {
      const fetchedUser = await getUser();
      // console.log("Updated User Data:", fetchedUser);
      setUser(fetchedUser);
    }
    fetchUser();
  }, []); 

  const handleUploadNewImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
  
    setIsLoading(true);
    const UserId = user?.user?.id;
    console.log("UserId:",UserId);
    
    if (!UserId) {
      console.error("User ID is undefined!");
      setIsLoading(false);
      return;
    }
  
    const newFileName = `${nanoid(30)}_${uploadedFile.name}`;
  
    // Upload Image
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("profileImg")
      .upload(`profile/${newFileName}`, uploadedFile, { upsert: true });
  
    if (uploadError) {
      console.error("Upload Error:", uploadError.message);
      setIsLoading(false);
      return;
    }
  
    // Get Public URL
    const { data } = supabase.storage
      .from("profileImg")
      .getPublicUrl(`profile/${newFileName}`);
    
      let publicUrl = data?.publicUrl || "";
  
    if (!publicUrl) {
      console.error("Failed to get public URL");
      setIsLoading(false);
      return;
    }
  
    // Update User Profile in Supabase
    const { error: updateError } = await supabase
      .from("users")
      .update({ profile_img: publicUrl })
      .eq("id", UserId);
  
    if (updateError) {
      console.error("Update Error:", updateError.message);
    } else {
      console.log("Profile image updated successfully!");
      setUser((prev: any) => ({...prev, userInfo: { ...prev?.userInfo, profile_img: publicUrl},
      }));
      
      // Ensure that the latest user data is fetched
      router.refresh();
    }
  
    setIsLoading(false);
  };
  

  const handleDeleteImage = async () => {
    if (!user?.userInfo?.profile_img) return;

    setIsLoading(true);

    // Extract the file name from the URL
    const fileName = user.userInfo.profile_img.split("/").pop();

    if (!fileName) {
      console.error("Invalid file path");
      setIsLoading(false);
      return;
    }

    // Delete the file from storage
    const { error: deleteError } = await supabase.storage
      .from("profileImg")
      .remove([`profile/${fileName}`]);

    if (deleteError) {
      console.error("Delete Error:", deleteError.message);
      setIsLoading(false);
      return;
    }

    // Update the user's profile image to null
    const { error: updateError } = await supabase
      .from("users")
      .update({ profile_img: null })
      .eq("id", user?.user?.id);

    if (updateError) {
      console.error("Update Error:", updateError.message);
    } else {
      console.log("Profile image deleted successfully!");
      setUser((prev: any) => ({ ...prev, userInfo: { ...prev?.userInfo, profile_img: null },}));
    }

    setIsLoading(false);
  };

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between gap-4 border-b border-[#808080] py-4">
        <p className="font-bold font-Montserrat text-white text-xl">
          Basic Information
        </p>
        <Link
          href="/profile?edit=true"
          className="w-24 h-10 bg-[#FF7A00] gap-2 text-white text-sm font-semibold rounded-[8px] flex items-center justify-center"
        >
          <Edit size={16} /> Edit
        </Link>
      </div>
      <BasicInfoDetails user={user} />
      <div className="flex items-center justify-between gap-4 border-b border-[#808080] py-4">
        <p className="font-bold font-Montserrat text-white text-xl">
          Profile picture
        </p>
      </div>
      <div className="text-left">
        <h4 className="text-lg text-white font-Montserrat mb-5">Brand logo</h4>
        <label htmlFor="upload-image" className="cursor-pointer">
          <Avatar className="bg-[#F1F5F9] text-black border-4 border-[#FF7A00]">
            <AvatarImage src={user?.userInfo?.profile_img || ""} alt="company" />
            <AvatarFallback>
              {user?.userStartUp?.company_name?.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
        </label>
        <input
          type="file"
          id="upload-image"
          className="hidden"
          ref={fileInputRef}
          onChange={handleUploadNewImage}
        />
        <div className="flex justify-start mt-5 flex-col gap-1">
          <span
            className="text-[#FF7A00] text-sm font-bold cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            Re-upload
          </span>
          <span className="text-[#808080] text-[13px]">or</span>
          <span
            className="text-[#FF7A00] text-sm font-bold cursor-pointer"
            onClick={handleDeleteImage}
          >
            Delete
          </span>
        </div>
      </div>
    </section>
  );
}
