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