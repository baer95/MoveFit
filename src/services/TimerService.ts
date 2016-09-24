import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)

export class TimerService {

    ///////////////////////
    ///   CONFIG-VARS   ///
    ///////////////////////

    // Zeit bis zur Benachrichtigung [s]
    threshold = 60 * 10; // 10 Minuten

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
    remainingTime;

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

        console.log("timer.start");

        this.threshold = threshold;
        if (!this.timer) {
            this.timer = setInterval(this.setTime(), this.interval);
        }
    }

    /**
     * stop timer
     */
    stop() {

        console.log("timer.stop");

        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    /**
     * reset timer
     */
    reset() {

        console.log("timer.reset");

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

        console.log("timer.setTime");

        this.totalSeconds++;

        this.setRemainingTime();

        if (this.totalSeconds >= this.threshold) { // ZEIT ABGELAUFEN
            this.eventAggregator.publish("timerChannel", "timeout");
        }
    }

    /**
     * setRemainingTime
     *
     * Time until threshold is reached
     */
    setRemainingTime() {

        // let minutes = Math.floor((this.threshold-this.totalSeconds)/60);
        // let seconds = (this.threshold-this.totalSeconds) % 60;
        // return minutes + ":" + seconds;

        // return new Date(this.threshold-this.totalSeconds);

        var date = new Date(null);
        date.setSeconds(this.threshold-this.totalSeconds);
        this.remainingTime = date.toISOString().substr(11, 8);
    }

}
