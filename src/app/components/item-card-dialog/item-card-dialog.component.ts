import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fItem } from "src/app/services/firebase-control.service";
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FirebaseControlService, firebaseItemCard, FireItemCard, tItem } from "src/app/services/firebase-control.service";

@Component({
  selector: 'app-item-card-dialog',
  templateUrl: './item-card-dialog.component.html',
  styleUrls: ['./item-card-dialog.component.css']
})
export class ItemCardDialogComponent {
  private backupTask: Partial<fItem> = { ...this.data.task };

  constructor(
    private fbS: FirebaseControlService,
    public dialogRef: MatDialogRef<ItemCardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData
  ) {
   }


  localArrayDrop(event: CdkDragDrop<any[]> | any): void {
    if (event.previousContainer === event.container) {
      // const item = event.previousContainer.data[event.previousIndex];
      // const item = event.previousContainer.data[event.previousIndex];
      // console.log(item);
      // const item2 = event.container.data[event.currentIndex];
      // console.log(item2);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      return;
    }
    if (!event.container.data || !event.previousContainer.data) {
      return;
    }
  }

  cancel(): void {
    this.data.task = this.backupTask;
    // this.data.task.description = this.backupTask.description;
    this.dialogRef.close();
  }


  async onFileArrayPush(address: string, key: any, input: HTMLInputElement) {
    if (!input.files) return
    const files: FileList = input.files;
    for (let i = 0; i < files.length; i++) {
      let url = address + files[i].name;
      if (this.data.task.imageArray!) {
        let id = this.data.task.imageArray.length
        this.data.task.imageArray[id] = "https://firebasestorage.googleapis.com/v0/b/camera-af868.appspot.com/o/0material%2FZZ5H.gif?alt=media&token=fe0d7f19-e84b-46f6-a20f-476a19906d14&_gl=1*2k4t6d*_ga*MTc4MDIzNzU1Ni4xNjk1NjIwMTg0*_ga_CW55HF8NVT*MTY5OTI0NjM4NS42OC4xLjE2OTkyNDYzOTAuNTUuMC4w";
        this.fbS.tt(url, files[i]).then((result: any) => {
          this.data.task.imageArray? this.data.task.imageArray[id] = result:0;
          // if (this.data.task.imageArray!) {
          //   this.data.task.imageArray[id] = result;
          // }
        });
      }
    }
  }

  // single file select
  async onImageSelect(address: string, key: any, input: HTMLInputElement) {
    if (!input.files) return
    const files: FileList = input.files;
    let url = address + files[0].name;
    this.fbS.tt(url, files[0]).then((result: any) => {
      console.log(result);
      this.data.task.image = result;
      console.log(this.data.task.image);
    });
  }
  onFileDelete(event: any, ref: any, key: any, index: number) {
    console.log(event, ref, key, index);
    this.data.task.imageArray?.splice(index, 1);
  }

  onImageUnselect(event: any, ref: any, key: any) {
    this.data.task.image = "";
  }
}


export interface TaskDialogData {
  task: Partial<fItem>;
  enableDelete: boolean;
}

export interface TaskDialogResult {
  task: fItem;
  delete?: boolean;
}
