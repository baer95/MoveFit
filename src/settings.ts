import {inject} from "aurelia-framework";
import {AppDataService} from "./services/AppDataService";

@inject(AppDataService)
export class Settings{
  appDataService;

  notifsEnabled;

  constructor(appDataService){
    this.appDataService = appDataService;

    this.notifsEnabled = appDataService.getNotifsEnabled();

    console.log(this.notifsEnabled);
  }

  private saveData(){
    console.log("save Data", this.notifsEnabled);
    let settings = {
      "settings":{
        "enableNotifications": this.notifsEnabled
      }
    };
    this.appDataService.saveAppSettings(settings);
  }
}
