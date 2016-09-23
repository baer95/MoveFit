import {Router, RouterConfiguration} from "aurelia-router";

export class App {
  message = "MoveFit";
  router: Router;

  constructor(){
    // this.timeoutLog();
  }

  // private timeoutLog(){
  //   setInterval(() => {
  //     console.log("Home is running");
  //   }, 1000);
  // }

  configureRouter(config: RouterConfiguration, router: Router): void {
    config.title = 'MoveFit';
    config.map([
      { route: '', name: 'home', moduleId: 'home'},
      { route: 'user', name: 'user', moduleId: 'user'}
    ]);

    this.router = router;
  }

}
