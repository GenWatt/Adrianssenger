export default function useMesure() {
  const pixelsFromTopToElement = (element: HTMLElement) => window.innerHeight - element.offsetTop

  return { pixelsFromTopToElement }
}
