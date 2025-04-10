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
    <label htmlFor="parkingInstructions" className="text-sm font-medium">
      {label}
    </label>
    <Input
      id={label}
      type="text"
      placeholder={placeholder}
      {...register(name)}
      className={errors[name] ? 'border-destructive' : ''}
    />
  </div>
  )
}

export default InputForm