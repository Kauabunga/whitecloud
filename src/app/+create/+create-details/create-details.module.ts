import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './create-details.routes';
import { CreateDetailsComponent } from './create-details.component';
import {
  MdAutocompleteModule, MdButtonModule, MdButtonToggleModule, MdInputModule,
  MdRadioModule
} from '@angular/material';

@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    CreateDetailsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MdInputModule,
    MdButtonModule,
    MdAutocompleteModule,
    MdRadioModule,
    MdButtonToggleModule,

    RouterModule.forChild(routes),
  ],
})
export class CreateDetailsModule {
  public static routes = routes;
}
