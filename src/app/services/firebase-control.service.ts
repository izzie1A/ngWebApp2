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
  }

  async createDoc(address: string, id: string, content: any) {
    console.log('created', content)
    return await setDoc(doc(this.firestore, address, id), content);
  }
  async updateDoc(address: string, id: string, content: any) {
    const docRef = doc(this.firestore, address, id);
    return await updateDoc(docRef, content);
  }
  async readDoc(address: string, id: string) {
    console.log("asdadad");
    const docRef = doc(this.firestore, address, id);
    try {
      const doc = await getDocFromCache(docRef);
      console.log("Cached document data:", doc.data());
      return doc
    } catch (e) {
      console.log("Error getting cached document:", e);
      return e
    }
  }
  async deleteDoc(address: string, id: string) {
    console.log(address, id);
    await deleteDoc(doc(this.firestore, address, id));
    await console.log(deleteDoc(doc(this.firestore, address, id)));
  }
  async docSave(address: string, id: string, content: any) {
    console.log(address, id, content)
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


  async setCustomFile() {

  }

  getCollections(address: string) {
    const q = query(collection(this.firestore, address));

    return
  }

  async queryCollection(address: string, condton1: string, condton2: string, condton3: string) {
    console.log(condton1);
    // const q = query(collection(this.firestore, address), where(condton[0], condton[1], condton[2]));
    const q = query(collection(this.firestore, address));
    const querySnapshot = await getDocs(q);
    let result: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      // result.push(doc.data());
      let x = {
        id: doc.id,
        data: doc.data()
      }
      result.push(x);
    });
    console.log(result);
    return result
  }

  async docQueryCollection(collectionID: string, docID: string, name: string) {


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

  async getCollection(address: string) {
    return collectionData(collection(this.firestore, address));
  }

  // file storage
  async fireStorageUploadFile(address: string, input: HTMLInputElement) {
    if (!input.files) return
    const files: FileList = input.files;
    let fileName = input.value.split("\\").pop();
    let url = address + input.value.split("\\").pop();
    // console.log(address + fileName)
    const storage = getStorage();
    // const storage = getStorage();
    const storageRef = ref( getStorage(), url);
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
  constructor(name: string, id: string) {
    super(name, id);
  }
}