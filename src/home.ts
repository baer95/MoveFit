export class Home {




// Timer
  var time_threshold = 60 * 30; // 30 Minuten
  var Timer = {
  totalSeconds: 0,
  timer: null,
  start: function() {
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
    totalSeconds++;
  }
}

// Custom Events
  var userActiveEvent = new CustomEvent("userActiveEvent");
  var userIdleEvent   = new CustomEvent("userIdleEvent");

// Callbacks for "Active" and "Idle"
  var userActiveCallback = function(e) {

  // stop timer
  Timer.stop();

  // reset timer
  Timer.reset();

}

  var userIdleCallback = function(e) {

  // start timer
  Timer.start();
}

// Event Listeners erstellen
  document.body.addEventListener("userActiveEvent", userActiveCallback, false);
  document.body.addEventListener("UserIdleEvent", userIdleCallback, false);

// Sphärische Distanz in Meter zwischen zwei Koordinaten
  function sphericalDistance(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 +
    c(lat1 * p) * c(lat2 * p) *
    (1 - c((lon2 - lon1) * p))/2;
  return 12742000 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km * 1000 für Meter
}

// Location History
  var location_history = [];

// Activity Boolean
  var userActive = false;

// Fire custom Events wenn umstände gegeben sind
  var movementDetector = function (e, r)
{
  // Distanz zur letzten Location berechnen
  var distance = sphericalDistance(location_history[0][0], location_history[0][1], r.latitude, r.longitude);

  // Neue Position in Location History eintragen und ältesten Wert entfernen
  location_history.unshift({r.latitude, r.longitude});
  location_history.length = 10;


  if ( distance >= 3 && userActive == false) { // distance >= 3 m

    // user active
    userActive = true;
    document.body.dispatchEvent(userActiveEvent);

  } else if (distance < 3 && userActive == true) { // distance < x

    // user idle
    userActive = false;
    document.body.dispatchEvent(userIdleEvent);

  }

}

// GPS-Updates aktivieren
  Precious.plugins.getContinuousGPS(movementDetector);





// prüfung ob Timer abläuft (Timer.totalSeconds == time_threshold)

  if (Timer.totalSeconds == time_threshold) {
  //
}





















}
