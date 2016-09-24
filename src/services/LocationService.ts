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
    old_lat = 1;
    old_lon = 1;
    old_active = false;
    distance = 0;

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
    sphericalDistance(lat1, lon1, lat2, lon2)
    {
        var R = 6371; // km
        var dLat = this.deg2rad(lat2-lat1);
        var dLon = this.deg2rad(lon2-lon1);
        var lat1 = this.deg2rad(lat1);
        var lat2 = this.deg2rad(lat2);

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return d;
    }
    // deg2rad
    deg2rad(Value)
    {
        return Value * Math.PI / 180;
    }

    /**
     * movementDetector
     */
    movementDetector(e, r)
    {
        if (e != null) { // Error - no GPS information
            this.eventAggregator.publish("activityChannel", e);
            return;
        }

        // Distanz zur letzten Location berechnen
        this.distance = this.sphericalDistance(this.old_lat, this.old_lon, r.latitude, r.longitude);

        console.log("distance: " + this.distance);

        // war user aktiv?
        var new_active = this.distance >= this.threshold ? true : false;

        // neue werte speichern
        this.old_lat = r.latitude;
        this.old_lon = r.longitude;

        // bei Statusänderung Event auslösen
        if ( !this.old_active && new_active ) { // IDLE --> ACTIVE

            this.eventAggregator.publish("activityChannel", true);

        } else if ( this.old_active && !new_active ) { // ACTIVE --> IDLE

            this.eventAggregator.publish("activityChannel", false);

        }

        this.old_active = new_active;

    }
}