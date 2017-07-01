import { NgModule } from '@angular/core';
import { MomentPipe } from './moment/moment.pipe';
import { DewidowPipe } from './dewidow/dewidow.pipe';

@NgModule({
  declarations: [
    MomentPipe,
    DewidowPipe,
  ],
  exports: [
    MomentPipe,
    DewidowPipe,
  ]
})
export class PipesModule {
}
