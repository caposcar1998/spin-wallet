import { CustomButton } from "@/components/general/button";
import Link from "next/link";

export default function Main() {
  return (
    <>
      <main className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Bienvenido a Spin wallet</h2>
        <Link href="/login">
          <CustomButton testId="go-login-button" message="Ir a login" />
        </Link>
      </main>
    </>
  );
}
