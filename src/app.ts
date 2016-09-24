import {Router, RouterConfiguration} from "aurelia-router";
import {inject} from "aurelia-framework";
import {UserDataService} from "services/UserDataService";
import {AppDataService} from "services/AppDataService";
import {EventAggregator} from "aurelia-event-aggregator"
import {TimerService} from "./services/TimerService";
import {LocationService} from "./services/LocationService";

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

    /**
     * Constructor
     *
     * @param userDataService
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

        if (true) {
            this.enableNotifications();
        } else {
            this.disableNotifications();
        }

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
        this.timerService.threshold = threshold;

        console.log(this.timerService.threshold);

        // enable GPS-Updates
        this.locationService.gpsRequestId = Precious.plugins.getContinuousGPS(this.locationService.movementDetector());

        console.log(this.locationService.gpsRequestId);

        // subscribe to activityChannel
        this.activitySubscriber = this.eventAggregator.subscribe('activityChannel', active => {

            if (active) {

                this.timerService.stop();
                this.timerService.reset();

                console.log("timer stopped");

            } else {

                this.timerService.start(this.timerService.threshold);
                console.log("timer started");

            }

        });

        // subscribe to timerChannel
        this.timerSubscriber = this.eventAggregator.subscribe("timerChannel", status => {

            switch (status) {
                case "timeout":
                    Precious.plugins.setNotification(false, "Move it, Fucker!", "Deine Position hat sich seit 30 Minuten nicht verändert. Zeit für eine Pause!");
                    console.log("timeout");
                    break;
                default:
            }

        });

        console.log("notifications enabled");

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

        console.log("notifications disabled");

    }

}
