'use client';

import { useEffect, useState, useRef } from "react";
import Link from 'next/link';
import Image from 'next/image';
import '../../app/globals.css';
import { useRouter } from 'next/navigation';

export default function UploadProfilePicture() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Create a reference to the file input

  useEffect(() => {
    // Add any necessary side effects here
  }, []);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file

    if (file) {
      const fileSize = file.size / 1024 / 1024; // Convert size to MB

      // Check if the file is of valid type (JPG, PNG) and under 1MB
      if (fileSize <= 1 && (file.type === "image/jpeg" || file.type === "image/png")) {
        // Handle the file upload logic here, e.g., upload to a server or set it in state
        console.log("File is valid: ", file);

        // Example: You could set the file in state to preview it
        setError(null); // Reset error
        // Optionally, you could show a preview of the image
        const reader = new FileReader();
        reader.onloadend = () => {
          // Do something with the file data (e.g., set image preview)
          console.log(reader.result); // This will be the base64 image data
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setError("Invalid file. Please upload a JPG or PNG file under 1MB.");
      }
    }
  };

  return (
    <div className="upload-container flex flex-col items-center justify-center max-w-[90vw] mx-auto py-8">
      <h1 className="font-montserrat font-bold text-[24px] leading-[29.26px] text-center text-white mb-4">Upload Profile Picture</h1>
      <p className="font-montserrat font-normal text-[16px] leading-[19.5px] text-center text-white mb-8">A picture can increase the chance of getting funds.</p>

      <div className="image-upload-container mb-6 relative rounded-full">
        <Image
          src={previewImage || "/images/profile-placeholder.svg"} // Replace with the image URL you want
          alt="Upload Profile Picture"
          width={120}
          height={120}
          className="rounded-full"
        />
      </div>

      <div className="file-upload-section mb-8 flex flex-col justify-center items-center">
        <input
          type="file"
          accept=".jpg,.png"
          ref={fileInputRef} // Attach ref to input element
          className="hidden"
          onChange={handleUpload}
        />
        <span
          className="cursor-pointer font-montserrat text-[14px] leading-[17.07px] tracking-[0%] text-[#FF7A00] py-2 rounded-md"
          onClick={() => fileInputRef.current?.click()} // Trigger file input click on text click
        >
          Browse
        </span>
        <p className="text-xs text-gray-500 mt-2">JPG, PNG files only. Max size: 1MB.</p>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="action-buttons flex gap-4 mt-6 flex-col justify-center items-center">
        <button
          onClick={() => router.push('/next-step')}
          className="w-[216px] h-[48px] gap-[10px] rounded-[8px] pt-[12px] pr-[81px] pb-[12px] pl-[81px] bg-[#FF7A00] text-white font-semibold"
        >
          Upload
        </button>
        <p className="font-montserrat font-normal text-[13px] leading-[15.85px] tracking-[0%] text-gray-500" onClick={() => router.push('/moreabout-details')}>
          Skip for now
        </p>
      </div>
    </div>
  );
}
