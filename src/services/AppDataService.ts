export class AppDataService{
  settings:any;

  notifsEnabled;

  constructor(){

    let appSettingsObj = Precious.plugins.getStorageEntry((e,r) => {
      let resp = JSON.parse(r.value);
      console.log(resp);
      this.setNotifsEnabled(resp['settings']['notifsEnabled']);
    }, "appSettings");

    if(appSettingsObj === null) {
      appSettingsObj = Precious.plugins.setStorageEntry(null, "appSettings", JSON.stringify({
        "settings": {
          "notifsEnabled" : true
        }
      }));
    }
  }

  getNotifsEnabled(){
    return (this.notifsEnabled !== null) ? this.notifsEnabled : false;
  }

  setNotifsEnabled(val){
    this.notifsEnabled = val;
  }

  saveAppSettings(settings){
    Precious.plugins.setStorageEntry((e,r) =>{

    }, "appSettings", JSON.stringify(settings));
  }
}
