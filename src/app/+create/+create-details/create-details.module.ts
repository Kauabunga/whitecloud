import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {routes} from './create-details.routes';
import {CreateDetailsComponent} from './create-details.component';
import {MdAutocompleteModule, MdButtonModule, MdInputModule, MdRadioModule} from '@angular/material';


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

    RouterModule.forChild(routes),
  ],
})
export class CreateDetailsModule {
  public static routes = routes;
}
