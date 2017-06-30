import { Routes } from '@angular/router';
import { NoContentComponent } from './containers/no-content';

export const ROUTES: Routes = [
  {path: '', loadChildren: './containers/+home#HomeModule'},
  {path: 'create', loadChildren: './containers/+create#CreateModule'},
  {path: 'detail', loadChildren: './containers/+detail#DetailModule'},
  {path: '**', component: NoContentComponent},
];
