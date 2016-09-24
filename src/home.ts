import {inject} from "aurelia-framework";
import {UserDataService} from "services/UserDataService";
import {TimerService} from "services/TimerService";
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(UserDataService, TimerService, EventAggregator)

export class Home {
    userDataService;
    timerService;
    eventAggregator;

    constructor(userDataService, timerService, eventAggregator) {
        this.userDataService = userDataService;
        this.timerService = timerService;
        this.eventAggregator = eventAggregator;
    }
}
