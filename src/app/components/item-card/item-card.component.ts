import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { FirebaseControlService } from "src/app/services/firebase-control.service";
import { AuthService } from "src/app/services/auth.service";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { ItemCardDialogComponent, TaskDialogResult } from './../../components/item-card-dialog/item-card-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css']
})

export class ItemCardComponent {
  @Input() item: Observable<any[]> | any | undefined;
  @Input() address: string = '';
  @Input() itemCardMode: 'view' | 'viewDetail' | 'edit' | 'keyValue' = 'view';
  
  @Output() newItemEvent = new EventEmitter<number>();
  editmode: boolean = false;
  saved: boolean = false;
  backupItem: any;

  constructor(public fbS: FirebaseControlService, public afs: AuthService, public dialog: MatDialog) {
    this.backupItem = this.item;
  }

  // 
  moveFile(direction:number) {
    this.newItemEvent.emit(direction);
  }

  // controrl
  deleteFile(address: string, id: string) {
    console.warn(address, id)
    this.fbS.deleteDoc(address, id);
  }
  // controrl

  editmodeClick(sholderRef: any) {
    if (this.editmode == true) {
      this.editmode = false
      sholderRef.style.backgroundColor = 'var(--green)';
    } else if (this.editmode == false) {
      this.editmode = true
      sholderRef.style.backgroundColor = 'var(--yellow)';
    }
  }

  itemCardModeSwitch(command: string) {
    switch (command) {
      case 'edit':
        this.itemCardMode = 'edit'
        break;
      case 'viewDetail':
        this.itemCardMode = 'viewDetail'
        break;
      case 'view':
        this.itemCardMode = 'view'
        break;
    }
  }
  itemCardControl(sholderRef: any, command: string) {
    switch (command) {
      case 'save':
        this.editmode = false
        sholderRef.style.backgroundColor = 'var(--green)';
        break;
      case 'close':
        this.editmode = false
        sholderRef.style.backgroundColor = 'var(--yellow)';
        break;
      case 'edit':
        this.editmode ? this.editmode = false : this.editmode = true;
        sholderRef.style.backgroundColor = 'var(--yellow)';
        break;
    }
  }

  // keyvalue edit
  localAddField(key: any, value: any) {
    this.item[key] = value;
  }
  localEditField(key: any, value: any) {
    this.item[key] = value;
  }
  localChangeField(key: any, value: any) {
    this.item[value] = this.item[key];
    delete this.item[key];
    console.log(this.item[key]);
  }
  localDeleteField(key: any, value: any) {
    this.item[value] = this.item[key];
    delete this.item[key];
    console.log(this.item[key]);
  }


  localArrayAdd(ref: any, value: any) {
    this.item[ref].push(value);
  }
  localArrayChange(ref: any, i: number, value: any) {
    this.item[ref][i] = value;
  }
  localArrayDelete(ref: any, i: number) {
    console.log(this.item[ref], i)
    this.item[ref].splice(i, 1);
    console.log(this.item[ref])
  }


  onFileSelected(event: any, ref: any, key: any) {
  }
  onFilePush(event: any, ref: any, key: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        ref[key].push(event.target?.result);
      };
    }
  }
  onFileEdit(address: string, key: any, input: HTMLInputElement) {
    if (!input.files) return
    this.item[key] = 'downloading';
    const files: FileList = input.files;
    let fileName = input.value.split("\\").pop();
    let url = address + fileName;
    console.log(address + fileName)
    const storage = getStorage();
    const storageRef = ref(storage, url);
    const uploadTask = uploadBytesResumable(storageRef, files[0]);
    uploadTask.then((snapshotx) => {
      console.log('Uploaded an array!');
      console.log(snapshotx);
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        this.item[key] = downloadURL;
      });
      console.log(url);
      return url;
    });
  }
  onFileDelete(address: string, key: any, index: number) {
    console.log(event, ref, key, index)
    console.log(this.item[key])
    delete this.item[key];
    console.log(this.item[key])
  }
  onFileClear(address: string, key: any) {
    this.item[key] = null
  }



  onFileArrayPush(address: string, key: any, input: HTMLInputElement) {
    if (!input.files) return
    const files: FileList = input.files;
    for (let i = 0; i < input.files.length; i++) {
      const storageRef = ref(getStorage(), (address + files[i].name));
      const uploadTask = uploadBytesResumable(ref(getStorage(), (address + files[i].name)), files[i]);
      const index = this.item[key].length + i;
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.item[key][index] = "https://firebasestorage.googleapis.com/v0/b/camera-af868.appspot.com/o/0material%2FZZ5H.gif?alt=media&token=fe0d7f19-e84b-46f6-a20f-476a19906d14&_gl=1*89wnsj*_ga*MTc4MDIzNzU1Ni4xNjk1NjIwMTg0*_ga_CW55HF8NVT*MTY5ODEyNzA4Ni40MC4xLjE2OTgxMjc4NTcuMTkuMC4w";
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            this.item[key][index] = downloadURL;
          });
        });
    }
  }


  onFileArrayEdit(address: string, key: string, i: number, input: HTMLInputElement) {
    if (!input.files) return
    this.item[key][i] = 'downloading';
    const files: FileList = input.files;
    let fileName = input.value.split("\\").pop();
    let url = address + fileName;
    console.log(address + fileName)
    const storage = getStorage();
    const storageRef = ref(storage, url);
    const uploadTask = uploadBytesResumable(storageRef, files[0]);
    uploadTask.then((snapshotx) => {
      console.log('Uploaded an array!');
      console.log(snapshotx);
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        this.item[key][i] = downloadURL;
      });
      console.log(url);
      return url;
    });
  }
  onFileArrayDelete(key: any, index: number) {
    console.log(this.item[key])
    this.item[key].splice(index, 1)
    console.log(this.item[key])
  }
  onFileArrayClear(event: any, ref: any, key: any, index: number) {
    console.log(event, ref, key, index)
    console.log(ref[key])
    this.item[key][index] = null
    console.log(ref[key])
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
      .subscribe((result: TaskDialogResult | undefined) => {
        if (!result) {
          return;
        }
        console.warn(result.task)
        // this.todo.push(result.task);
      });
  }

  editTask(): void {
    const dialogRef = this.dialog.open(ItemCardDialogComponent, {
      width: '50vh',
      data: {
        task: {
          id: this.item.id,
          name: this.item.name.toString(),
          description: this.item.description,
          imageArray: this.item.imageArray,
          image: this.item.image,
        },
      },
    });

    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult) => {
        if (!result) {
          return;
        } else {
          if (result.delete) {
            this.fbS.deleteDoc(this.address,this.item.id)            
          }
          let x = this.fbS.getCustomFile();
          x.id = result.task.id;
          x.name = result.task.name;
          x.description = result.task.description;
          x.image = result.task.image;
          x.imageArray = result.task.imageArray;
          this.fbS.updateDoc(this.address, x.id, x);
        }
      });

  }

}
