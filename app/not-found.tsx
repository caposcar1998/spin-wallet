import Image from "next/image";
import notFoundImage from "@/public/spin-not-found.png";
import { Title } from "@/components/general/title";
export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Title size="sm" className="mb-4">
        Lo sentimos, la página que buscas no existe.
      </Title>
      <Image src={notFoundImage} alt="404" width={400} height={400} />
    </div>
  );
}
