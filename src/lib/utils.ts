import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatRUT = (rut: string) => {
  // Remove all non-digit and non-K/k characters
  const cleanRUT = rut.replace(/[^0-9kK]/g, '').toUpperCase()

  // Split the RUT into body and verifier
  const body = cleanRUT.slice(0, -1)
  const verifier = cleanRUT.slice(-1)

  // Format the body with dots
  let formattedBody = ''
  for (let i = body.length - 1, j = 0; i >= 0; i--, j++) {
    formattedBody = body[i] + formattedBody
    if (j % 3 === 2 && i !== 0) {
      formattedBody = '.' + formattedBody
    }
  }

  return `${formattedBody}-${verifier}`
}