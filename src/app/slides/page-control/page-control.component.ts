import { Component } from '@angular/core';
import { FirebaseControlService, firebaseItemCard, FireItemCard, tItem } from "src/app/services/firebase-control.service";
import { AuthService } from "src/app/services/auth.service";
import { User } from 'firebase/auth';
import { Observable } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ItemCardDialogComponent, TaskDialogResult } from './../../components/item-card-dialog/item-card-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-page-control',
  templateUrl: './page-control.component.html',
  styleUrls: ['./page-control.component.css']
})

export class PageControlComponent {
  address: string = 'loreamFolder';
  item$: Observable<any[]> = this.fbS.t(this.address);
  userName:Observable<User|null> = this.authS.authState$;
  userCredit:string="";

  itemCardViewer:firebaseItemCard|undefined;

  constructor(private fbS: FirebaseControlService, private authS:AuthService, public dialog: MatDialog) {
    this.authS.authState$.forEach((result:User|null)=>{
      result?this.userCredit=result.uid:0;
    });

  }
  selectItemCard(input:firebaseItemCard){
    console.log(input);
    this.itemCardViewer = input; 
  }

  selectCollection(address: string) {
    this.address = address;
  } 
  async addItem(newItem: number, num: number) {
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
  drop(event: CdkDragDrop<any[]> | any): void {
    if (event.previousContainer == event.container) {
      if (event.previousIndex === event.currentIndex) {
        return;
      }
      const item = event.previousContainer.data[event.previousIndex];
      const item2 = event.container.data[event.currentIndex];
      let x = item.id;
      item.id = item2.id;
      item2.id=x;
      this.fbS.docSave(event.container.id, item.id.toString(), item);
      this.fbS.docSave(event.previousContainer.id, item2.id.toString(), item2);
    }
  }
  newTask(): void {
    const dialogRef = this.dialog.open(ItemCardDialogComponent, {
      width:'70vh',
      data: {
        task: {
          name: '',
          description: '',
          imageArray: [],
        },
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult) => {
        if (!result) {
          return;
        }
        console.warn(result.task);
        this.fbS.createCustomDoc(this.address, result.task);
      });
  }

}
