/**
 * If `condition` is true, return `className`, else return `other` or an empty string
 */
export const is = (condition: boolean, className: string, other?: string) => (condition ? className : other || '')
