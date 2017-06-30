import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { Event } from './events.model';

const database = firebase.database();

@Injectable()
export class EventsService {

  retrieveEvent(id: string): Observable<Event> {
    return Observable.from(new Promise((resolve, reject) => {
      return database.ref(`events/${id}`)
        .once('value', (snapshot) => {
          const val = snapshot.val();
          return val
            ? resolve(Object.assign({id: snapshot.key}, val))
            : reject();
        });
    }));

  }
}
