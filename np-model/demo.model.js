name:String,
binary:Buffer,
living:Boolean,
updated:Date,
age:Number,
mixed:Schema.Types.Mixed, //该混合类型等同于nested
_id:Schema.Types.ObjectId,  //主键
_fk:Schema.Types.ObjectId,  //外键
array:[],
arrOfString:[String],
arrOfNumber:[Number],
arrOfDate:[Date],
arrOfBuffer:[Buffer],
arrOfBoolean:[Boolean],
arrOfMixed:[Schema.Types.Mixed],
arrOfObjectId:[Schema.Types.ObjectId]
nested:{
      stuff:String,
}



/*

// 发布分类
exports.postItem = params => {
  let category = params.body;
  commonModelPromise({
    model: Category,
    method: 'find',
    params: { slug: category.slug },
    error: params.error,
    success: data => {
      if (!!data.length) params.error({ message: 'slug已被使用!' });
      if (!data.length) {
        commonModelPromise({
          model: new Category(category),
          method: 'save',
          error: error,
          success: params.success,
        });
      };
    },
  });
};

// 批量删除分类
exports.delList = params => {
  let categories = params.body.categories.replace(/\s/g,'').split(',');
  commonModelPromise({ 
    model: Category,
    method: 'remove',
    params: { '_id': { $in: categories } },
    error: params.error,
    success: params.success,
  });
};

*/