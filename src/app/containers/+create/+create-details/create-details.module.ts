import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './create-details.routes';
import { CreateDetailsComponent } from './create-details.component';
import {
  MdButtonModule,
  MdButtonToggleModule, MdDatepickerModule, MdIconModule,
  MdInputModule,
  MdTooltipModule
} from '@angular/material';
import { CreateDetailsGuard } from './create-details.guard';

@NgModule({
  declarations: [
    CreateDetailsComponent,
  ],
  providers: [
    CreateDetailsGuard,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MdInputModule,
    MdButtonModule,
    MdIconModule,
    MdTooltipModule,
    MdButtonToggleModule,
    MdDatepickerModule,

    RouterModule.forChild(routes),
  ],
})
export class CreateDetailsModule {
  public static routes = routes;
}
