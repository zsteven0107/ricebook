import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainComponent } from './main.component';
import { RouterTestingModule} from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { httpusers,httpposts } from '../../environments/httpText'

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let users = httpusers;
  let posts = httpposts;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule, BrowserModule, FormsModule, ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch', () => {
    let testId=1;
    let testName=users[testId-1]["username"];
    component.userName=testName;
    component.posttext=posts;
    component.usertext=users;
    component.postToArray();
    component.userToArray();
    for(var i=0;i<component.currentpost.length;i++){
      expect(component.currentpost[i]["title"]).toBe(posts[i]["title"]);
      expect(component.currentpost[i]["body"]).toBe(posts[i]["body"]);
    }
  })

  it('should follow', () => {
    let testId=1;
    let testName=users[testId-1]["username"];
    component.userName=testName;
    component.posttext=posts;
    component.usertext=users;
    component.postToArray();
    component.userToArray();

    let followId = 2;
    let followName=users[followId-1]["username"];
    component.addname = followName;
    component.follow();
    for(var i=0;i<10;i++){
      expect(component.currentpost[i]["title"]).toBe(posts[20-i-1]["title"]);
      expect(component.currentpost[i]["body"]).toBe(posts[20-i-1]["body"]);
    }
  })

  it('should unfollow', () => {
    let testId=1;
    let testName=users[testId-1]["username"];
    component.userName=testName;
    component.posttext=posts;
    component.usertext=users;
    component.postToArray();
    component.userToArray();

    let followId = 2;
    let followName=users[followId-1]["username"];
    component.addname = followName;
    component.follow();

    let unfollowId = 2;
    let unfollowName=users[followId-1]["username"];
    component.unfollow(unfollowName);
    expect(component.currentpost.length).toBe(10);
  })

  it('should filter', () => {
    let testId=1;
    let testName=users[testId-1]["username"];
    component.userName=testName;
    component.posttext=posts;
    component.usertext=users;
    component.postToArray();
    component.userToArray();

    component.searchInput = "sunt";
    component.search();
    for(var i=0;i<component.currentpost.length;i++){
      expect(component.currentpost[i]["body"]).toContain(component.searchInput);
    }
  })

  it('should logout', () => {
    component.toLanding();
    expect(component.ifLogout).toBe(1);
  });
});
