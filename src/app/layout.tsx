import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";

export const metadata = {
  title: "Husksheets",
  description: "Collaborative spreadsheet application",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};


/**
 * Root layout for the application.
 * @author Brooke Chalmers
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} h-full`}>
      <body className="h-full">
        {children}
      </body>
    </html>
  );
}
