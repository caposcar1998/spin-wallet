import { SubTitle } from "@/components/general/subTitle";

export function Footer() {
  return (
    <footer className="mt-auto p-4 bg-secondary">
      <div className="flex">
        <div className="bg-secondary basis-1/3 flex items-center justify-center">
          <SubTitle size="sm">Conocenos</SubTitle>
        </div>
        <div className="bg-secondary basis-1/3 flex items-center justify-center">
          <SubTitle size="sm">Información de la empresa</SubTitle>
        </div>
        <div className="bg-secondary basis-1/3 flex items-center justify-center">
          <SubTitle size="sm">Términos y condiciones</SubTitle>
        </div>
      </div>
    </footer>
  );
}
