import { CreateComponent } from './create.component';
import { CreateGuard } from './create.guard';
import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    canActivate: [CreateGuard], canDeactivate: [CreateGuard],
    component: CreateComponent,
    children: [
      {path: 'location', data: {title: 'Create location'},
        loadChildren: './+create-location#CreateLocationModule'},
      {path: 'details', data: {title: 'Create details'},
        loadChildren: './+create-details#CreateDetailsModule'},
      {path: '**', redirectTo: 'location'},
    ]
  },
];
