import { ILogin } from './ILogin';

export interface IRegister extends ILogin {
  confirmPassword: string
}
