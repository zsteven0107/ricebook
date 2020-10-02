import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../main/user';
import { Login } from '../main/login';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  // user_list = [];
  // login_list = [];
  lusername = '';
  lpassword = '';
  ifLogin = true;
  constructor(private router: Router,
              private http: HttpClient) { }

  ngOnInit(): void{}

  rToMain(){
    var rName = <HTMLInputElement>document.getElementById("rName");
    var rPass = <HTMLInputElement>document.getElementById("rPass");
    var rEmail = <HTMLInputElement>document.getElementById("rEmail");
    var rZip = <HTMLInputElement>document.getElementById("rZipcode");
    var rDob = <HTMLInputElement>document.getElementById("rDob");
    if(rName.value.match('^[A-Za-z][A-Za-z0-9]{0,}$')==null){alert("Form of register name is wrong!");return false;}
    if(rPass.value.length>18||rPass.value.length<6){alert("Form of password is wrong!");return false;}
    if(rEmail.value.match('^[A-Za-z0-9_-]+@([A-Za-z0-9_-])+(\.[A-Za-z]{1,})$')==null){alert("Form of update email is wrong!");return false;}
    if(rZip.value.match('^[1-9][0-9]{4}$')==null){alert("Form of zipcode is wrong!");return false;}
    if(rDob.value.match(/^((19[2-9]\d{1})|(20((0[0-9])|(1[0-8]))))\-((0?[1-9])|(1[0-2]))\-((0?[1-9])|([1-2][0-9])|30|31)$/)==null){alert("Form of dob is wrong");return false;}
    // for(var i=0;i<this.user.length;i++){
    //   if(rName.value==this.user[i]["username"]){
    //     alert("The name already exists!");
    //     return false;
    //   }
    // }
    this.http.post("http://zs7bc.herokuapp.com/register",{
      username: rName.value,
      password: rPass.value,
      email: rEmail.value,
      zipcode: rZip.value,
      dob: rDob.value,
      headline: '',
      following: [],
      avatar: ''
    }).subscribe();


    this.router.navigate(['/main'],{
      queryParams:{
        lName:rName.value
        }
    });
  }

  lToMain(){
    // var lName = <HTMLInputElement>document.getElementById("lName");
    // var lPass = <HTMLInputElement>document.getElementById("lPass");
    this.http.post("http://zs7bc.herokuapp.com/login",{
      username: this.lusername,
      password: this.lpassword
    },{
      withCredentials:true
    }).subscribe(res => {
      // console.log(res)
      if(res['result']=='No such user'){
        alert("No such user");
        return false;
      }
      else if(res['result']=='password not match'){
        alert("password not match");
        return false;
      }
      this.router.navigate(['/main'],{
        queryParams:{
          lName:this.lusername
          }
      });
    });
  }

  // checkLoginState() {
  //   FB.getLoginStatus(function(response) {
  //     statusChangeCallback(response);
  //   });
  // }
}
