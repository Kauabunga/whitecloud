import { CreateComponent } from './create.component';
import { CreateGuard } from './create.guard';
import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    canActivate: [CreateGuard], canDeactivate: [CreateGuard],
    component: CreateComponent,
    children: [
      {path: 'create-location', data: {title: 'Create location'},
        loadChildren: './+create-location#CreateLocationModule'},
      {path: 'create-details', data: {title: 'Create details'},
        loadChildren: './+create-details#CreateDetailsModule'},
      {path: '**', redirectTo: 'create-location'},
    ]
  },
];
