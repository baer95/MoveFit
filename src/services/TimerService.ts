import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)

export class TimerService {

    ///////////////////////
    ///   CONFIG-VARS   ///
    ///////////////////////

    // Zeit bis zur Benachrichtigung [s]
    private _threshold = 60 * 30; // 30 Minuten

    get threshold(): number {
        return this._threshold;
    }

    set threshold(value: number) {
        this._threshold = value;
    }

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
    remainingTime:number;

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
    start() {
        if (!this.timer) {
            console.log("timerService.start");
            this.timer = setInterval(() => {this.setTime()},this.interval);
        }
    }

    /**
     * stop timer
     */
    stop() {
        if (this.timer) {

            console.log("timerService.stop", this.timer);

            clearInterval(this.timer);
            this.timer = null;
        }
    }

    /**
     * reset timer
     */
    reset() {
        if (this.timer) {

            console.log("timerService.reset");

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

        // increment totalSeconds
        this.totalSeconds++;

        // calculate remaining Time
        this.remainingTime = this.threshold-this.totalSeconds;

        // Timeout Check
        if (this.remainingTime == 0) { // ZEIT ABGELAUFEN
            this.eventAggregator.publish("timerChannel", "timeout");
        }

        // LOGGING
        console.log("timerService.totalSeconds:",this.totalSeconds);
        console.log("timerService.remainningTime:",this.remainingTime);
    }
}
