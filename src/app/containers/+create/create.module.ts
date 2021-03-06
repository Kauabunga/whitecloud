import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './create.routes';
import { CreateComponent } from './create.component';
import { MdAutocompleteModule, MdButtonModule, MdInputModule, MdRadioModule } from '@angular/material';
import { CreateGuard } from './create.guard';

@NgModule({
  declarations: [
    CreateComponent,
  ],
  providers: [CreateGuard],
  imports: [
    ReactiveFormsModule,

    MdInputModule,
    MdButtonModule,
    MdAutocompleteModule,
    MdRadioModule,

    RouterModule.forChild(routes),
  ],
})
export class CreateModule {
  public static routes = routes;
}
