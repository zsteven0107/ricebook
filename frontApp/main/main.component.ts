import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
//import 'rxjs/add/operator/map';
import { Post } from './post';
import { User } from './user';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  userPhoto = ''
  userName = '';
  userStatus = 'Add Status...';
  articling:string = '';
  user=[];
  addname='';
  searchInput='';
  IN = ""
  public posttext:any;
  public usertext:any;
  public followtext:any;
  public followposttext:any;
  public unfollowtext:any;
  username = [];
  follower=[];
  post = [];
  currentpost=[];
  backupost=[];
  ifLogout = 0;
  date = new Date();
  selectedFile:File;

  clearArticle(){
    this.articling=null;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient
    ) {
      activatedRoute.queryParams.subscribe(queryParams => {
      if(JSON.stringify(queryParams)!="{}"&&queryParams.lName.length>0){
        this["userName"] = queryParams.lName;
      }
    });
    }

  ngOnInit(): void{

    this.http.get("http://zs7bc.herokuapp.com/headline/"+this["userName"],{
      withCredentials:true
    }).
    subscribe(data=>{
      this['userStatus']=data['headline'];
      this['userPhoto']=data['avatar'];
    });

    this.http.get("http://zs7bc.herokuapp.com/following/"+this["userName"],{
      withCredentials:true
    }).
    subscribe(data=>{
      this.usertext=data;
      this.userToArray();
    });


  }

  userToArray(){
    for(var i=this.usertext.length-1;i>=0;i--){
      this.http.get("http://zs7bc.herokuapp.com/headline/"+this.usertext[i],{
        withCredentials:true
      }).
      subscribe(data=>{
        var fUser=new User(data["username"],
                              '',
                              '',
                              '',
                              '',
                              data["headline"],
                              [],
                              data["avatar"])
        this.follower.unshift(fUser);
        // console.log(this.follower)
      });
    }
    this.http.get("http://zs7bc.herokuapp.com/articlenumber/1",{
      withCredentials:true
    }).
    subscribe(data=>{
      this.posttext=data;
      if(this.posttext.length>0){
        for(var i=this.posttext.length-1;i>=0;i--){
          var pArticle=new Post(this.posttext[i]["number"],
                                this.posttext[i]["author"],
                                this.posttext[i]["id"],
                                this.posttext[i]["text"],
                                this.posttext[i]["date"],
                                this.posttext[i]["image"],
                                this.posttext[i]["comments"]);
          this.post.push(pArticle);
          if(pArticle.author==this["userName"]||this.usertext.indexOf(pArticle.author)!=-1){
            this.currentpost.push(pArticle);
            this.backupost.push(pArticle);
          }
        }
        if(this.currentpost.length>10){
          this.currentpost = this.currentpost.slice(0,10);
          this.backupost = this.backupost.slice(0,10);
        }
      }
    });
  }


  toLanding(){
    this.router.navigate(['/']);
    this.ifLogout = 1;
  }

  toProfile(){
    var profileName = this.userName;
    this.router.navigate(['/profile'],{
      queryParams:{
        profileName:profileName
      }
    });}

  uStatus(){
    var uStatus = <HTMLInputElement>document.getElementById("nStatus");
    if(uStatus.value.length>0){
    this.userStatus = uStatus.value;
    this.http.put("http://zs7bc.herokuapp.com/headline/",{
      username: this["userName"],
      headline: uStatus.value
    },{
      withCredentials:true
    }).subscribe();
    uStatus.value="";}
  }

  follow(){
    var followName = <HTMLInputElement>document.getElementById("addFollower");
    this.http.put("http://zs7bc.herokuapp.com/following/"+followName.value,{
      username: this["userName"]
    },{
      withCredentials:true
    }).subscribe();
    this.http.get("http://zs7bc.herokuapp.com/headline/"+followName.value,{
      withCredentials:true
    }).subscribe(data => {
      var newFollower = new User(data["username"],
                            '',
                            '',
                            '',
                            '',
                            data["headline"],
                            [],
                            '');
      this.follower.unshift(newFollower);
    });
    // console.log(this.post[0].author)
    for(var i=0;i<this.post.length;i++){
      if(this.post[i].author==followName.value){
        this.http.get("http://zs7bc.herokuapp.com/articles/"+this.post[i].id,{
          withCredentials:true
        }).subscribe(data => {
          this.followposttext = data;
          for(var i=0;i<this.followposttext.length;i++){
            var newFollowArticle = new Post(data[i]["number"],
                                  data[i]["author"],
                                  data[i]["id"],
                                  data[i]["text"],
                                  data[i]["date"],
                                  data[i]["image"],
                                  data[i]["comment"]);
            this.currentpost.unshift(newFollowArticle);
            this.backupost.unshift(newFollowArticle);
          }
        });
      }
    }
    followName.value = '';
  }


  unfollow(username){
    // console.log(this.post)
    this.http.delete("http://zs7bc.herokuapp.com/following/"+username,{
      withCredentials:true
    }).subscribe(
      // data =>{
      //   console.log(data)
      // }
    );
    for(var i=0;i<this.follower.length;i++){
      if(this.follower[i].username==username){
        this.follower.splice(i,1);
      }
    }
    for(var i=this.post.length-1;i>=0;i--){
      if(this.post[i].author==username){
            this.currentpost.splice(i,1);
            this.backupost.splice(i,1);
      }
    }
  }


  postArticle(){
    const nData = new FormData();
    nData.append('image', this.selectedFile, this.selectedFile.name);
    this.http.put("http://zs7bc.herokuapp.com/image",nData,{
      withCredentials:true
    }).subscribe(res=>{
      var postInput = <HTMLInputElement>document.getElementById("postInput");
      if(postInput.value.length>0){
        var newArticle=new Post('1',this["userName"],(this.post.length+1).toString(),postInput.value,'right now',res['image'],['comment1...','comment2...','comment3...']);
        this.post.push(newArticle);
        this.currentpost.unshift(newArticle);
        this.backupost.unshift(newArticle);
      }
      this.http.post("http://zs7bc.herokuapp.com/article",{
        number:1,
        author: this["userName"],
        id: this.post.length,
        text: postInput.value,
        date: 'right now',
        image: res['image'],
        comments: ['comment1...','comment2...','comment3...'],
      },{
        withCredentials:true
      }).subscribe();
    postInput.value = '';
    });
  }

  search(){
    // var searchInput = <HTMLInputElement>document.getElementById("searchInput");
    for(var i=this.currentpost.length-1;i>0;i--){
      var search_index = this.currentpost[i]["text"].indexOf(this.searchInput)
      if(search_index==-1){this.currentpost.splice(i,1)}
      // else{i--;}
    }
    if(this.searchInput.length==0){
      this.currentpost.splice(0,this.currentpost.length);
      for(var i=0;i<this.backupost.length;i++){
        this.currentpost.push(this.backupost[i]);
      }
    }
    this.searchInput='';
  }

  edit(articleAuthor){
    if(articleAuthor != this["userName"]){alert("cannot modify others' text");return false;}
    else{
      var inputText = <HTMLInputElement>document.getElementById("modText");
      inputText.style.display = 'block';
    }
  }

  save(articleId){
    var inputText = <HTMLInputElement>document.getElementById("modText");
    inputText.style.display = 'none';
    for(var i=0;i<this.currentpost.length;i++){
      if(this.currentpost[i].id==articleId){
        this.currentpost[i].text=inputText.value;
      }
    }
    this.http.put("http://zs7bc.herokuapp.com/articles/"+articleId,{
      text: inputText.value
    },{
      withCredentials:true
    }).subscribe();
    inputText.value = '';
  }

  c1tEdit(){
    var inputText = <HTMLInputElement>document.getElementById("modC1");
    inputText.style.display = 'block';
  }

  c1Save(articleId){
    var inputText = <HTMLInputElement>document.getElementById("modC1");
    inputText.style.display = 'none';
    for(var i=0;i<this.currentpost.length;i++){
      if(this.currentpost[i].id==articleId){
        this.currentpost[i].comment[0]=inputText.value;
      }
    }
    this.http.put("http://zs7bc.herokuapp.com/commentfirst/"+articleId,{
      text: inputText.value
    },{
      withCredentials:true
    }).subscribe();
    inputText.value = '';
  }

  c2tEdit(){
    var inputText = <HTMLInputElement>document.getElementById("modC2");
    inputText.style.display = 'block';
  }

  c2Save(articleId){
    var inputText = <HTMLInputElement>document.getElementById("modC2");
    inputText.style.display = 'none';
    for(var i=0;i<this.currentpost.length;i++){
      if(this.currentpost[i].id==articleId){
        this.currentpost[i].comment[1]=inputText.value;
      }
    }
    this.http.put("http://zs7bc.herokuapp.com/commentsecond/"+articleId,{
      text: inputText.value
    },{
      withCredentials:true
    }).subscribe();
    inputText.value = '';
  }

  c3tEdit(){
    var inputText = <HTMLInputElement>document.getElementById("modC3");
    inputText.style.display = 'block';
  }

  c3Save(articleId){
    var inputText = <HTMLInputElement>document.getElementById("modC3");
    inputText.style.display = 'none';
    for(var i=0;i<this.currentpost.length;i++){
      if(this.currentpost[i].id==articleId){
        this.currentpost[i].comment[2]=inputText.value;
      }
    }
    this.http.put("http://zs7bc.herokuapp.com/commentthird/"+articleId,{
      text: inputText.value
    },{
      withCredentials:true
    }).subscribe();
    inputText.value = '';
  }

  fNameChange(event){
    this.selectedFile = event.target.files[0];
  }
}
