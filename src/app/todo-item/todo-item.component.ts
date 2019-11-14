import {ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
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
  @ViewChild("newTextInput", {static: false}) private inputLabel: ElementRef;
  private _editionMode: boolean = false;
  
  constructor(private todoService: TodoService) { }

  ngOnInit() {
  }

  get label() : string {
    return this.data.label
  }

  set label(newLabel: string) {
    this.todoService.setItemsLabel(newLabel, this.data);
  }

  get isDone() : boolean {
    return this.data.isDone;
  }

  set isDone(done: boolean) {
    this.todoService.setItemsDone(done, this.data);
  }

  get editionMode(): boolean {
    return this._editionMode;
  }

  set editionMode(e: boolean) {
    this._editionMode = e;
    requestAnimationFrame(() => this.inputLabel.nativeElement.focus());
  }

  removeItem() {
    this.todoService.removeItems(this.data);
  }
}
