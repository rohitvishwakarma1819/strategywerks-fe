export class UserCount {
  count: number;

  constructor(data: Partial<UserCount>) {
    this.count = data?.count ?? 0;
  }
}
