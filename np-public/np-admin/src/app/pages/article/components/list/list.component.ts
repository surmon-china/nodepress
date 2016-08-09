import {Component} from '@angular/core';
import {BaCard} from '../../../../theme/components/baCard';

@Component({
  selector: 'list',
  directives: [BaCard],
  template: require('./list.html')
})

export class ArticleList {
  constructor() {
  }
}
