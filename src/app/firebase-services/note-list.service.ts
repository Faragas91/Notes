import { inject, Injectable } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { query, orderBy, limit, Firestore, collection, collectionData, doc, onSnapshot, addDoc, updateDoc, deleteDoc, where } from '@angular/fire/firestore';
import { elementAt, Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';

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

  async deleteNote(colId: string, docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
      (err) => {console.error(err)}
    ).then()
  }

  async updateNote(note: Note) {
    if (note.id) {
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJson(note)).catch(
        (err) => {console.error(err)}
      ).then()
    }
  }

  getCleanJson(note:Note):{} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    }
  }

  getColIdFromNote(note:Note):string {
    if(note.type == 'note') {
      return 'notes'
    } else {
      return 'trash'
    }
  }

  async addNote(item: Note, colId: "Notes" | "trash"){
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
    const q = query(this.getNotesRef(), orderBy("title") ,limit(3));
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
