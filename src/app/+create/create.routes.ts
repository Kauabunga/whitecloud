import {CreateComponent} from './create.component';

export const routes = [
  {
    path: '', data: {title: 'Create a new event'},
    children: [
      {path: '', component: CreateComponent},
      {path: 'child-barrel', loadChildren: './+child-barrel#ChildBarrelModule'}
    ]
  },
];
