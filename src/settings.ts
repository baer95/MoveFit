import {inject} from "aurelia-framework";
import {AppDataService} from "./services/AppDataService";

@inject(AppDataService)
export class Settings{
  appDataService;

  enableNotifications;

  constructor(appDataService){
    this.appDataService = appDataService;

    this.enableNotifications = appDataService.getNotifsEnabled();

    console.log(this.enableNotifications);
  }

  private saveData(){
    console.log("save Data", this.enableNotifications);
    let settings = {
      "settings":{
        "enableNotifications": this.enableNotifications
      }
    };
    this.appDataService.saveAppSettings(settings);
  }
}
