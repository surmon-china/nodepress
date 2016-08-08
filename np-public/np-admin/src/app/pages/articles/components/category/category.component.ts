import {Component} from '@angular/core';
import {BaCard} from '../../../../theme/components/baCard';

@Component({
  selector: 'category',
  directives: [BaCard],
  template: require('./category.html')
})

export class Category {
  constructor() {
  }
}
