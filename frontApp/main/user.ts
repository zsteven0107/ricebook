export class User{
  public username:string;
  public password:string;
  public email:string;
  public zipcode:string;
  public dob:string;
  public headline:string;
  public following:Array<string>;
  public avatar: string;

  constructor(username:string, password:string, email:string, zipcode:string, dob:string, headline:string, following:Array<string>, avatar:string){
    this.username = username;
    this.password = password;
    this.email = email;
    this.zipcode = zipcode;
    this.dob = dob;
    this.headline = headline;
    this.following = following;
    this.avatar = avatar;
  }
}
