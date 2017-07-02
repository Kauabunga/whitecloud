import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './create-location.routes';
import { CreateLocationComponent } from './create-location.component';
import { MdAutocompleteModule, MdButtonModule, MdInputModule, MdListModule, MdRadioModule } from '@angular/material';

@NgModule({
  declarations: [
    CreateLocationComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MdInputModule,
    MdButtonModule,
    MdAutocompleteModule,
    MdRadioModule,
    MdListModule,

    RouterModule.forChild(routes),
  ],
})
export class CreateLocationModule {
  public static routes = routes;
}
