export class LocationDataService{
  locations:Array<Location>;

  constructor(){
    let locationStorage = Precious.getStorageEntry((e,r) => {
      
    }, "locations");
  }

  setLat(lat){

  }
}
