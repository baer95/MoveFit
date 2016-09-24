import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)

export class TimerService {

    ///////////////////////
    ///   CONFIG-VARS   ///
    ///////////////////////

    // Zeit bis zur Benachrichtigung [s]
    threshold = 60 * 30; // 30 Minuten

    // Timer-Intervall [ms]
    interval = 1000;

    ////////////////////
    ///   APP-VARS   ///
    ////////////////////

    // EventAggregator Object
    eventAggregator:EventAggregator;

    // Zeit im Stillstand
    totalSeconds = 0;

    // Intervall-ID des Timers
    timer = null;

    // remaining time
    remainingTime = "0";

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
     * start timer
     *
     * @param threshold
     */
    start(threshold) {
        this.threshold = threshold;
        if (!this.timer) {
            this.timer = setInterval(()=>{
                this.setTime();
            }, this.interval);
        }
    }

    /**
     * stop timer
     */
    stop() {

        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    /**
     * reset timer
     */
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

        this.setRemainingTime();

        if ((this.threshold-this.totalSeconds) <= 0) { // ZEIT ABGELAUFEN
            this.eventAggregator.publish("timerChannel", "timeout");
        }
    }

    /**
     * setRemainingTime
     *
     * Time until threshold is reached
     */
    setRemainingTime() {

        var date = new Date(null);
        date.setSeconds(this.threshold-this.totalSeconds);
        this.remainingTime = date.toISOString().substr(11, 8);
    }

}
