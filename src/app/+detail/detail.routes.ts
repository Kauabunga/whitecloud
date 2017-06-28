import { DetailComponent } from './detail.component';
import { DetailGuard } from './detail.guard';

export const routes = [
  {
    path: ':id', data: {title: ''},
    canActivate: [DetailGuard], canDeactivate: [DetailGuard],
    component: DetailComponent,
    // children: [
    //   {path: '', },
    //   {path: 'child-detail', loadChildren: './+child-detail#ChildDetailModule'}
    // ]
  },
];
