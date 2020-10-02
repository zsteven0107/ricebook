import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingComponent } from './landing.component';
import { RouterTestingModule} from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { httpusers } from '../../environments/httpText'

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let users = httpusers;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule, BrowserModule, FormsModule, ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login', () => {
    component.lusername = "Bret";
    component.lpassword = "Kulas Light";
    component.lToMain();
    expect(component.ifLogin).toBe(0);
  });

  it('should not login', () => {
    component.lusername = "Brettt";
    component.lpassword = "Kulas Light";
    component.lToMain();
    expect(component.ifLogin).toBe(0);
  });

  it('should alert', () => {
    spyOn(window,"alert");
    component.lusername = "Brettt";
    component.lpassword = "Kulas Light";
    component.lToMain();
    expect(window.alert).toHaveBeenCalledWith("No such username!");
  })

});
