export class LocationDataService{
  locations:Array<Location>;

  constructor(){
    let locationStorage = Precious.getStorageEntry((e,r) => {
      
    }, "locations");
  }

  setLat(lat){

  }



  // Precious.plugins.getStorageEntry(callback, key, userInfo)
  // Precious.plugins.setStorageEntry(callback, key, value, userInfo)
  // Precious.plugins.removeStorageEntry(callback, key, userInfo)


}
