"use client";

import React, { useEffect, useRef, useState } from "react";
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

// The ImageUpload component serves as a reusable UI element that allows users to:

// Select an image file from their local device.
// Upload that image to ImageKit's cloud storage.
// Display a preview of the uploaded image.
// Provide immediate feedback (success/error toasts) on the upload status.

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(`Authentication request Failed: ${error.message}`);
  }
};

interface Props {
  type: 'image' | 'video'; 
  /** valid MIME/select string, e.g. "image/*" or "video/mp4" */
  accept: string; 
  placeholder: string; 
  /** folder path inside ImageKit, e.g. "books/covers" */
  folder: string; 
  variant: 'dark' | 'light'; 
  value?: string; 
  onFileChange: (filePath: string) => void
}

const FileUpload = ({ 
  type,
  accept,
  placeholder,
  folder,
  variant,
  value,
  onFileChange,
 }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null); // triggers the file selection dialog box 
  const [fileUrl, setFileUrl] = useState<string | null>(null); // stores teh url of the uploaded image
  const [progress, setProgress] = useState(0); 

  const styles = {
    button: variant === 'dark' ? 'bg-dark-300' : 'bg-light-600', 
    placeholder: variant === 'dark' ? 'text-light-100' : 'text-slate-500', 
    text: variant === 'dark' ? 'text-light-100' : 'text-dark-400'
  }

  // re-runs whenever the value prop changes 
  useEffect(() => {
    if(value) setFileUrl(value); 
  }, [value]); 

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // step 1: Get auth params 
      const { token, expire, signature } = await authenticator(); 

      // step 2: prepare upload data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("publicKey", publicKey);
      formData.append("signature", signature);
      formData.append("expire", expire);
      formData.append("token", token);

      if (folder) {
        formData.append('folder', folder)
      }

      const xhr = new XMLHttpRequest()
      xhr.open('POST', 'https://upload.imagekit.io/api/v1/files/upload')

      xhr.upload.onprogress = (evt) => {
        if(evt.lengthComputable) 
            setProgress(Math.round((evt.loaded / evt.total) * 100))
      }

      xhr.onload = () => {
        if(xhr.status >= 200 && xhr.status < 300) {
          const { url } = JSON.parse(xhr.responseText)
          setFileUrl(url)
          onFileChange(url)
          toast.success('Upload Complete')
        } else {
          toast.error('Upload Failed', {
            description: `Status ${xhr.status}`, 
          })
        }
      }

      xhr.onerror = () => toast.error('Network error during Upload')
      xhr.send(formData); 

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error('Upload Failed', { description: err.message }); 
      console.error(err); 
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
        accept={accept}
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <Button
        className={styles.button}
        onClick={(e) => {
          e.preventDefault();
          fileInputRef.current?.click(); // opens the file selection dialog box for the user 
        }}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />
        <p className="text-base text-light-100">Upload a {placeholder}</p>
      </Button>

      {/* progress bar */}

      {progress > 0 && progress < 100 && (
        <div className="mt-2 h-2 w-full overflow-hidden bg-gray-200 ">
          <div
            style={{width: `${progress}`}}
            className="h-full bg-primary transition-all"
          />
        </div>
      )}

      {/* Preview */}
      {fileUrl && (
        <>
          {type === 'image' ? (
            <Image
              src={fileUrl}
              alt="Uploaded preview"
              className="mt-4 object-contain"
              width={500}
              height={300}
            />
          ): (
            <video
              src={fileUrl}
              controls
              className="mt-4 max-w-full rounded"
            />
          )}
        </>
      )}
    </ImageKitProvider>
  );
};

export default FileUpload;
