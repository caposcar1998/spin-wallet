interface CustomInputProps {
  type: string;
  name: string;
  required?: boolean;
}

export function CustomInput({ type, name, required }: CustomInputProps) {
  return (
    <input
      type={type}
      name={name}
      required={required}
      className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
    />
  );
}
