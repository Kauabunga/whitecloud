import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './home.routes';
import { MdButtonModule, MdIconModule, MdToolbarModule, MdListModule } from '@angular/material';
import { HomeComponent } from './home.component';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  providers: [],
  imports: [
    CommonModule,

    PipesModule,

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
