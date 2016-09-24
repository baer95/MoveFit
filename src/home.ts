import {inject} from "aurelia-framework";
import {UserDataService} from "services/UserDataService";
import {TimerService} from "services/TimerService";

@inject(UserDataService, TimerService)
export class Home {
  userDataService;
  timerService;

  constructor(userDataService, timerService){

    this.userDataService = userDataService;
    this.timerService = timerService;
  }
}
