import {ChangeDetectionStrategy, Component, OnInit, Input} from '@angular/core';
import { TodoItemData } from '../dataTypes/TodoItemData';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent implements OnInit {

  @Input() private data: TodoItemData;
  edition: boolean = false;
  
  constructor(private todoService: TodoService) { }

  ngOnInit() {
  }

  get label() : string {
    return this.data.label
  }

  removeItem() {
    this.todoService.removeItems(this.data);
  }

  itemDone(done: boolean) {
    this.todoService.setItemsDone(done, this.data);
  }

  editItem() {
    this.edition = true;
    //TODO : le focus sur le input
  }

  editItemLabel(newLabel: string) {
    this.data.label = newLabel;
    this.edition = false;
  }
}
