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
  @Input() address: string = 'loreamFolder';

  item$: Observable<any[]> | undefined;
  itemArray$: Observable<any>[] = [];
  itemArray: any = [];
  receivedValue: string = '';

  constructor(private fbS: FirebaseControlService, public dialog: MatDialog) {
    this.item$ = fbS.t(this.address);
  }

  async addItem(newItem: number , num: number) {
    let resultPack: string | any[] = [];
    let sub = this.item$?.subscribe((result) => {
      resultPack = result;
      if (num + newItem < 0 || num + newItem > resultPack.length - 1) {
        return
      } else {
        let item = resultPack[num];
        let item2 = resultPack[num + newItem];
        let x = item.id;
        item.id = item2.id;
        item2.id = x;
        this.fbS.docSave(this.address, item2.id.toString(), item2);
        this.fbS.docSave(this.address, item.id.toString(), item);
        sub?.unsubscribe();
        return
      }
    })
  }

  dropMove(direction: number) {
  }

  drop(event: CdkDragDrop<any[]> | any): void {
    if (event.previousContainer == event.container) {
      if (event.previousIndex === event.currentIndex) {
        return;
      }
      const item = event.previousContainer.data[event.previousIndex];
      const item2 = event.container.data[event.currentIndex];
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
      width: '50vh',
      // height: '80vh',
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
        this.fbS.createCustomDoc(this.address, x);
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