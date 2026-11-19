export function Footer() {
  return (
    <footer className="mt-auto bg-primary px-6 py-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-around">
        <span className="text-sm text-white/80 text-center"><a href="https://github.com/caposcarfemsa" target="_blank" rel="noopener noreferrer">Conócenos</a></span>
        <span className="text-sm text-white/80 text-center">
         <a href="https://spinbyoxxo.com.mx/" target="_blank" rel="noopener noreferrer">Información de la empresa</a>
        </span>
        <span className="text-sm text-white/80 text-center">
          <a href="https://spinbyoxxo.com.mx/" target="_blank" rel="noopener noreferrer">Términos y condiciones</a>
        </span>
      </div>
    </footer>
  );
}
