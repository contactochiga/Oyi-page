import { notFound } from "next/navigation";
import { SiteHeader, SiteFooter } from "@/components/OyiSite";
import { Checkout } from "@/components/hardware/Checkout";
import { enabled } from "@/lib/checkout/server";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Hardware cart",
  robots: { index: false, follow: false },
};
export default function Page() {
  if (!enabled()) notFound();
  return (
    <>
      <SiteHeader />
      <Checkout
        cartOnly
        testLabel={
          process.env.NODE_ENV !== "production" &&
          process.env.CHECKOUT_LOCAL_REHEARSAL === "true"
        }
      />
      <SiteFooter />
    </>
  );
}
