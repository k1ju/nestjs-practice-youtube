export class VideoEntity {
  public idx: number;
  public channelIdx: number;
  public title: string;
  public content: string;
  public thumbnailImg: string;
  public createdAt: Date;

  constructor(data: VideoEntity) {
    this.idx = data.idx;
    this.channelIdx = data.channelIdx;
    this.title = data.title;
    this.content = data.content;
    this.thumbnailImg = data.thumbnailImg;
    this.createdAt = data.createdAt;
  }
}
