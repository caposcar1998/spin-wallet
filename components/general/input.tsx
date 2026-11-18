interface CustomInputProps {
  type: string;
  name: string;
  required?: boolean;
  testId?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CustomInput({ type, name, required, testId, onChange }: CustomInputProps) {
  return (
    <>
     <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-800 capitalize">{name}</label>
    <input
      id={name}
      type={type}
      name={name}
      required={required}
      onChange={onChange}
      data-testid={testId}
      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none block w-full px-3.5 py-2.5 shadow-sm transition-shadow placeholder:text-gray-400"
    />
    </>
  );
}
