import {UserDataService} from "services/UserDataService";
import {inject} from "aurelia-dependency-injection";


@inject(UserDataService)
export class User {

  userDataService;

  username;
  profession;
  workhours;
  customTimeout;
  professions =  [
    {
      "name": "TechSupport"
    },
    {
      "name": "Salesman"
    },
    {
      "name": "Construction Worker"
    }
  ];


  isSuccess = false;

  constructor(userDataService){
    this.userDataService = userDataService;
    this.username = userDataService.getUsername();
    this.profession = userDataService.getProfession();
    this.workhours = userDataService.getWorkhours();
    this.customTimeout = userDataService.getCustomTimeout();
    console.log(this.username, this.profession);
  }

  private saveData(){
    let user = {
      "username": this.username,
      "profession": this.profession,
      "workhours": this.workhours,
      "timeout": this.customTimeout
    };
    let retVal = this.userDataService.saveUser(user);
    console.log("retVal", retVal);
    if(retVal){
      this.isSuccess = true;
    } else {
      this.isSuccess = false;
    }
  }

  private resetSuccess(){
    this.isSuccess = false;
  }
}
