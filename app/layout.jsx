import "./globals.css";
export const metadata = {
  title: "Eli Soroño | AI Creative & Web Developer",
  description:
    "AI-generated e-commerce imagery, video concepts and web development portfolio.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
