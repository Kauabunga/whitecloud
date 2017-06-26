import { Routes } from '@angular/router';
import { NoContentComponent } from './no-content';

export const ROUTES: Routes = [
  {path: '', loadChildren: './+home#HomeModule'},
  {path: 'create', loadChildren: './+create#CreateModule'},
  {path: 'detail', loadChildren: './+detail#DetailModule'},
  {path: '**', component: NoContentComponent},
];
