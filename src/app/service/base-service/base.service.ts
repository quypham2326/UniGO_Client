import {Injectable} from '@angular/core';
import {User} from "../../model/User";
import {University} from "../../model/University";

declare var $: any;

@Injectable()
export class BaseService {
  public title;
  public content;
  public user;
  public university;
  public review;
  public logo;
  public imgUni;
  public listMajorUni: any;
  public major: any;
  constructor() {

  }
  showLoginForm() {
    document.getElementById('openModalButton').click();
  }
  setUser(data){
    this.user = new User(data);
  }
  getUser(){
    return this.user;
  }
  setUniversity(data){
    this.university = new University(data);
  }
  getUniversity(){
    return this.university;
  }

  setLogoUni(data){
    this.logo = data;
  }
  getLogoUni(){
    return this.logo;
  }
  setImgUni(data){
    this.imgUni = data;
  }
  getImgUni(){
    return this.imgUni;
  }
  setMajorUni(value){
    this.listMajorUni = value;
  }
  getMajorUni(){
    return this.listMajorUni;
  }

  setValueMajorUni(value){
    this.major = value;
  }
  getValueMajorUni(){
    return this.major;
  }
}
