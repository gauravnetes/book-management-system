import ImageKit from "imagekit";
import config from "@/lib/config";
import { NextResponse } from "next/server";

const {
  env: {
    imagekit: { publicKey, privateKey, urlEndPoint },
  },
} = config;

const imagekit = new ImageKit({
  publicKey: publicKey,
  privateKey: privateKey,
  urlEndpoint: urlEndPoint,
});

export async function GET() {
    return NextResponse.json(imagekit.getAuthenticationParameters())
}