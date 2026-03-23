import { Metadata } from "next";
import PDVContent from "@/components/pages/pdv/PDVContent";

export const metadata: Metadata = { title: "Pulpa | PDV" };

export default function PDVPage() {
  return <PDVContent />;
}
