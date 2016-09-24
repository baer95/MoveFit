import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)

export class TimerService {

    // Precious.plugins.getStorageEntry(callback, key, userInfo)
    // Precious.plugins.setStorageEntry(callback, key, value, userInfo)
    // Precious.plugins.removeStorageEntry(callback, key, userInfo)

    // EventAggregator Object
    ea:EventAggregator;

    // Event Subscriber Object
    subscriber;

    // GPS-API-Request-ID
    gpsRequestId;

    // Location History Array
    // {
    //  "lat": float ,
    //  "long": float,
    //  "active": bool,
    //  "timestamp": int
    // }
    locationHistory = [];

    //////////////////////
    ///   AB HIER OK   ///
    //////////////////////

    constructor(eventAggregator) {
        this.ea = eventAggregator;
    }

    // enable Notifications
    enable() {

        // enable GPS-Updates
        this.gpsRequestId = Precious.plugins.getContinuousGPS(this.movementDetector);

        // subscribe to activityChannel
        this.subscriber = this.ea.subscribe('activityChannel', active => {

            if (active) {

                this.Timer.stop();
                this.Timer.reset();

            } else {

                this.Timer.start();

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

    // spherical distance between two coordinates in meters
    static sphericalDistance(lat1, lon1, lat2, lon2) {
        var p = 0.017453292519943295;    // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p))/2;
        return 12742000 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km * 1000 für Meter
    }

    // Timer
    Timer = {
        threshold: 0,
        totalSeconds: 0,
        timer: null,

        start: function(threshold = 60 * 30) {
            this.threshold = threshold;
            if (!this.timer) {
                this.timer = setInterval(this.setTime, 1000);
            }
        },

        stop: function() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },

        reset: function() {
            if (this.timer) {
                this.totalSeconds = 0;
                this.stop();
            }
        },

        setTime: function() {
            this.totalSeconds++;
            if (this.totalSeconds >= this.threshold) { // ZEIT ABGELAUFEN
                Precious.plugins.setNotification(false, "Move it, Fucker!", "Deine Position hat sich seit 30 Minuten nicht verändert. Zeit für eine Pause!");
            }
        }

    };

    /**
     * movementDetector
     *
     * @param e Event Object
     * @param r Response Object
     *
     * berechnet Distanz zur letzten Position
     * speichert aktuelle Position
     * löst bei Statusänderung Event aus
     */
    movementDetector = function (e, r)
    {
        // Distanz zur letzten Location berechnen
        var distance = this.sphericalDistance(this.locationHistory[0]["lat"], this.locationHistory[0]["lon"], r.latitude, r.longitude);

        // Neue Position in Location History eintragen und ältesten Wert entfernen
        var locationObject = {
            "lat":r.latitude,
            "lon":r.longitude,
            "active": (distance >= 3 ? true : false),
            "timestamp":Date.now()
        };
        this.locationHistory.unshift([locationObject]);
        this.locationHistory.length = 10;

        // bei Statusänderung Event auslösen
        if ( !this.locationHistory[1]["active"] && this.locationHistory[0]["active"] ) { // IDLE --> ACTIVE

            this.ea.publish("activityChannel", true);

        } else if ( this.locationHistory[1]["active"] && !this.locationHistory[0]["active"] ) { // ACTIVE --> IDLE

            this.ea.publish("activityChannel", false);

        }
    };

}
