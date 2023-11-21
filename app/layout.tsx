"use client";

import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import "../styles/globals.css";
import { Provider } from "react-redux";
import { store_0001 } from "./redux/store";
import React from "react";
import ReduxProvider from "./providers/redux-provider";

let title = "Dream Room Generator";
let description = "Generate your dream room in seconds.";
let ogimage = "https://roomgpt-demo.vercel.app/og-image.png";
let sitename = "roomGPT.io";

// export const metadata: Metadata = {
//   title,
//   description,
//   icons: {
//     icon: "/favicon.ico",
//   },
//   openGraph: {
//     images: [ogimage],
//     title,
//     description,
//     url: "https://roomgpt-demo.vercel.app",
//     siteName: sitename,
//     locale: "en_US",
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     images: [ogimage],
//     title,
//     description,
//   },
// };

export default function RootLayout({
  children,
  ...rest
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* <body className="bg-[#17181C] text-white"> */}
      <body className="bg-white text-black">
        <Provider store={store_0001}>
          <div>{children}</div>
        </Provider>
        <Analytics />
      </body>
    </html>
  );
}
