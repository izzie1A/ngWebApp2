import { Component, Input } from '@angular/core';
import { FirebaseControlService, tItem } from "src/app/services/firebase-control.service";

import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatDialog, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { ItemCardDialogComponent, TaskDialogResult } from './../../components/item-card-dialog/item-card-dialog.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-item-card-list',
  templateUrl: './item-card-list.component.html',
  styleUrls: ['./item-card-list.component.css']
})
export class ItemCardListComponent {
  @Input() address: string = 'citiesloreamCollection';

  item$: Observable<any[]> | undefined;
  itemArray$:Observable<any>[] = [];

  itemArray: any = [];
  constructor(private fbS: FirebaseControlService,public dialog: MatDialog) {
    this.initialize();
  }



  async initialize() {
    let x = await this.fbS.queryCondition(this.address, 100, "name", "!=", 'null');
    console.log(x);
    this.itemArray = x;

    let y = await (await this.fbS.getCollection(this.address)).subscribe((result)=>{
      console.log(result);
    })

    console.warn(y)
    this.item$ = this.fbS.t('items');

  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    console.log(event.previousContainer);
    console.log(event.currentIndex);
    console.log(event.previousIndex);
  }

  newItem(address:string){
      this.fbS.createDoc(address)
  }
  selectCollection(address: string) {
    this.address = address;
    this.initialize();
  } 

  newTask(): void {
    const dialogRef = this.dialog.open(ItemCardDialogComponent, {
      width: '270px',
      data: {
        task: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult|undefined) => {
        if (!result) {
          return;
        }
        console.warn(result.task)
        // this.todo.push(result.task);
      });
  }
  
  // openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
  //   this.dialog.open(ItemCardDialogComponent, {
  //     width: '250px',
  //     enterAnimationDuration,
  //     exitAnimationDuration,
  //   });
  // }
}
