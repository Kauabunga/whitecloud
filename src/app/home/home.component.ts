import {
  Component,
  OnInit
} from '@angular/core';

import {AppState} from '../app.service';
import {Title} from './title';
import {XLargeDirective} from './x-large';

@Component({
  selector: 'home',
  providers: [
    Title
  ],
  styleUrls: ['home.component.css'],
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {

  height: number = 0;

  constructor(public title: Title) {
  }

  public ngOnInit() {
    this.height = window.innerHeight;
  }

}
