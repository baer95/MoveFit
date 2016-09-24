
import {Router, RouterConfiguration} from "aurelia-router";
import {inject} from "aurelia-framework";
import {UserDataService} from "services/UserDataService";


@inject(UserDataService)
export class App {
    userDataService;
    message = "MoveFit";
    router: Router;


    constructor(userDataService){
        this.userDataService = userDataService;
        // this.timeoutLog();
    }

    // private timeoutLog(){
    //   setInterval(() => {
    //     console.log("Home is running");
    //   }, 1000);
    // }

    configureRouter(config: RouterConfiguration, router: Router): void {
        config.title = 'MoveFit';
        config.map([
            { route: '', name: 'home', moduleId: 'home'},
            { route: 'user', name: 'user', moduleId: 'user'}
        ]);

        this.router = router;
    }

    // enable Notifications
    enable(threshold = 60 * 30) {
        this.threshold = threshold;

        // enable GPS-Updates
        this.gpsRequestId = Precious.plugins.getContinuousGPS(this.movementDetector);

        // subscribe to activityChannel
        this.subscriber = this.ea.subscribe('activityChannel', active => {

            if (active) {

                this.Timer.stop();
                this.Timer.reset();

            } else {

                this.Timer.start(this.threshold);

            }

        });

    }

    // disable Notifications
    disable() {

        // disable GPS-Updates
        Precious.removeRequest(this.gpsRequestId);

        // unsubscribe from activityChannel
        this.subscriber.dispose();

    }

}
