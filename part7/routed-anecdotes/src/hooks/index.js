import { useState } from 'react'


export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('') // Reset the field value to an empty string
  }

  return {
    type,
    value,
    onChange,
    reset // Return the reset method
  }
}

// modules can have several named exports

export const useAnotherHook = () => {
  // ...
}