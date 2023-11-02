import { Component, Input } from '@angular/core';
import { FirebaseControlService, tItem } from "src/app/services/firebase-control.service";

import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ItemCardDialogComponent, TaskDialogResult } from './../../components/item-card-dialog/item-card-dialog.component';
import { Observable } from 'rxjs';
import { signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-item-card-list',
  templateUrl: './item-card-list.component.html',
  styleUrls: ['./item-card-list.component.css']
})
export class ItemCardListComponent {
  @Input() address: string = 'citiesloreamCollection';

  item$: Observable<any[]> | undefined;
  itemArray$: Observable<any>[] = [];

  itemArray: any = [];
  constructor(private fbS: FirebaseControlService, public dialog: MatDialog) {
    this.initialize();
  }

  async initialize() {
    this.item$ = this.fbS.t(this.address);
    // let x = await this.fbS.queryCondition(this.address, 100, "name", "!=", 'null');
    // console.log(x);
    // this.itemArray = x;
  }

  drop(event: CdkDragDrop<any[]> | any): void {
    if (event.previousContainer == event.container) {
      if (event.previousIndex === event.currentIndex) {
        return;
      }
      const item = event.previousContainer.data[event.previousIndex];
      const item2 = event.container.data[event.currentIndex];
      // this.fbS.deleteDoc(event.previousContainer.id,item2.id.toString());
      // this.fbS.deleteDoc(event.previousContainer.id,item.id.toString());
      let x = item.id;
      item.id = item2.id;
      item2.id = x;
      this.fbS.docSave(event.previousContainer.id, item2.id.toString(), item2);
      this.fbS.docSave(event.container.id, item.id.toString(), item);
    }
  }

  newItem(address: string) {
    this.fbS.createDoc(address)
  }
  selectCollection(address: string) {
    this.address = address;
    this.item$ = this.fbS.t(this.address);
  }

  newTask(): void {
    const dialogRef = this.dialog.open(ItemCardDialogComponent, {
      width: '50vw',
      height: '50vh',
      data: {
        task: {
          name: 'testing',
          description: 'testing',
          imageArray: [],
          image: '',
        },
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult) => {
        if (!result) {
          return;
        }
        let x = this.fbS.getCustomFile();
        x.name = result.task.name;
        x.description = result.task.description;
        x.image = result.task.image;
        x.imageArray = result.task.imageArray;
        this.fbS.createCustomDoc(this.address,x);
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