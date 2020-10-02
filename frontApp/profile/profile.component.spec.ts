import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { RouterTestingModule} from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { httpusers } from '../../environments/httpText'

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let users = httpusers;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      imports: [ RouterTestingModule, HttpClientTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch', () => {
    let testId=1;
    let testName=users[testId-1]["username"];
    component.nameMsg=testName;
    component.usertext=users;
    component.userToArray();
    expect(component.emailMsg).toBe(users[testId-1]["email"]);
    expect(component.phoneMsg).toBe(users[testId-1]["phone"]);
    expect(component.zipMsg).toBe(users[testId-1]["address"]["zipcode"]);
  });
});
