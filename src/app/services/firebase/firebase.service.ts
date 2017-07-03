import { Observable, ReplaySubject } from 'rxjs';
import * as firebase from 'firebase';

const database = firebase.database();

export function set(ref: string, obj: any): Observable<any> {
  return Observable.from<any>(
    database.ref(ref).set(obj)
  );
}

export function push(ref: string, obj: any): Observable<any> {
  return Observable.from<any>(
    database.ref(ref)
      .push(
        Object.assign({}, obj, {
          createdAt: firebase.database.ServerValue.TIMESTAMP
        })
      ).catch((err) => {
        console.error(err);
        throw err;
    })
  );
}

export function get<T>(ref: string): Observable<T> {
  const replay: ReplaySubject<T> = new ReplaySubject();
  database.ref(ref).on(
    'value',
    (snapshot) => replay.next(snapshot.val()),
    (err) => replay.error(err),
  );
  // TODO unsubscribe when
  // replay.last().subscribe()
  return replay;
}
