import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)

export class LocationService {

    ///////////////////////
    ///   CONFIG-VARS   ///
    ///////////////////////

    /**
     * threshold [m]
     *
     * radius of change that is ignored and counted as standstill
     */
    threshold = 5;

    ////////////////////
    ///   APP-VARS   ///
    ////////////////////

    /**
     * eventAggregator
     */
    eventAggregator:EventAggregator;

    /**
     * GPS-API-Request-ID
     *
     * wird von app.ts verwendet
     */
    gpsRequestId;

    /**
     * Location History Array
     *
     * @type {Array}
     *
     * {
     *  "lat": float ,
     *  "long": float,
     *  "active": bool,
     *  "timestamp": int
     * }
     */
    locationHistory = [];

    ///////////////////
    ///   METHODS   ///
    ///////////////////

    /**
     * constructor
     *
     * @param eventAggregator
     */
    constructor(eventAggregator) {
        this.eventAggregator = eventAggregator;
    }

    /**
     * spherical distance
     *
     * calculate the spherical distance between two coordinates in meters
     */
    static sphericalDistance(lat1, lon1, lat2, lon2) {
        var p = 0.017453292519943295;    // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p))/2;
        return 12742000 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km * 1000 für Meter
    }

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
            "active": (distance >= this.threshold ? true : false),
            "timestamp":Date.now()
        };
        this.locationHistory.unshift([locationObject]);
        this.locationHistory.length = 10;

        // bei Statusänderung Event auslösen
        if ( !this.locationHistory[1]["active"] && this.locationHistory[0]["active"] ) { // IDLE --> ACTIVE

            this.eventAggregator.publish("activityChannel", true);

        } else if ( this.locationHistory[1]["active"] && !this.locationHistory[0]["active"] ) { // ACTIVE --> IDLE

            this.eventAggregator.publish("activityChannel", false);

        }
    };
}