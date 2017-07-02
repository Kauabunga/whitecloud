import { DetailComponent } from './detail.component';
import { DetailGuard } from './detail.guard';
import { DetailImageGuard } from './detail-image.guard';

export const routes = [
  {
    path: ':id', data: {title: ''},
    canActivate: [DetailGuard], canDeactivate: [DetailGuard],
    component: DetailComponent,
    children: [
      {path: '', loadChildren: './+child-detail#ChildDetailModule'}
    ]
  },
];
