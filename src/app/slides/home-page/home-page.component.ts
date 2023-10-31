import { Component } from '@angular/core';
import { FirebaseControlService, tItem } from "src/app/services/firebase-control.service";


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  address: string = 'citiesloreamCollection';
  itemArray: any = [];


    title = 'card-board';

  viewMode: 'grid' | 'list' | 'roll' = 'list'
  viewModeA = ['grid', 'list', 'roll'];

  itemCardArrayContainer: any[] = []

  constructor(private fbS: FirebaseControlService) {
    this.initialize();
  }
  
  async initialize() {
    let x = await this.fbS.queryCondition(this.address, 100, "name", "!=", 'null');
    console.log(x);
    this.itemArray = x;
  }
}
