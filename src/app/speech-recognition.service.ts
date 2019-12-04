import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as _ from "lodash";

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognitionService {
  speechRecogniton: any;

  constructor(private zone: NgZone) { }
  
  record(): Observable<string> {
    return Observable.create(observer => {
      const { webkitSpeechRecognition }: IWindow = <IWindow>(<any>window);
      this.speechRecogniton = new webkitSpeechRecognition();
      // this.speechRecogniton = SpeechRecognition;
      this.speechRecogniton.continuous = true;
      // this.speechRecogniton.interimResults = true;
      this.speechRecogniton.lang = 'fr';
      this.speechRecogniton.maxAlternatives = 1;

      this.speechRecogniton.onresult = speech => {
        let term: string = "";
        if(speech.results) {
          var result = speech.results[speech.resultIndex];
          var transcript = result[0].transcript;
          if (result.isFinal) {
            if(result[0].confidence < 0.3) {
            }
            else {
              term = _.trim(transcript);
            }
          }
        }
        this.zone.run(() => {
          observer.next(term);
        });
      };

      this.speechRecogniton.onerror = error => {
        observer.error(error);
      };

      this.speechRecogniton.onend= () => {
        observer.complete();
      };

      this.speechRecogniton.start();
    });
  }

  DestroySpeechObject() {
    if (this.speechRecogniton)
      this.speechRecogniton.stop();
  }

}
