export class ChangePasswordParams {
  constructor(public authUserId: number | null = null, public oldPassword: string = '', public newPassword: string = '') {}
}
