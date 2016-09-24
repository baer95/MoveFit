import {inject} from "aurelia-framework";
import {UserDataService} from "services/UserDataService";
import {TimerService} from "services/TimerService";
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(UserDataService, TimerService, EventAggregator)
export class Home {
  userDataService;
  timerService;
  eventAggregator;

  activitySubscriber;

  showNoGpsError = false;

  constructor(userDataService, timerService, eventAggregator){

    this.userDataService = userDataService;
    this.timerService = timerService;
    this.eventAggregator = eventAggregator;

    this.subscribeToNoGps();
  }

  private subscribeToNoGps(){
    this.activitySubscriber = this.eventAggregator.subscribe("activityChannel", (nogps) => {
      if(nogps != null  && nogps.errorCode == 1){
        this.showNoGpsError = true;
      } else {
        this.showNoGpsError = false;
      }
    });
  }
}
