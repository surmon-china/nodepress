import {Component} from '@angular/core';
import {BaCard} from '../../theme/components/baCard';

@Component({
  selector: 'comment',
  directives: [BaCard],
  template: require('./comment.html')
})

export class Comment {
  constructor() {
  }
}
