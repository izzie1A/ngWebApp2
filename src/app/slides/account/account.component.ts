import { Component } from '@angular/core';
import { FirebaseControlService, tItem } from '../../services/firebase-control.service';
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  templateUser:any ;

  constructor(public authS: AuthService) {
    const user = this.authS.authState$;
  }

  login() {
    this.authS.googleSignin();
  }

  isRegisterValidate(content: { email: string }) {
    const validateEmail = (email: string) => {
      return String(content.email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    console.warn(validateEmail);
  }

}
