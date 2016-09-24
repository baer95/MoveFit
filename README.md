# MoveFit
Heealth Eapp for Moovemeeant eeat your Workspeace

## Idea
This app should run as a background task that reminds you of getting up and relaxing your body when your work day solely consists of mind numbing sitting and staring at a screen.

## Technical background
GPS is used to check whether you're walking around or sit at your desk. If you don't move, a timer starts to count down from a preset time value (ie. 30 min).
Should you move, then the timer is reset. In case you don't move for a full 30 minutes, a Notification on your phone gets triggered.
Get up, have a short walk through the office or your home, and the Timer will by itself reset and start to count down towards your next break.

## Notes

MoveFit

GPS-Tracking mit Timer
Wenn ein bestimmter bereich für eine definierte Zeit nicht verlassen wird, dann wird eine Benachrichtigung ausgelöst

"du hast seit XY minuten deinen Arbeitsplatz nicht verlassen. Gehe eine kleine Runde."

bei Bewegung/verlassen dieses Radius wird der Timer zurückgesetzt/pausiert, bis keine weitere Bewegung mehr erkannt wird.

Timeout kann selbst vom user eingestellt werden

voreinstellungen nach berufsbildern möglich
    informatiker
    Construction worker
    etc.

Checkbox: Timer nur zur arbeitszeit aktivieren
    Checkboxen für Wochentage
    arbeitszeit-Auswahl
        vormittag von bis
        nachmittag von bis


2 Javascript-Events:
    Bewegung-Start
        Timer-Reset
        Timer-Pause
    Bewegung-Stop
        Timer-Start

Funktion trackt GPS-Signal und berechnet abstände.
Wenn der Abstand zwischen zwei positionen größer als $schwellenwert ist, dann wird Bewegung-Start ausgelöst.
Wenn X Positionen innerhalb des gleichen Bereichs sind, dann wird ein Bewegung-Stop Event ausgelöst.
