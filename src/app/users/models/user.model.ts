export class BaseUser {
  firstName: string;
  lastName: string;
  email: string;

  constructor(data: Partial<BaseUser>) {
    this.firstName = data?.firstName ?? '';
    this.lastName = data?.lastName ?? '';
    this.email = data?.email ?? '';
  }
}

export class User extends BaseUser {
  id: string;
  children: BaseUser;

  constructor(data: Partial<User>) {
    super(data);
    this.id = data?.id ?? '';
    this.children = new BaseUser({ ...data?.children });
  }
}
