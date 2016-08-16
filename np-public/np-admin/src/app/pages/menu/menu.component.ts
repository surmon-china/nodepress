import {Component} from '@angular/core';
import {BaCard} from '../../theme/components/baCard';

@Component({
  selector: 'menus',
  directives: [BaCard],
  template: require('./menu.html')
})

export class Menu {
  constructor() {
  }
}
