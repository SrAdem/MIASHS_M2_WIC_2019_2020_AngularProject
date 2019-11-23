import { Injectable } from '@angular/core';
import {TodoListData} from './dataTypes/TodoListData';
import {Observable, BehaviorSubject} from 'rxjs';
import {TodoItemData} from './dataTypes/TodoItemData';

@Injectable()
export class TodoService {

  private todoListSubject = new BehaviorSubject<TodoListData>( {label: 'TodoList', items: []} );

  private undo: TodoListData[] = [];
  private redo: TodoListData[] = [];

  constructor() {
    this.load();
  }

  getTodoListDataObserver(): Observable<TodoListData> {
    return this.todoListSubject.asObservable();
  }

  setListLabel(title: string) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: title,
      items: tdl.items
    });

    this.save(tdl);
  }

  setItemsLabel(label: string, ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label,
      items: tdl.items.map( I => items.indexOf(I) === -1 ? I : ({label, isDone: I.isDone}) )
    });

    this.save(tdl);
  }

  setItemsDone(isDone: boolean, ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label,
      items: tdl.items.map( I => items.indexOf(I) === -1 ? I : ({label: I.label, isDone}) )
    });

    this.save(tdl);
  }

  appendItems( ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label, // ou on peut écrire: ...tdl,
      items: [...tdl.items, ...items]
    });

    this.save(tdl);
  }

  removeItems( ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label, // ou on peut écrire: ...tdl,
      items: tdl.items.filter( I => items.indexOf(I) === -1 )
    });

    this.save(tdl);
  }

  resetListItems() {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label,
      items: []
    });

    this.save(tdl);
  }

  undoItem() {
    if(this.undo.length !== 0) {
      this.redo.push(this.todoListSubject.getValue()); //On met la liste actuelle dans le redo
      const before = this.undo.pop(); //On retire la liste précédente du undo
      this.todoListSubject.next( { //La liste précédente devient la liste actuelle
        label: before.label,
        items: before.items
      });

      this.saveToLocalStorage();
    }
  }

  redoItem() {
    if(this.redo.length !== 0) {
      this.undo.push(this.todoListSubject.getValue()) //On met la liste actuelle dans le undo
      const after = this.redo.pop(); //On retire la liste suivante de redo
      this.todoListSubject.next( { //La liste suivante devient la liste actuelle
        label: after.label,
        items: after.items
      });
      this.saveToLocalStorage();
    }
  }

  private load() {
    if ( localStorage.getItem("todoList") !== null ) {
      const tdl = JSON.parse(localStorage.getItem("todoList"));
      this.todoListSubject.next( {
        label: tdl.label,
        items: tdl.items
      });
    }
    if( localStorage.getItem("undo") !== null ) {
      this.undo = JSON.parse(localStorage.getItem("undo"));
    }
    if( localStorage.getItem("redo") !== null ) {
      this.undo = JSON.parse(localStorage.getItem("redo"));
    }
  }

  private save(before:TodoListData) {
    this.undo.push(before);
    this.redo = [];
    this.saveToLocalStorage();
  }

  private saveToLocalStorage() {
    localStorage.setItem( "undo", JSON.stringify(this.undo) );
    localStorage.setItem( "todoList", JSON.stringify(this.todoListSubject.getValue()) );
    localStorage.setItem( "redo", JSON.stringify(this.redo) );
  }
}
