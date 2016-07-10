// Array方法扩展

// 获取元素下标
Array.prototype.indexOf = function(item) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == item) return i;
  }
  return -1;
};

// 删除数组中某元素
Array.prototype.remove = function(item) {
  var index = this.indexOf(item);
  if (index > -1) {
    this.splice(index, 1);
  }
};

// 找到子元素则返回子元素本身，否则返回false
Array.prototype.find = function (value, key, children) {

  // 数组对象
  if (arguments.length > 1) {

    var childed = false;

    var find_child = function (main) {
      for (var i = 0; i < main.length; i++) {
        if (main[i][key] == value) {
          childed = main[i];
          return;
        } else if (children && main[i][children]) {
          find_child(main[i][children]);
        }
      }
    };

    find_child(this);

    return childed;
  }

  // 普通数组
  if (arguments.length == 1) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == value) return this[i];
    }
    return false;
  }
};

// 找到子元素的父元素，否则返回false
Array.prototype.parent = function (value, key, children) {

  var obj = {
    id: 0,
    children: this
  }

  // 数组对象
  var parent = false;

  var find_parent = function (main) {
    for (var i = 0; i < main.children.length; i++) {
      if (main.children[i][key] == value) {
        parent = main;
        return;
      } else if (children && main.children[i][children]) {
        find_parent(main.children[i]);
      }
    }
  };

  find_parent(obj);

  return parent;

};

// 将元素中所有子元素的指定（id）打包为一个数组
Array.prototype.ids = function (id_key) {

  var ids = [];

  var id_key = id_key || 'id';

  for (var i = 0; i < this.length; i++) {
    if (this[i][id_key]) {
      ids.push(this[i][id_key]);
    }
  }

  return ids;
};

// 将元素中所有级别子元素中被选中的元素的id打包为一个数组
Array.prototype.checked = function (children, id_key) {

  var ids = [];
  var find_check;

  if (arguments.length < 2) {
    find_check = function (main) {
      for (var i = 0; i < main.length; i++) {
        if (main[i].checked) {
          ids.push(main[i].id);
        };
        if (!!children && main[i][children]) {
          find_check(main[i][children]);
        }
      }
    };
  } else {
    find_check = function (main) {
      for (var i = 0; i < main.length; i++) {
        if (main[i].checked) {
          ids.push(main[i][id_key]);
        };
        if (!!children && main[i][children]) {
          find_check(main[i][children]);
        }
      }
    };
  };

  find_check(this);
  return ids;
};

// 设置元素及子元素的属性值
Array.prototype.setAttr = function (key, value) {
  var set_check = function (main) {
    for (var i = 0; i < main.length; i++) {
      main[i][key] = value;
    }
  };
  set_check(this);
};

// 设置元素及子元素的选择状态（可关联自身所有子级）
Array.prototype.setCheck = function (value, children) {
  var set_check = function (main) {
    for (var i = 0; i < main.length; i++) {
      main[i].checked = value;
      if (children && main[i][children]) {
        set_check(main[i][children]);
      }
    }
  };
  set_check(this);
};

// 检查数组对象中是否包含某元素
Array.prototype.contain = function (value, key) {

  // 深度查数组对象
  if (arguments.length == 2) {
    var find_key = function (main) {
      for (var i = 0; i < main.length; i++) {
        if (main[i][key] == value) {
          // break;
          return true;
        } else if (main[i].children) {
          find_key(main[i].children);
        }
      }
      return false;
    };
    return find_key(this);
  }

  // 查单数组
  if (arguments.length == 1) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == value) return true;
    }
    return false;
  }
  
};

// 将数组转换为对象，对象key为指定key
Array.prototype.toObject = function (key) {
  function toObject(arr) {
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
      obj[arr[i][key]] = arr[i];
    }
    return obj;
  }
  return toObject(this);
};

// 对象方法扩展
var objExtend = function () {

  // 转为数组
  this.toArray = function (obj) {
    var data = [];
    for (var key in obj){
      if (obj.hasOwnProperty(key)) {
        data.push({id: obj[key].id, data: obj[key]});
      }
    }
    return data;
  };

  // 判断对象是否为空 Not Null Object
  this.isNotNull = function (obj) {
    for(var i in obj){
      if(obj.hasOwnProperty(i)){
        return true;
      }
    }
    return false;
  };

};
var Obj = new objExtend();

// String 扩展
String.prototype.contain = function (str) {
  if(this.indexOf(str) > -1){
    return true;
  } else {
    return false;
  }
};