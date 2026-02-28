import type { Metadata } from "next";
import "@/app/globals.css";
import AuthProviderWrapper from "@/components/providers/AuthProviderWrapper";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "TutorOS | AI-Powered Math Tutoring",
  description:
    "Advanced question bank management and AI-powered quiz curation for math educators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <AuthProviderWrapper>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#18181b",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              },
            }}
          />
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
