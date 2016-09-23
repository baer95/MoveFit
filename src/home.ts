export class Home {

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
        Precious.plugins.showNotification(false, "Move it, Fucker!", "Deine Position hat sich seit 30 Minuten nicht verändert. Zeit für eine Pause!");
      }
    }

  }

  // Custom Events
  userActiveEvent = new CustomEvent("userActiveEvent");
  userIdleEvent   = new CustomEvent("userIdleEvent");

  // Callbacks for "Active" and "Idle"
  userActiveCallback = function(e) {
    this.active = true;
    this.Timer.stop();
    this.Timer.reset();
  }
  userIdleCallback = function(e) {
    this.active = false;
    this.Timer.start();
  }

  // Event Listeners erstellen
  addEventListener("userActiveEvent", userActiveCallback, false);
  addEventListener("UserIdleEvent", userIdleCallback, false);

  // Sphärische Distanz in Meter zwischen zwei Koordinaten
  sphericalDistance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 +
      c(lat1 * p) * c(lat2 * p) *
      (1 - c((lon2 - lon1) * p))/2;
    return 12742000 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km * 1000 für Meter
  }

  // Location History
  location_history = [];

  // Activity Boolean
  active = false;

  /**
   * movementDetector
   *
   * berechnet Distanz zur letzten Position
   * speichert aktuelle Position
   * löst bei Statusänderung Event aus
   */
  movementDetector = function (e, r)
  {
    // Distanz zur letzten Location berechnen
    var distance = this.sphericalDistance(this.location_history[0][0], this.location_history[0][1], r.latitude, r.longitude);

    // Neue Position in Location History eintragen und ältesten Wert entfernen
    this.location_history.unshift([r.latitude, r.longitude]);
    this.location_history.length = 10;

    // bei Statusänderung Event auslösen
    if ( distance >= 3 && !this.active) { // IDLE --> ACTIVE
      document.body.dispatchEvent(this.userActiveEvent);
    } else if (distance < 3 && this.active) { // ACTIVE --> IDLE
      document.body.dispatchEvent(this.userIdleEvent);
    }
  }

  // GPS-Updates aktivieren
  Precious.plugins.getContinuousGPS(movementDetector);
}
