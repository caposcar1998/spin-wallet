import { Title } from "@/components/title";

export function Footer() {
  return (
    <footer className="mt-auto p-4 bg-blue-500">
      <div className="flex">
        <div className="bg-blue-500 basis-1/3 flex items-center justify-center">
          <Title size="sm">Conocenos</Title>
        </div>
        <div className="bg-blue-500 basis-1/3 flex items-center justify-center">
          <Title size="sm">Información de la empresa</Title>
        </div>
        <div className="bg-blue-500 basis-1/3 flex items-center justify-center">
          <Title size="sm">Términos y condiciones</Title>
        </div>
      </div>
    </footer>
  );
}
