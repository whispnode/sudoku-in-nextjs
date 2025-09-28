import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Sudoku Game",
    description: "Built using nextjs, typescript",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`antialiased bg-zinc-950 text-white`}>
                {children}
            </body>
        </html>
    );
}
