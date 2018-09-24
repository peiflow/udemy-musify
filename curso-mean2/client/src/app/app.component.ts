import { Component } from '@angular/core';
import {User} from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'MUSIFY';
  public user: User;
  public identity = true;
  public token;

  constructor(){
    this.user = new User('', '', '','','','ROL_USER','');
  }
}
