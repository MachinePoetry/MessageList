import { User } from '../../../shared/models/user';

export class ConfirmModalParams {
  constructor(public requestMethod: string, public header: string, public body: string,
              public authUserInfo: User, public entityId: number, public url: string, public params: any) { }

}
