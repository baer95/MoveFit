import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)

export class TimerService {

    /////////////////////
    ///   VARIABLES   ///
    /////////////////////

    // EventAggregator Object
    eventAggregator:EventAggregator;

    // Zeit im Stillstand
    totalSeconds = 0;

    // Zeit bis zur Benachrichtigung
    threshold = 60 * 30;

    // Intervall-ID des Timers
    timer = null;

    ///////////////////
    ///   METHODS   ///
    ///////////////////

    constructor(eventAggregator) {

        this.eventAggregator = eventAggregator;

    }

    // START TIMER
    start(threshold) {
        this.threshold = threshold;
        if (!this.timer) {
            this.timer = setInterval(this.setTime, 1000);
        }
    }

    // STOP TIMER
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    // RESET TIMER
    reset() {
        if (this.timer) {
            this.totalSeconds = 0;
            this.stop();
        }
    };

    /**
     * setTime
     *
     * used for Interval
     * triggers Notification if threshold is reached
     */
    setTime() {
        this.totalSeconds++;
        if (this.totalSeconds >= this.threshold) { // ZEIT ABGELAUFEN
            this.eventAggregator.publish("timerChannel", "timeout");

        }
    }

    /**
     * getRemainingTime
     *
     * Time until threshold is reached
     */
    getRemainingTime() {

        let minutes = Math.floor((this.threshold-this.totalSeconds)/60);
        let seconds = (this.threshold-this.totalSeconds) % 60;

        return minutes + ":" + seconds;

    }

}
