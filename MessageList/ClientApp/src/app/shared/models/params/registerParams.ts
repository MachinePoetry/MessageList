import { LoginParams } from './loginParams';

export class RegisterParams extends LoginParams {
  public confirmPassword: string = '';
}
