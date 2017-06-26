import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { NoContentComponent } from './no-content';

export const ROUTES: Routes = [
  {path: '', component: HomeComponent, data: {title: 'Eco Hotspots'}},
  {path: 'create', loadChildren: './+create#CreateModule'},
  {path: 'detail', loadChildren: './+detail#DetailModule'},
  {path: '**', component: NoContentComponent},
];
