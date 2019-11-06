import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {TodoListData} from '../dataTypes/TodoListData';
import {TodoItemData} from '../dataTypes/TodoItemData';
import {TodoService} from '../todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit {

  @Input() 
  private data: TodoListData;

  private titre: string;
  private onlyCompleted: boolean = false;
  private onlyActives: boolean = false;

  constructor(private todoService: TodoService) { 
    todoService.getTodoListDataObserver().subscribe( tdl => this.data = tdl );
    this.titre = this.data.label;
  }

  ngOnInit() {
  }

  get label(): string {
    return this.data ? this.data.label : '';
  }

  get items(): TodoItemData[] {
    return this.data ? this.data.items : [];
  }

  get itemLeft(): number {
    let left: number = 0; 
    this.items.map((v) => !v.isDone ? left=left+1 : "");
    return left;
  }

  appendItem(label: string) {
    if(label.length != 0) { 
      this.todoService.appendItems(
        {
          label,
          isDone:false
        }
      );
    }
  }

  itemDone(item: TodoItemData, done: boolean) {
    this.todoService.setItemsDone(done, item);
  }

  itemLabel(item: TodoItemData, label: string) {
    this.todoService.setItemsLabel(label, item);
  }

  removeItem(item: TodoItemData) {
    this.todoService.removeItems(item);
  }

  removeCheckedItems() {
    this.items.map((v) => v.isDone ? this.removeItem(v) : '');
  }

  displayCompletedItems() {
    this.onlyCompleted = true;
    this.onlyActives = false;
    console.log("only completed");
  }

  displayActivesItems() {
    this.onlyActives = true;
    this.onlyCompleted = false;
    console.log("only actives");
  }

  displayAll() {
    this.onlyCompleted = false;
    this.onlyActives = false;
    console.log("all");
  }
}
