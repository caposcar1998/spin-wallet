import { CustomButton } from "@/components/general/button";
import { Title } from "@/components/general/title";
import Link from "next/link";

export default function Main() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
      <Title size="lg" className="text-primary">Bienvenido a Spin wallet</Title>
      <p className="text-gray-600">La cartera de tus sueños</p>
      <Link href="/login" className="mt-2">
        <CustomButton testId="go-login-button" message="Ir a login" />
      </Link>
    </main>
  );
}
