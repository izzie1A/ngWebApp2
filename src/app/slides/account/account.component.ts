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

  constructor(public authS: AuthService) {
    const user = this.authS.authState$;

    let x = this.isRegisterValidate({ email: 'meow0082005@gmail.com' });
    console.log(x)
  }

  login() {
    this.authS.googleSignin();
  }
  emailVerification(email: string, password: string){
    
  }
  emailRegister(email: string, password1: string, password2: string) {
    let x = this.isRegisterValidate({ email: email });
    if (x != null && password1 == password2) {
      this.authS.emailRegister(email,password1,password2);
    }
  }
  emailSignin(email: string, password: string){
    if(email!= "" && password!=""){
      console.log(email,password)
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
