export class UserDataService{
  username:string;
  profession:string;
  workhours: Array<number>;
  timeout: number;


  constructor(){
    let user = Precious.plugins.getStorageEntry((e,r) => {
      let resp = JSON.parse(r.value);
      console.log(resp);
      this.updateModel(resp);
    }, "user");
    if(user === null) {
      //if user is null set default
      user = Precious.plugins.setStorageEntry(null, "user", JSON.stringify({}));
    }
  }

  getUsername(){
    return this.username;
  }

  setUsername(name){
    this.username = name;
  }

  getProfession(){
    return this.profession;
  }

  setProfession(name){
    this.profession = name;
  }

  getWorkhours(){
    return this.workhours;
  }

  setWorkhours(hours){
    this.workhours = hours;
  }

  getCustomTimeout(){
    return this.timeout;
  }

  setCustomTimeout(timeout){
    this.timeout = timeout;
  }

  updateModel(user){
    this.setUsername(user.username);
    this.setProfession(user.profession);
    this.setWorkhours(user.workhours);
    this.setCustomTimeout(user.timeout);
  }

  saveUser(user):boolean{
    console.log(user);
    let userString = JSON.stringify(user);
    Precious.plugins.setStorageEntry(() => {
      this.updateModel(user);
    }, "user", userString);
    return true;
  }

}
