"use client";

import config from "@/lib/config";
import { ImageKitProvider, Video } from "@imagekit/next";
import React from "react";

const BookTrailer = ({ videoUrl }: { videoUrl: string }) => {
  return (
    <ImageKitProvider
      publicKey={config.env.imagekit.publicKey}
      urlEndpoint={config.env.imagekit.urlEndPoint}
    >
      <Video src={videoUrl} controls className="w-full rounded-xxl" />
    </ImageKitProvider>
  );
};

export default BookTrailer;
