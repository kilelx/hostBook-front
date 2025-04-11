import { Input } from "./ui/input"

type InputFormProps = {
  label: string,
  name: string,
  placeholder: string,
  register: any,
  errors: any
}

function InputForm({label, name, placeholder, register, errors}: InputFormProps) {
  return (
    <div className="space-y-2">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <Input
      id={name}
      type="text"
      placeholder={placeholder}
      {...register(name)}
      className={`bg-white/90 border-amber-100 focus:border-[#f04c23] focus:ring-[#f04c23]/20 transition-all ${errors[name] ? 'border-destructive' : ''}`}
    />
  </div>
  )
}

export default InputForm