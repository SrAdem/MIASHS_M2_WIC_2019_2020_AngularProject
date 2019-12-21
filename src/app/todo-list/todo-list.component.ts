import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, ElementRef} from '@angular/core';
import {TodoListData} from '../dataTypes/TodoListData';
import {TodoItemData} from '../dataTypes/TodoItemData';
import {TodoService} from '../todo.service';
import { SpeechRecognitionService } from '../speech-recognition.service';

import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faMicrophoneAlt } from '@fortawesome/free-solid-svg-icons';

type FCT_FILTER_ITEMS = (item: TodoItemData) => boolean;

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit {

  filterAll: FCT_FILTER_ITEMS = () => true;
  filterDone: FCT_FILTER_ITEMS = (item) => item.isDone;
  filterUndone: FCT_FILTER_ITEMS = (item) => !item.isDone;
  currentFilter = this.filterAll;  

  @Input() private data: TodoListData;
  @ViewChild("newTitleInput", {static: false}) private inputLabel: ElementRef;
  @ViewChild("newTodoInput", {static: false}) private inputTodo: ElementRef;
  
  faUndo = faUndo;
  faRedo = faRedo;
  faTrash = faTrashAlt;
  faMicro = faMicrophoneAlt;

  private _editTitle: boolean = false;
  private onlyCompleted: boolean = false;
  private onlyActives: boolean = false;

  constructor(private todoService: TodoService, private speechRecognitionService : SpeechRecognitionService) { 
    todoService.getTodoListDataObserver().subscribe( tdl => this.data = tdl );
  }

  ngOnInit() {
  }

  get label(): string {
    return this.data ? this.data.label : '';
  }

  set label(newLabel: string) {
    newLabel !== this.data.label ? this.todoService.setListLabel(newLabel) : '';
    this._editTitle = false;
  }

  get items(): TodoItemData[] {
    return this.data ? this.data.items : [];
  }

  get itemLeft(): number {
    return this.data.items.filter(this.filterUndone).length
  }

  get editTitle() : boolean {
    return this._editTitle;
  }

  set editTitle(bool : boolean) {
    this._editTitle = bool;
    requestAnimationFrame(() => this.inputLabel.nativeElement.focus());
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

  isAllDone(): boolean {
    //return this.items.reduce( (acc, it) => acc && it.isDone, true);
    return this.items.every( it => it.isDone );
  }

  toggleAllDone() {
    const done = !this.isAllDone();
    this.todoService.setItemsDone(done, ...this.items);
  }

  getFilteredItems():TodoItemData[] {
    return this.data ? this.data.items.filter(this.currentFilter) : [] ;
  }

  deleteAllItems() {
    this.todoService.resetListItems();
  }

  undo() {
    this.todoService.undoItem();
  }

  redo() {
    this.todoService.redoItem();
  }

  voice() {
    this.speechRecognitionService.record()
    .subscribe(
      (value) =>  {
        this.speechRecognitionService.DestroySpeechObject();
        this.inputTodo.nativeElement.value = value;
        requestAnimationFrame(() => this.inputTodo.nativeElement.focus());
      },
      (err) => {
        if (err.error == "no-speech") {
          this.voice();
        }
      }
    );
  }
}
