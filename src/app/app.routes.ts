import {Routes} from '@angular/router';
import {HomeComponent} from './home';
import {AboutComponent} from './about';
import {NoContentComponent} from './no-content';

import {DataResolver} from './app.resolver';

export const ROUTES: Routes = [
  {path: '', component: HomeComponent, data: {title: 'Eco Hotspots'}},
  {path: 'about', component: AboutComponent, data: {title: 'About'}},
  {path: 'create', loadChildren: './+create#CreateModule'},
  {path: 'detail', loadChildren: './+detail#DetailModule'},
  {path: '**', component: NoContentComponent},
];
