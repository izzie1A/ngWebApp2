import { Component } from '@angular/core';
import { FirebaseControlService, tItem } from "src/app/services/firebase-control.service";


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  address: string = 'loreamFolder';
  itemArray: any = [];
    title = 'Loream Home page';
    viewMode: 'grid' | 'list' | 'roll' = 'list'
    viewModeA = ['grid', 'list', 'roll'];
    itemCardArrayContainer: any[] = []
    constructor(private fbS: FirebaseControlService) {
      this.initialize();
    }
    async initialize() {
      this.itemArray = await this.fbS.queryCondition(this.address, 100, "name", "!=", 'null');
  }
}
