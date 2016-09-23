var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app',["require", "exports", "aurelia-framework", "services/UserDataService"], function (require, exports, aurelia_framework_1, UserDataService_1) {
    "use strict";
    var App = (function () {
        function App(userDataService) {
            this.message = "MoveFit";
        }
        App.prototype.configureRouter = function (config, router) {
            config.title = 'MoveFit';
            config.map([
                { route: '', name: 'home', moduleId: 'home' },
                { route: 'user', name: 'user', moduleId: 'user' }
            ]);
            this.router = router;
        };
        App = __decorate([
            aurelia_framework_1.inject(UserDataService_1.UserDataService), 
            __metadata('design:paramtypes', [Object])
        ], App);
        return App;
    }());
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('home',["require", "exports"], function (require, exports) {
    "use strict";
    var Home = (function () {
        function Home() {
        }
        return Home;
    }());
    exports.Home = Home;
});

define('main',["require", "exports", './environment'], function (require, exports, environment_1) {
    "use strict";
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('user',["require", "exports", "services/UserDataService", "aurelia-dependency-injection"], function (require, exports, UserDataService_1, aurelia_dependency_injection_1) {
    "use strict";
    var User = (function () {
        function User(userDataService) {
            this.professions = [
                {
                    "name": "TechSupport"
                },
                {
                    "name": "Salesman"
                },
                {
                    "name": "Construction Worker"
                }
            ];
            this.isSuccess = false;
            this.userDataService = userDataService;
            this.username = userDataService.getUsername();
            this.profession = userDataService.getProfession();
            this.workhours = userDataService.getWorkhours();
            this.customTimeout = userDataService.getCustomTimeout();
            console.log(this.username, this.profession);
        }
        User.prototype.saveData = function () {
            var user = {
                "username": this.username,
                "profession": this.profession,
                "workhours": this.workhours,
                "timeout": this.customTimeout
            };
            var retVal = this.userDataService.saveUser(user);
            console.log("retVal", retVal);
            if (retVal) {
                this.isSuccess = true;
            }
            else {
                this.isSuccess = false;
            }
        };
        User.prototype.resetSuccess = function () {
            this.isSuccess = false;
        };
        User = __decorate([
            aurelia_dependency_injection_1.inject(UserDataService_1.UserDataService), 
            __metadata('design:paramtypes', [Object])
        ], User);
        return User;
    }());
    exports.User = User;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define('services/UserDataService',["require", "exports"], function (require, exports) {
    "use strict";
    var UserDataService = (function () {
        function UserDataService() {
            var _this = this;
            var user = Precious.plugins.getStorageEntry(function (e, r) {
                var resp = JSON.parse(r.value);
                console.log(resp);
                _this.updateModel(resp);
            }, "user");
            if (user === null) {
                user = Precious.plugins.setStorageEntry(null, "user", JSON.stringify({}));
            }
        }
        UserDataService.prototype.getUsername = function () {
            return this.username;
        };
        UserDataService.prototype.setUsername = function (name) {
            this.username = name;
        };
        UserDataService.prototype.getProfession = function () {
            return this.profession;
        };
        UserDataService.prototype.setProfession = function (name) {
            this.profession = name;
        };
        UserDataService.prototype.getWorkhours = function () {
            return this.workhours;
        };
        UserDataService.prototype.setWorkhours = function (hours) {
            this.workhours = hours;
        };
        UserDataService.prototype.getCustomTimeout = function () {
            return this.timeout;
        };
        UserDataService.prototype.setCustomTimeout = function (timeout) {
            this.timeout = timeout;
        };
        UserDataService.prototype.updateModel = function (user) {
            this.setUsername(user.username);
            this.setProfession(user.profession);
            this.setWorkhours(user.workhours);
            this.setCustomTimeout(user.timeout);
        };
        UserDataService.prototype.saveUser = function (user) {
            var _this = this;
            console.log(user);
            var userString = JSON.stringify(user);
            Precious.plugins.setStorageEntry(function () {
                _this.updateModel(user);
            }, "user", userString);
            return true;
        };
        return UserDataService;
    }());
    exports.UserDataService = UserDataService;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('resources/elements/header',["require", "exports", 'aurelia-framework'], function (require, exports, aurelia_framework_1) {
    "use strict";
    var Header = (function () {
        function Header() {
        }
        Header.prototype.valueChanged = function (newValue, oldValue) {
        };
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], Header.prototype, "message", void 0);
        return Header;
    }());
    exports.Header = Header;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.min.css\"></require>\n  <require from=\"resources/elements/header\"></require>\n\n  <header message.bind=\"message\" router.bind=\"router\"></header>\n  <router-view class=\"col-md-8 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1\"></router-view>\n\n</template>\n"; });
define('text!home.html', ['module'], function(module) { module.exports = "<template>\n  <h1>Home</h1>\n</template>\n"; });
define('text!user.html', ['module'], function(module) { module.exports = "<template>\n  <form>\n\n    <h4>User Settings</h4>\n    <div class=\"form-group\">\n      <label for=\"inputUserName\">Name</label>\n      <input type=\"text\" class=\"form-control\" id=\"inputUserName\" placeholder=\"Your Name\" value.bind=\"username\">\n    </div>\n    <!--<div class=\"form-group\">\n      <label for=\"inputProfession\">Profession</label>\n      <input type=\"text\" class=\"form-control\" id=\"inputProfession\" placeholder=\"Profession\" value.bind=\"profession\">\n    </div>-->\n    <div class=\"form-group\">\n      <label for=\"selectProfession\">Select Profession</label>\n      <select class=\"form-control\" id=\"selectProfession\" value.bind=\"profession\">\n          <option repeat.for=\"profession of professions\">${profession.name}</option>\n      </select>\n    </div>\n\n    <p><br></p>\n\n    <h4>Worktime</h4>\n    <div class=\"form-group\">\n      <label for=\"selectProfession\">Define Worktime</label>\n      <div class=\"row\">\n        <div class=\"col-xs-6\">\n          <input type=\"text\" class=\"form-control\" placeholder=\"From\" value.bind=\"workhours[0]\">\n        </div>\n        <div class=\"col-xs-6\">\n          <input type=\"text\" class=\"form-control\" placeholder=\"To\" value.bind=\"workhours[1]\">\n        </div>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label for=\"selectProfession\">Define Custom Timeout</label>\n\n      <div class=\"row\">\n        <div class=\"col-xs-6\">\n          <input type=\"text\" class=\"form-control\" placeholder=\"Custom Timeout\" value.bind=\"customTimeout\">\n        </div>\n        <div class=\"col-xs-6\">\n          <span class=\"help-block\">min</span>\n        </div>\n      </div>\n\n    </div>\n    <button type=\"submit\" class=\"btn btn-primary btn-block\" click.trigger=\"saveData()\">Save data</button>\n  </form>\n\n  <p>\n    <br>\n  </p>\n\n  <div class=\"alert alert-success alert-dismissible\" role=\"alert\" if.bind=\"isSuccess\">\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" click.trigger=\"resetSuccess()\"><span aria-hidden=\"true\">&times;</span></button>\n    <strong>Success!</strong> Data saved\n  </div>\n</template>\n"; });
define('text!resources/elements/header.html', ['module'], function(module) { module.exports = "<template bindable=\"message\">\n  <nav class=\"navbar navbar-default navbar-fixed-top\">\n    <div class=\"container-fluid\">\n      <!-- Brand and toggle get grouped for better mobile display -->\n      <div class=\"navbar-header\">\n        <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\" aria-expanded=\"false\">\n          <span class=\"sr-only\">Toggle navigation</span>\n          <span class=\"icon-bar\"></span>\n          <span class=\"icon-bar\"></span>\n          <span class=\"icon-bar\"></span>\n        </button>\n        <a class=\"navbar-brand\" route-href=\"route: home\"> ${message} </a>\n      </div>\n\n      <!-- Collect the nav links, forms, and other content for toggling -->\n      <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n        <ul class=\"nav navbar-nav\">\n          <li><a route-href=\"route: home\">Home</a></li>\n          <li><a route-href=\"route: user\">User</a></li>\n        </ul>\n      </div>\n    </div>\n  </nav>\n  <p>&nbsp;</p>\n  <p>&nbsp;</p>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map