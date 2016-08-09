import {Component} from '@angular/core';
import {BaCard} from '../../../../theme/components/baCard';

@Component({
  selector: 'new',
  directives: [BaCard],
  template: require('./new.html')
})

export class ArticleNew {
  constructor() {
  }
}
