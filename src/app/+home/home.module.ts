import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './home.routes';
import { MdButtonModule, MdIconModule, MdToolbarModule, MdListModule } from '@angular/material';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,

    MdButtonModule,
    MdToolbarModule,
    MdIconModule,
    MdListModule,

    RouterModule.forChild(routes),
  ],
})
export class HomeModule {
  public static routes = routes;
}
