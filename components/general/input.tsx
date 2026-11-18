interface CustomInputProps {
  type: string;
  name: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CustomInput({ type, name, required, onChange }: CustomInputProps) {
  return (
    <>
     <label htmlFor="first_name" className="block mb-2.5 text-sm font-medium text-heading">{name}</label>
    <input
      type={type}
      name={name}
      required={required}
      onChange={onChange}
      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary focus:outline-none block w-full px-3 py-2.5 shadow-xs placeholder:text-gray-400"
    />
    </>
  );
}
