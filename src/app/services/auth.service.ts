import { Injectable, inject } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signInWithPopup, signOut, User } from "firebase/auth";
import { FacebookAuthProvider, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

import { FirebaseControlService, tItem } from "src/app/services/firebase-control.service";
import { Auth, user, authState } from '@angular/fire/auth';
import { Subscription } from 'rxjs/internal/Subscription';
import { Observable } from 'rxjs/internal/Observable';
import { ReturnStatement } from '@angular/compiler';
import { flatMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  serverResponse: string = '';
  fakeUser: any = {
  }
  storeUser!: User;
  userSubscription: Subscription;
  authState$ = authState(this.auth);
  constructor(private fbS: FirebaseControlService) {
    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
      if (aUser != null) {
        this.storeUser = aUser;
        this.fbS.docSave('userTest',aUser.uid, this.loginUpdate());
      } else if (aUser == null) {
        this.storeUser = this.fakeUser;
      } else {
        console.warn('aUser error');
      };
    })
  }

  getUserID(){
    return this.storeUser
  }

  loginUpdate() {
    return {
      id: this.storeUser.uid, 
      name: this.storeUser.displayName,
      imageURL: this.storeUser.photoURL,
      email: this.storeUser.email,
      timeStamp: Date(),
    };
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  checkEmailRegisterValid(email: string) {
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const result: boolean = expression.test(email); // true
    return result;
  }

  emailRegister(email: string, password: string) {
    console.log("start")
    if (this.checkEmailRegisterValid(email) == false) return

    return createUserWithEmailAndPassword(this.auth, email, password).then((userCredential) => {
      const user = userCredential.user;
      return user;
    })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        this.serverResponse = error.message;
        return error.message;
      });
  }
  emailSignIn(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        const data = {
          uid: user.uid,
          email: user.email,
        }
        console.warn(data);
        console.warn(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        this.serverResponse = error.code;
        alert(errorMessage);
        console.warn(errorMessage);
      });

  }
  googleSignin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        // ...
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        this.serverResponse = error.code;
      });
  }
  // facebook not yet verify
  facebookSignin() {
    const provider = new FacebookAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        console.log(error)
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = FacebookAuthProvider.credentialFromError(error);
      });
  }
  // github not yet verify
  gitHUbSignin() {
    const provider = new GithubAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;

        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GithubAuthProvider.credentialFromError(error);
        // ...
      });
  }

  signout() {
    const auth = getAuth();
    signOut(auth).then(() => {
    }).catch((error) => {
    });
  }
}
