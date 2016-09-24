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

    // new location history
    old_lat = 10;
    old_lon = 20;
    old_active = false;

    ///////////////////
    ///   METHODS   ///
    ///////////////////

    /**
     * constructor
     *
     * @param eventAggregator
     */
    constructor(eventAggregator) {
        console.log("creating new LocationService");
        this.eventAggregator = eventAggregator;
    }

    /**
     * spherical distance
     *
     * calculate the spherical distance between two coordinates in meters
     */
    private sphericalDistance(lat1, lon1, lat2, lon2) {
        return 4;
        var p = 0.017453292519943295;    // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p))/2;
        return 12742000 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km * 1000 für Meter
    }

    /**
     * movementDetector
     */
    private movementDetector(e, r)
    {
        console.log("MovementDetector executing");

        console.log("e:", e);
        console.log("r:", r);

        console.log("lat_new:"+r.latitude);
        console.log("lon_new:"+r.longitude);

        // Distanz zur letzten Location berechnen
        var distance = this.sphericalDistance(this.old_lat, this.old_lon, r.latitude, r.longitude);

        console.log("distance: " + distance);

        var new_active = distance >= this.threshold ? true : false;

        // bei Statusänderung Event auslösen
        if ( !this.old_active && new_active ) { // IDLE --> ACTIVE

            console.log("idle->active triggered");

            this.eventAggregator.publish("activityChannel", true);

        } else if ( this.old_active && !new_active ) { // ACTIVE --> IDLE

            console.log("active->idle triggered");

            this.eventAggregator.publish("activityChannel", false);

        }
    }
}