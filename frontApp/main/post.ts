export class Post{
  public number:string;
  public author:string;
  public id:string;
  public text:string;
  public date:string;
  public image:string;
  public comment:Array<string>;

  constructor(number:string, author:string, id:string, text:string, date:string, image:string, comment:Array<string>){
    this.number = number;
    this.author = author;
    this.id = id;
    this.text = text;
    this.date = date;
    this.image = image;
    this.comment = comment;
  }
}
