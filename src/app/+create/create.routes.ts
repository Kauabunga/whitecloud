import { CreateComponent } from './create.component';
import { CreateGuard } from './create.guard';
import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '', data: {title: 'Create'},
    canActivate: [CreateGuard], canDeactivate: [CreateGuard],
    component: CreateComponent,
    children: [
      {path: 'create-location', loadChildren: './+create-location#CreateLocationModule'},
      {path: 'create-details', loadChildren: './+create-details#CreateDetailsModule'},
      {path: '**', redirectTo: 'create-location'},
    ]
  },
];
