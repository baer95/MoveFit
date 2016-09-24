export class AppDataService {
    settings:any;

    enableNotifications = false;

    constructor() {
        let appSettingsObj = Precious.plugins.getStorageEntry((e,r) => {
            let resp = JSON.parse(r.value);
            console.log(resp);
            this.setNotifsEnabled(resp['settings']['enableNotifications']);
        }, "appSettings");

        if(appSettingsObj === null) {
            appSettingsObj = Precious.plugins.setStorageEntry(null, "appSettings", JSON.stringify({
                "settings": {
                    "enableNotifications" : true
                }
            }));
        }
    }

    getNotifsEnabled() {
        return this.enableNotifications;
    }

    setNotifsEnabled(val) {
        this.enableNotifications = val;
    }

    saveAppSettings(settings) {
        Precious.plugins.setStorageEntry((e,r) =>{}, "appSettings", JSON.stringify(settings));
    }
}
