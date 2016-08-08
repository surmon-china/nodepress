import {Component, ViewEncapsulation} from '@angular/core';

// 基本组件
@Component({
  selector: 'ba-menu-footer',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./baMenuFooter.scss')],
  template: require('./baMenuFooter.html'),
  providers: [],
  directives: [BaMenuFooter]
})

// 构造函数
export class BaMenuFooter {
}
