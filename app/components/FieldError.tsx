import { useField } from 'remix-validated-form'

interface FieldErrorProps {
  name: string
}

export default function FieldError({ name }: FieldErrorProps) {
  const field = useField(name)

  if (!field.error) {
    return null
  }

  return <div className="text-red-600 text-sm">{field.error}</div>
}
