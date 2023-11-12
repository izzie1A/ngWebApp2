import { Component } from '@angular/core';
import { FirebaseControlService, tItem } from '../../services/firebase-control.service';
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  templateUser: any;
  registerLog:string|undefined;

  constructor(public authS: AuthService) {
  }

  async emailRegister(email: string, password1: string, password2: string) {
    let x = this.isRegisterValidate({ email: email });
    if (x != null && password1 == password2) {
      this.registerLog = await this.authS.emailRegister(email,password1);
      console.log(this.registerLog)
    }else{
      this.registerLog = "Please enter valid email address"
    }
  }
  emailSignin(email: string, password: string){
    if(email!= "" && password!=""){
      console.log("sign in ",email,password)
      this.authS.emailSignIn(email,password);
    }else{
      alert();
    }
  }

  isRegisterValidate(content: { email: string }) {
    const validateEmail = (email: string) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    return validateEmail(content.email)
  }

}
