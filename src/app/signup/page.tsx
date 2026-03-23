import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Pulpa | Cadastro" };

export default function SignUpPage() {
  return (
    <div className="h-dvh w-dvw flex justify-center items-center">
      <SignUpForm />
    </div>
  );
}
