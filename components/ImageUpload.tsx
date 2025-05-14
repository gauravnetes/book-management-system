"use client";

import React, { useRef, useState } from "react";
import { ImageKitProvider } from "@imagekit/next";
import config from "@/lib/config";
import { Button } from "./ui/button";
import Image from "next/image";
import { toast } from 'sonner'

const {
  env: {
    imagekit: { publicKey, urlEndPoint },
  },
} = config;

const authenticator = async () => {
  try {
    const res = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Request Failed with Status: ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const { signature, expire, token } = data;

    return { token, expire, signature };
  } catch (error: any) {
    throw new Error(`Authentication request Failed: ${error.message}`);
  }
};

const ImageUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);

  const onSuccess = (res: any) => {
    setFile
  }
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { token, expire, signature } = await authenticator();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("publicKey", publicKey);
      formData.append("signature", signature);
      formData.append("expire", expire);
      formData.append("token", token);

      const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: formData,
      });

      const result = await uploadRes.json();
      setUploadedPath(result.url); // or result.filePath

      toast("Image Uploaded Successfully", {
        description: `${uploadedPath} Uploaded`
      })
      
    } catch (err) {
      console.error("Upload failed:", err);
      toast("Image Upload Failed", {
        description: `Your Image Could not be Uploaded. Please Try Again`,
        action: {
            label: 'x', 
            onClick: () => console.log('undo')
        }
      })
    }
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndPoint}
      authenticator={authenticator}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <Button
        className="upload-btn"
        onClick={(e) => {
          e.preventDefault();
          fileInputRef.current?.click();
        }}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />
        <p className="text-base text-light-100">Upload a File</p>
      </Button>

      {uploadedPath && (
        <Image
          src={uploadedPath}
          alt="Uploaded Image"
          className="mt-4 object-contain"
          width={500}
          height={300}
        />
      )}
    </ImageKitProvider>
  );
};

export default ImageUpload;
