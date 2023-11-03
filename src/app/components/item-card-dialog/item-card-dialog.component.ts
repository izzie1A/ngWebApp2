import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fItem } from "src/app/services/firebase-control.service";
import { FirebaseControlService, tItem } from "src/app/services/firebase-control.service";
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

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
  ) { }


  localArrayDrop(event: CdkDragDrop<any[]> | any): void {
    console.log(event);
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
      console.log(url);
      console.log(files[i].name);
      this.fbS.tt(url, files[i]).then((result: any) => {
        this.data.task.imageArray?.push(result);
      });
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
