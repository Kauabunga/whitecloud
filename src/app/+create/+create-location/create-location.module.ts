import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './create-location.routes';
import { CreateLocationComponent } from './create-location.component';
import {MdAutocompleteModule, MdButtonModule, MdInputModule, MdRadioModule} from '@angular/material';


@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    CreateLocationComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MdInputModule,
    MdButtonModule,
    MdAutocompleteModule,
    MdRadioModule,

    RouterModule.forChild(routes),
  ],
})
export class CreateLocationModule {
  public static routes = routes;
}
