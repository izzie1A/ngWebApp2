import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { HomePageComponent } from './slides/home-page/home-page.component';
import { SettingComponent } from './slides/setting/setting.component';
import { AccountComponent } from './slides/account/account.component';


import { ItemCardComponent } from './components/item-card/item-card.component';
import { ItemCardDetailComponent } from './components/item-card-detail/item-card-detail.component';
import { ItemCardDialogComponent } from './components/item-card-dialog/item-card-dialog.component';
import { ItemCardListComponent } from './components/item-card-list/item-card-list.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { PageControlComponent } from './slides/page-control/page-control.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    ItemCardComponent,
    ItemCardDetailComponent,
    ItemCardDialogComponent,
    ItemCardListComponent,
    NavBarComponent,
    SignInComponent,
    HomePageComponent,
    SettingComponent,
    AccountComponent,
    PageControlComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    // provideFirebaseApp(() => initializeApp({ "projectId": "camera-af868", "appId": "1:129701599624:web:f82d68526c4342ca7f823d", "databaseURL": "https://camera-af868-default-rtdb.firebaseio.com", "storageBucket": "camera-af868.appspot.com", "locationId": "us-central", "apiKey": "AIzaSyAn4xbkq-uPWA7PZzbfJO1FJv1AWvrmYLY", "authDomain": "camera-af868.firebaseapp.com", "messagingSenderId": "129701599624", "measurementId": "G-LEX6P2PGG9" })),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    DragDropModule,
    MatDialogModule,
    FormsModule,

  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
