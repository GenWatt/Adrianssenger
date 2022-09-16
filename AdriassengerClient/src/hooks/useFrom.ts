import { useState, useRef } from 'react'
import { FormSchema, Rules, ValidationRuleType } from '../global'

export default function useForm<T extends string>() {
  const isError = useRef<boolean>(false)
  const [errors, setErrors] = useState<{ [K: string]: string[] }>({})

  const convertFormDataToObject = <K>(data: HTMLFormElement): K | {} => {
    const formData = new FormData(data)
    let formDataObj: K | {} = {}
    //@ts-ignore
    formData.forEach((value, key) => (formDataObj[key] = value))
    return formDataObj
  }

  const notEmail = (value: string, rule?: boolean) => {
    if (!rule) return false
    if (
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
        value
      )
    ) {
      return false
    }
    return true
  }

  const isMax = (value: string, rule?: number) => {
    if (!rule) return false
    if (value.length > rule) {
      return true
    }
    return false
  }

  const isMin = (value: string, rule?: number) => {
    if (!rule) return false
    if (value.length < rule) {
      return true
    }
    return false
  }

  const isRequired = (value: string, rule?: boolean) => {
    if (!rule) return false
    if (!value.length) {
      return true
    }
    return false
  }

  const findRuleInSchema = (propName: Extract<T, string>, schema: readonly FormSchema[]) => {
    return schema.find((input) => input.name === propName)?.rules
  }

  const handleSetErrors = (message: string, propName: T) => {
    isError.current = true
    setErrors((prev) => {
      if (!prev[propName]) return { ...prev, [propName]: [message] }
      return { ...prev, [propName]: [...prev[propName], message] }
    })
  }

  const checkIfValueIsCorrect = (value: string, rules: Rules, propName: T) => {
    for (const rule in rules) {
      switch (rule) {
        case ValidationRuleType.MAX:
          isMax(value, rules[rule]) &&
            handleSetErrors(`${propName} should have at least ${rules[rule]} characters!`, propName)
          break
        case ValidationRuleType.MIN:
          isMin(value, rules[rule]) &&
            handleSetErrors(`${propName} should have ${rules[rule]} or more characters!`, propName)
          break
        case ValidationRuleType.ISEMAIL:
          notEmail(value, rules[rule]) && handleSetErrors(`Incorrect E-mail address!`, propName)
          break
        case ValidationRuleType.REQUIRED:
          isRequired(value, rules[rule]) && handleSetErrors(`${propName} is required!`, propName)
          break
        default:
          break
      }
    }
  }

  const resetError = (propName?: T) => {
    if (!propName) return setErrors({})
    if (errors[propName]) {
      setErrors((prev) => {
        let newErrors = prev
        delete newErrors[propName]
        return { ...newErrors }
      })
    }
  }

  const validate = (values: { [K in T]: string }, schema: readonly FormSchema[]) => {
    setErrors({})
    isError.current = false
    for (const propName in values) {
      const rulesForValue = findRuleInSchema(propName, schema)

      if (rulesForValue) {
        checkIfValueIsCorrect(values[propName], rulesForValue, propName)
      }
    }
  }

  return { convertFormDataToObject, validate, isError, errors, resetError }
}
