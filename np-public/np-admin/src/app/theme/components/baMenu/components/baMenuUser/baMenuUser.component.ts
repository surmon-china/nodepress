import {Component, ViewEncapsulation} from '@angular/core';

// 基本组件
@Component({
  selector: 'ba-menu-user',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./baMenuUser.scss')],
  template: require('./baMenuUser.html'),
  providers: [],
  directives: [BaMenuUser]
})

// 构造函数
export class BaMenuUser {
}
