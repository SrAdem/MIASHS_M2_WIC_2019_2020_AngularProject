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

  load() {
    if ( localStorage.getItem("todoList") !== null ) {
      const tdl = JSON.parse(localStorage.getItem("todoList"));
      this.todoListSubject.next( {
        label: tdl.label,
        items: tdl.items
      });
    }
  }

  save(befor:TodoListData) {
    this.undo.push(befor);

    localStorage.setItem( "undo", JSON.stringify(this.undo) );
    localStorage.setItem( "todoList", JSON.stringify(this.todoListSubject.getValue()) );
    localStorage.setItem( "redo", JSON.stringify(this.redo) );
  }
}
