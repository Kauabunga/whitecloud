import { CreateComponent } from './create.component';
import { CreateGuard } from './create.guard';
import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    canActivate: [CreateGuard], canDeactivate: [CreateGuard],
    component: CreateComponent,
    children: [
      {path: 'location', data: {title: ''},
        loadChildren: './+create-location#CreateLocationModule'},
      {path: 'details', data: {title: ''},
        loadChildren: './+create-details#CreateDetailsModule'},
      {path: '**', redirectTo: 'location'},
    ]
  },
];
