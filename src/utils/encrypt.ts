import { JSEncrypt } from 'jsencrypt'

export const RSA = (value: string): string => {
  const publicKey = `-----BEGIN PUBLIC KEY-----
	MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDI34aNUUy6y40CmssC6ISl9xGz
	SJTkhZjx8YJTAJmbSqU0Xf/R76ufJg/qF1NA5TR67KBUIzBL14tEhTusUQIVCznI
	TBYEic0/EKMtAFPfPfxKxL/h8VTWvvaL4ub3KwQLcorDVV+yH3DqZDCa+/hMFnLY
	nq8j5WlTE4jvPhR7WQIDAQAB
	-----END PUBLIC KEY-----`

  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey)
  const password = encryptor.encrypt(value)
  return password || ''
}
