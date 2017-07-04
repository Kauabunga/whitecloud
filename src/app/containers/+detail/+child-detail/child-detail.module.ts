import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './child-detail.routes';
import { ChildDetailComponent } from './child-detail.component';

@NgModule({
  declarations: [
    ChildDetailComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class ChildDetailModule {
  public static routes = routes;
}
