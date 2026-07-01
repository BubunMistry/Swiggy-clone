import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { CurrentActorProvider } from "../hooks/useCurrentActor";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Fuddu Delivery",
  description: "Advanced food delivery platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CurrentActorProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </CurrentActorProvider>
      </body>
    </html>
  );
}
