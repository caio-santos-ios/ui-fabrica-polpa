import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pulpa | Login",
};

export default function SignIn() {
  return (
    <div className="h-dvh w-dvw flex justify-center items-center">
      <SignInForm />
    </div>
  );
}
