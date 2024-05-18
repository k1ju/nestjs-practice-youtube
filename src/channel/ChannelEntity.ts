export class ChannelEntity {
  public idx: number;
  public pw: string;
  public name: string;
  public description: string;
  public profileImg: string;
  public createdAt: Date;

  constructor(data: ChannelEntity) {
    Object.assign(this, data);
  }
}

// Model에 대한 타입을 ORM이 만들어주냐 안 만들어주냐
