import { Component, OnInit } from '@angular/core';
import{ FormBuilder } from '@angular/forms'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../main/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user = [];
  nameMsg = '';
  emailMsg = '';
  phoneMsg = '';
  zipMsg = '';
  passMsg = '';
  selectedFile:File;
  username = '';
  nUrl = '';
  picUrl = '';
  dobMsg = '';
  public usertext:any;
  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private http: HttpClient) {
                activatedRoute.queryParams.subscribe(queryParams => {
                if(JSON.stringify(queryParams)!="{}"&&queryParams.profileName.length<=20){
                  this["nameMsg"] = queryParams.profileName;
                }
                else{this["nameMsg"] = "Add your profile information";}
              });}

  ngOnInit(): void{
    this.http.get("http://zs7bc.herokuapp.com/dob/"+this["nameMsg"],{
      withCredentials:true
    }).
    subscribe(data=>{
      this['dobMsg'] = data['dob'];
      // this.usertext = data;
      // this.userToArray();
    });
    this.http.get("http://zs7bc.herokuapp.com/zipcode/"+this["nameMsg"],{
      withCredentials:true
    }).
    subscribe(data=>{
      this['zipMsg'] = data['zipCode'];
    });
    this.http.get("http://zs7bc.herokuapp.com/email/"+this["nameMsg"],{
      withCredentials:true
    }).
    subscribe(data=>{
      this['emailMsg'] = data['email'];
    });
    this.http.get("http://zs7bc.herokuapp.com/password/"+this["nameMsg"],{
      withCredentials:true
    }).
    subscribe(data=>{
      for(var i=0;i<data['password'].length;i++){
        this['passMsg'] += '*';
      }
    });
    this.http.get("http://zs7bc.herokuapp.com/avatar/"+this["nameMsg"],{
      withCredentials:true
    }).
    subscribe(data=>{
      this['picUrl'] = data['avatar']
    });
  }

  // userToArray(){
  //   for(var i=0;i<this.usertext.length;i++){
  //     var pUser=new User(this.usertext[i]["id"],
  //                           this.usertext[i]["name"],
  //                           this.usertext[i]["username"],
  //                           this.usertext[i]["email"],
  //                           this.usertext[i]["address"],
  //                           this.usertext[i]["phone"],
  //                           this.usertext[i]["website"],
  //                           this.usertext[i]["company"]);
  //     this.user.push(pUser);
  //   }
  //   for(var i=0;i<this.user.length;i++){
  //     if(this["nameMsg"]==this.user[i]["username"]){
  //       this["emailMsg"] = this.user[i]["email"];
  //       this["phoneMsg"] = this.user[i]["phone"];
  //       this["zipMsg"] = this.user[i]["address"]["zipcode"];
  //       this["passMsg"] ='';
  //       console.log(this.user[i]["address"])
  //       var s1=this.user[i]["address"]["street"];
  //       var l1=s1.length;
  //       for(var i=0;i<l1;i++){
  //         this["passMsg"] += '*';
  //       }
  //     }
  //   }
  // }

  toMain(){
    var URL = window.location.search.substring(1);
    var urlName = URL.split('=')[1];
    this.router.navigate(['/main'],{
      queryParams:{
        lName:urlName
      }
    });
  }

  showMsg(){
    var iName = <HTMLInputElement>document.getElementById("name");
    var iEmail = <HTMLInputElement>document.getElementById("email");
    var iZip = <HTMLInputElement>document.getElementById("zip");
    var iPassword = <HTMLInputElement>document.getElementById("password");
    this['passMsg'] = '';


    if(iName.value.match('^[A-Za-z][A-Za-z0-9]{0,}$')==null){alert("Form of update name is wrong!");return false;}
    if(iEmail.value.match('^[A-Za-z0-9_-]+@([A-Za-z0-9_-])+(\.[A-Za-z]{1,})$')==null){alert("Form of update email is wrong!");return false;}
    if(iZip.value.match('^[1-9][0-9]{4}$')==null){alert("Form of zipcode is wrong!");return false;}
    if(iPassword.value.length>15||iPassword.value.length<6){alert("Form of password is wrong!");return false;}

    this['emailMsg'] = iEmail.value;
    this.http.put("http://zs7bc.herokuapp.com/email/",{
      username: this["nameMsg"],
      email: iEmail.value
    },{
      withCredentials:true
    }).subscribe();

    this['zipMsg'] = iZip.value;
    this.http.put("http://zs7bc.herokuapp.com/zipcode/",{
      username: this["nameMsg"],
      zipcode: iZip.value
    },{
      withCredentials:true
    }).subscribe();

    for(var i=0;i<iPassword.value.length;i++){
      this["passMsg"] +='*';}
    this.http.put("http://zs7bc.herokuapp.com/password/",{
      username: this["nameMsg"],
      password: iPassword.value
    },{
      withCredentials:true
    }).subscribe();


    iName.value = "";
    iEmail.value = "";
    iZip.value = "";
    iPassword.value = "";
  }

  uploadImage(){
    const nData = new FormData();
    nData.append('avatar', this.selectedFile, this.selectedFile.name);
    this.http.put("http://zs7bc.herokuapp.com/avatar",nData,{
      withCredentials:true
    }).subscribe(res=>{
      this['picUrl'] = res['avatar'];
    });
  }

  fNameChange(event){
    this.selectedFile = event.target.files[0];
  }
}
