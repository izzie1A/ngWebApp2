import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ItemCardComponent } from './components/item-card/item-card.component';
import { ItemCardDetailComponent } from './components/item-card-detail/item-card-detail.component';
import { ItemCardDialogComponent } from './components/item-card-dialog/item-card-dialog.component';
import { ItemCardListComponent } from './components/item-card-list/item-card-list.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    ItemCardComponent,
    ItemCardDetailComponent,
    ItemCardDialogComponent,
    ItemCardListComponent,
    NavBarComponent,
    SignInComponent
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
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
