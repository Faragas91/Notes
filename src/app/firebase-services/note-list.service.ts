import { inject, Injectable } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collection, collectionData, doc, onSnapshot, addDoc } from '@angular/fire/firestore';
import { elementAt, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  unsubTrash;
  unsubNotes;

  firestore: Firestore = inject(Firestore);

  constructor() { 
    this.unsubTrash = this.subTrashList();
    this.unsubNotes = this.subNotesList();
 
  }

  async addNote(item: Note){
    await addDoc(this.getNotesRef(), item).catch(
      (err) => {console.error(err)}
    ).then(
      (docRef) => {console.log("Document wirtten with ID: ", docRef?.id)}
    )
  }

  setNoteObject(obj: any, id:string): Note {
    return {
      id: id,
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false,
    }
  }
 
  ngOnDestroy() {
    this.unsubNotes?.();
    this.unsubTrash?.();
  }

  subTrashList() {
    return onSnapshot(this.getNotesRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      })
    })
  }

  subNotesList () {
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      })
    })
  }
  

  getNotesRef() {
    return collection(this.firestore, 'Notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  } 

  getSingleDocRef(colId: string, docId: string) {
    return doc(this.firestore, `${colId}/${docId}`);
  }
  
  
}
