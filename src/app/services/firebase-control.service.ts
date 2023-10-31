import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, collection, updateDoc, getDocFromCache, deleteDoc } from '@angular/fire/firestore';
import { DocumentData, WhereFilterOp, addDoc, doc, getDoc, getDocs, limit, orderBy, query, setDoc, where } from "firebase/firestore";
// import { getStorage, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Storage, getStorage, provideStorage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseControlService {
  firestore: Firestore = inject(Firestore);
  private storage: Storage = inject(Storage);
  firebaseServerResponse: any;

  constructor() {
    this.createDoc("test");
  }

  getCustomFile(){
    const item = new fItem("test", "test");
    const content = {
      id: item.id,
      name: item.name,
      createTime: item.createTime,
      tagArray :[],
      order:0,
      media: {
        imagefile: item.imagefile,
        imageArray: item.imageArray,
      },
      metaData: {
        createBy: 'anno',
        createTime: item.createTime,
      },
    };
    return content
  }
  
  // firestore curd
  async createDoc(address: string) {
    // const content = new fItem("test","test");
    const content = this.getCustomFile();

    const docRef = await addDoc(collection(this.firestore, address), content);
    content.id = docRef.id;
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await setDoc(doc(this.firestore, docRef.path), content);
      let x = await this.readDoc(address, docRef.id);
      console.log(x);
    } else {
      console.warn("doc create error!");
    }
  }

  async updateDoc(address: string, id: string, content: any) {
    const docRef = await doc(this.firestore, address, id);
    const result = await updateDoc(docRef, content);
    console.log(result);
    return result
  }

  async readDoc(address: string, id: string) {
    const docRef = await doc(this.firestore, address, id);
    try {
      const doc = await getDocFromCache(docRef);
      console.log("Cached document data:", doc.data());
      return doc
    } catch (e) {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        return { id: docSnap.id, data: docSnap.data() };
      } else {
        console.warn("No such document found");
      }
      return e
    }

  }
  async deleteDoc(address: string, id: string) {
    console.log(address, id);
    await deleteDoc(doc(this.firestore, address, id));
    await console.log(deleteDoc(doc(this.firestore, address, id)));
  }
  async docSave(address: string, id: string, content: any) {
    const docSnap = await getDoc(doc(this.firestore, address, id));
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      this.updateDoc(address, id, content)
    } else {
      console.log("No such document! now create");
      const docRef = await addDoc(collection(this.firestore, address), content);
      console.log("Document written with ID: ", docRef.id);
    }
  }

  // customObject uncompleted
  async setCustomFile(address: string, id: string) {
    let x = new tItem('undefinded', 'undefined');
    // :any potential threth
    const tItemConverter = {
      toFirestore: (tItem: fItem) => {
        return {
          name: tItem.name,
          id: tItem.id,
        };
      },
      // :any potential threth
      fromFirestore: (snapshot: any, options: any) => {
        const data = snapshot.data(options);
        return new tItem(data.name, data.id);
      }
    }
    const ref = doc(this.firestore, address, id).withConverter(tItemConverter);
    await setDoc(ref, x);
  }

  async addCustomFile(address: string) {
    let x = new tItem('undefinded', 'undefined');
    // :any potential threth
    const tItemConverter = {
      toFirestore: (tItem: fItem) => {
        return {
          name: tItem.name,
          id: tItem.id,
        };
      },
      // :any potential threth
      fromFirestore: (snapshot: any, options: any) => {
        const data = snapshot.data(options);
        return new tItem(data.name, data.id);
      }
    }
    const ref = doc(this.firestore, address, x.id).withConverter(tItemConverter);
    await setDoc(ref, x);
  }

  // collection
  t(address: string){
    // const itemCollection = collection(this.firestore, 'items');
    // return collectionData(itemCollection);
    // const itemCollection = collection(this.firestore, 'items');
    return collectionData(collection(this.firestore, address));
  }
  getCollectionValueChange(address: string) {
    const itemCollection = collection(this.firestore, address);
    return collectionData(itemCollection) as Observable<any[]>
  }

  async getCollection(address: string) {
    return collectionData(collection(this.firestore, address));
  }

  async queryCollection(address: string, condton1: string, condton2: string, condton3: string) {
    // const q = query(collection(this.firestore, address), where(condton[0], condton[1], condton[2]));
    const q = query(collection(this.firestore, address));
    const querySnapshot = await getDocs(q);
    let result: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      let x = {
        id: doc.id,
        data: doc.data()
      }
      result.push(x);
    });
    return result
  }

  async queryCondition(address: string, amountLimit: number, condton1: string, condton2: WhereFilterOp, condton3: string) {
    const q = await query(collection(this.firestore, address), orderBy("name"), limit(amountLimit));
    const querySnapshot = await getDocs(q);
    let result: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      result.push(doc.data());
      // result.push({ id: doc.id,data: doc.data()});
    });
    return result;
  }

  async queryCondition2(address: string, amountLimit: number, condton1: string, condton2: WhereFilterOp, condton3: string) {
    console.log(condton1);
    const q = await query(
      collection(this.firestore, address),
      where(condton1, condton2, condton3),
      orderBy("name"),
      limit(amountLimit));
    const querySnapshot = await getDocs(q);
    let result: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      result.push({ id: doc.id, data: doc.data() });
    });
    console.log(result);
    return result
  }


  // file storage
  async fireStorageUploadFile(address: string, input: HTMLInputElement) {
    if (!input.files) return
    const files: FileList = input.files;
    // let fileName = input.value.split("\\").pop();
    let url = address + input.value.split("\\").pop();
    // console.log(address + fileName)
    const storage = getStorage();
    // const storage = getStorage();
    const storageRef = ref(getStorage(), url);
    const uploadTask = uploadBytesResumable(storageRef, files[0]);
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
          case 'success':
            break;
        }
        return
      },
      (error) => {
        console.log(error);
        return error
      }
    )
  }

}


interface firebaseFile {
  id: string;
  data: any;
}

export class tItem implements firebaseFile {
  id: string;
  data: any;
  a: any;
  constructor(name: string, id: string) {
    this.id = id;
  }
}

class fItem extends tItem {
  imagefile: any = [];
  imageArray: string[] = [];
  createTime: number = Date.now();
  name: string;
  constructor(name: string, id: string) {
    super(name, id);
    this.name = name;
  }
}
