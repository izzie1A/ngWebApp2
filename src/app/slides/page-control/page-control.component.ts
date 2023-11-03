import { Component } from '@angular/core';
import { FirebaseControlService, tItem } from "src/app/services/firebase-control.service";

@Component({
  selector: 'app-page-control',
  templateUrl: './page-control.component.html',
  styleUrls: ['./page-control.component.css']
})

export class PageControlComponent {
  address: string = 'loreamFolder';
  itemArray: any = [];
  itemCardArrayContainer: any = [];
  
  constructor(private fbS: FirebaseControlService) {
  }


  selectCollection(address: string) {
    this.address = address;
  } 

}


class itemCardArray {
  arrayID: string;
  arrayContent: any[];
  constructor(arrayID: string, arrayContent: any[]) {
    this.arrayID = arrayID;
    this.arrayContent = arrayContent;
    this.addNullItemCard();
  }

  addNullItemCard() {
    // this.arrayContent.push(new itemCardItem(this.arrayContent.length, 'nullName' + this.arrayContent.length))
  }
}