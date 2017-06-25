import {DetailComponent} from './detail.component';
import {DetailGuard} from './detail.guard';

export const routes = [
  {
    path: ':id', data: {title: 'Detail'},
    canActivate: [DetailGuard], canDeactivate: [DetailGuard],
    children: [
      {path: '', component: DetailComponent},
      {path: 'child-detail', loadChildren: './+child-detail#ChildDetailModule'}
    ]
  },
];
