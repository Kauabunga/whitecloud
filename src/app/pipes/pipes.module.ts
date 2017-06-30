import { NgModule } from '@angular/core';
import { MomentPipe } from './moment/moment.pipe';

@NgModule({
  declarations: [
    MomentPipe,
  ],
  exports: [
    MomentPipe,
  ]
})
export class PipesModule {
}
