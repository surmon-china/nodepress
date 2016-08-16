import {Component} from '@angular/core';
import {BaCard} from '../../theme/components/baCard';

@Component({
  selector: 'theme',
  directives: [BaCard],
  template: require('./theme.html')
})

export class Theme {
  constructor() {
  }
}
