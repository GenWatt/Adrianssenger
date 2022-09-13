export default function useForm() {
  const convertFormDataToObject = <T>(data: HTMLFormElement): T | {} => {
    const formData = new FormData(data)
    let formDataObj: T | {} = {}
    //@ts-ignore
    formData.forEach((value, key) => (formDataObj[key] = value))
    return formDataObj
  }

  return { convertFormDataToObject }
}
