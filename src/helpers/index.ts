// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/camelcase
export function logToConsole (message?: any, dev_only = true, ...params: any[]) {
  // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
  if ((dev_only && process.env.NODE_ENV !== 'production') || !dev_only) {
    console.log(message, params)
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/camelcase
export function logErrorToConsole (message?: any, dev_only = true, ...params: any[]) {
  // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
  if ((dev_only && process.env.NODE_ENV !== 'production') || !dev_only) {
    console.error(message, params)
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/camelcase
export function logInfoToConsole (message?: any, dev_only = true, ...params: any[]) {
  // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
  if ((dev_only && process.env.NODE_ENV !== 'production') || !dev_only) {
    console.info(message, params)
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/camelcase
export function logWarningConsole (message?: any, dev_only = true, ...params: any[]) {
  // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
  if ((dev_only && process.env.NODE_ENV !== 'production') || !dev_only) {
    console.warn(message, params)
  }
}
