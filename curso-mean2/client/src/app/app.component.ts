import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.services'
import { GLOBAL } from "./services/global";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [
    UserService
  ]
})
export class AppComponent implements OnInit {
  title = 'MUSIFY';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMsg;
  public alertRegister: string;
  public url: string;

  constructor(private _userService: UserService) {
    this.user = new User('', '', '', '', '', 'ROL_USER', '');
    this.user_register = new User('', '', '', '', '', 'ROL_USER', '');
    this.url = GLOBAL.url;
  }

  public ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    //console.log(this.identity);
    //console.log(this.token);
  }

  public onSubmit() {
    //Conseguimos datos del user identificado
    this._userService.signup(this.user).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;

        if (!this.identity._id) {
          alert("User is not logged properly");
        } else {
          localStorage.setItem('identity', JSON.stringify(identity));

          this._userService.signup(this.user, 'true').subscribe(
            response => {
              let token = response.token;
              this.token = token;

              if (this.token.length <= 0) {
                alert("Token error");
              } else {
                localStorage.setItem('token', token);
                this.user = new User('', '', '', '', '', 'ROL_USER', '');
              }
            },
            error => {
              var errorMsg = <any>error;
              if (errorMsg != null) {
                var body = JSON.parse(error._body);
                this.errorMsg = body.message;
              }
            }
          );
        }
      },
      error => {
        var errorMsg = <any>error;

        if (errorMsg != null) {
          var body = JSON.parse(error._body);
          this.errorMsg = body.message;
        }
      }
    );
  }

  public logout() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
  }

  public onSubmitRegister() {
    //console.log(this.user_register);
    this._userService.register(this.user_register).subscribe(
      response => {
        let user = response.user;
        this.user_register = user;
        //console.log(user);
        if (!user._id) {
          this.alertRegister = 'Signin error';
        } else {
          this.alertRegister = 'User registered. Email: ' + user.email;
          this.user_register = new User('', '', '', '', '', 'ROL_USER', '');
        }
      },
      error => {
        var errMsg = <any>error;

        if (errMsg != null) {
          var body = JSON.parse(error._body);
          this.alertRegister = body;
          //console.log(error);
        }
      }
    );
  }
}
