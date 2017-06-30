import { CreateDetailsComponent } from './create-details.component';
import { CreateDetailsGuard } from './create-details.guard';

export const routes = [
  {
    path: '', component: CreateDetailsComponent, pathMatch: 'full',
    canActivate: [CreateDetailsGuard], canDeactivate: [CreateDetailsGuard]
  },
];
