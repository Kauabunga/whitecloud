import { Action } from '@ngrx/store';
import { Image } from './images.model';

export const INIT = '[Image] Init';

export const UPLOAD = '[Image] Upload';
export const UPLOAD_SUCCESS = '[Image] Upload Success';
export const UPLOAD_FAILURE = '[Image] Upload Failure';

export const LOAD = '[Image] Load';
export const LOAD_SUCCESS = '[Image] Load Success';
export const LOAD_FAILURE = '[Image] Load Failure';

export class UploadAction implements Action {
  readonly type = UPLOAD;

  constructor(public payload: any) {
  }
}

export class UploadSuccessAction implements Action {
  readonly type = UPLOAD_SUCCESS;

  constructor(public payload: any) {
  }
}

export class UploadFailureAction implements Action {
  readonly type = UPLOAD_FAILURE;

  constructor(public payload: Error) {
  }
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: string) {
  }
}

export class LoadSuccessAction implements Action {
  readonly type = LOAD_SUCCESS;

  constructor(public payload: {id: string, image: Image}) {
  }
}

export class LoadFailureAction implements Action {
  readonly type = LOAD_FAILURE;

  constructor(public payload: Error) {
  }
}

export type Actions
  = UploadAction
  | UploadSuccessAction
  | UploadFailureAction
  | LoadAction
  | LoadSuccessAction
  | LoadFailureAction;
