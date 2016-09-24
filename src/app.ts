import {Router, RouterConfiguration} from "aurelia-router";
import {inject} from "aurelia-framework";
import {UserDataService} from "services/UserDataService";
import {AppDataService} from "services/AppDataService";
import {EventAggregator} from "aurelia-event-aggregator"
import {TimerService} from "services/TimerService";
import {LocationService} from "services/LocationService";

@inject(UserDataService, AppDataService, EventAggregator, TimerService, LocationService)

export class App {

    message = "MoveFit";
    router: Router;

    userDataService;
    appDataService;
    eventAggregator:EventAggregator;
    timerService;
    locationService;

    activitySubscriber;
    timerSubscriber;

    gpsAvailable = false;

    /**
     * Constructor
     *
     * @param userDataService
     * @param appDataService
     * @param eventAggregator
     * @param timerService
     * @param locationService
     */
    constructor(userDataService, appDataService, eventAggregator, timerService, locationService) {
        this.userDataService = userDataService;
        this.appDataService = appDataService;
        this.eventAggregator = eventAggregator;
        this.timerService = timerService;
        this.locationService = locationService;

        this.enableNotifications(60); // 60 Sekunden bis zur Notification
    }

    /**
     * Configure Router
     */
    configureRouter(config: RouterConfiguration, router: Router): void {
        config.title = 'MoveFit';
        config.map([
            { route: '', name: 'home', moduleId: 'home'},
            { route: 'user', name: 'user', moduleId: 'user'},
            { route: 'settings', name: 'settings', moduleId: 'settings'}
        ]);

        this.router = router;
    }

    /**
     * enable Notifications
     */
    enableNotifications(threshold = 60 * 30) {

        // neuen threshold im timerService speichern
        this.timerService.threshold = threshold;

        // enable GPS-Updates
        this.locationService.gpsRequestId = Precious.plugins.getContinuousGPS((e,r)=> {
            if(e) {
                this.gpsAvailable = false;
            } else {
                this.gpsAvailable = true;
                this.locationService.movementDetector(e,r);
            }
        });

        // subscribe to activityChannel
        this.activitySubscriber = this.eventAggregator.subscribe('activityChannel', active => {
            if (active) {
                this.timerService.reset();
            } else {
                this.timerService.start();
            }
        });

        // subscribe to timerChannel
        this.timerSubscriber = this.eventAggregator.subscribe("timerChannel", status => {
            switch (status) {
                case "timeout":
                    Precious.plugins.setNotification(null, "Move it, Fucker!", "Deine Position hat sich seit 30 Minuten nicht verändert. Zeit für eine Pause!");
                    this.timerService.reset();
                    break;
                default:
            }
        });

    }

    /**
     * disable Notifications
     */
    disableNotifications() {

        // disable GPS-Updates
        Precious.removeRequest(this.locationService.gpsRequestId);

        // unsubscribe from activityChannel
        this.activitySubscriber.dispose();

        // unsubscribe form timerChannel
        this.timerSubscriber.dispose();

    }

}
