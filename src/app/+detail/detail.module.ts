import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './detail.routes';
import { DetailComponent } from './detail.component';
import { DetailGuard } from './detail.guard';
import { MdButtonModule, MdIconModule, MdToolbarModule, MdTooltipModule } from '@angular/material';

@NgModule({
  declarations: [
    DetailComponent,
  ],
  providers: [
    DetailGuard
  ],
  imports: [
    CommonModule,
    FormsModule,

    MdButtonModule,
    MdToolbarModule,
    MdIconModule,
    MdTooltipModule,

    RouterModule.forChild(routes),
  ],
})
export class DetailModule {
  public static routes = routes;
}
