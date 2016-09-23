interface Location{
  lat:number;
  long:number;
  active:boolean;
  timestamp:number;
}

declare module LocationDataService {
  interface LocationDataService {
    locations:Array<Location>;
  }
}
