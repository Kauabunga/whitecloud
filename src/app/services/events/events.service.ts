import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as firebase from 'firebase';
import {Event} from './events.model';

const database = firebase.database();

const eventsRef = database.ref('events');


@Injectable()
export class EventsService {

  constructor() {
  }

  retrieveEvent(id: string): Observable<Event> {
    return Observable.from(new Promise((resolve, reject) => {
      return database.ref(`events/${id}`)
        .once('value', (snapshot) => {
          const val = snapshot.val();
          if (val) {
            resolve(Object.assign({id: snapshot.key}, val));
          }
          else {
            reject();
          }
        })
    }))

  }
}
