import { Injectable, inject } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signInWithPopup, signOut, User } from "firebase/auth";
import { FacebookAuthProvider, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

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
  fakeUser: any = {
    // uid:annomanm,
    // name:'fake'+faker.person.firstName(),
  }
  storeUser: any;

  userSubscription: Subscription;
  authState$ = authState(this.auth);

  serverResponse: string = '';

  constructor() {
    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
      if (aUser != null) {
        console.log(aUser.email);
        console.log(aUser);
        this.storeUser = aUser;
      } else if (aUser == null) {
        console.log('No user login');
        this.storeUser = this.fakeUser;
      };
    })
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  getUserID() {
    return this.storeUser.uid!! ? this.storeUser.uid : this.fakeUser.uid;
  }

  checkRegisterValid(email: string) {
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const result: boolean = expression.test(email); // true
    return result;
  }

  emailRegister(email: string, password: string) {
    console.log("start")
    if (this.checkRegisterValid(email) == false) return

    return createUserWithEmailAndPassword(this.auth, email, password).then((userCredential) => {
      console.log("start yes  yes")
      const user = userCredential.user;
      console.warn(user)
      return user;
    })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        this.serverResponse = error.code;
        console.warn(errorMessage);
        // Firebase: Password should be at least 6 characters (auth/weak-password).
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
