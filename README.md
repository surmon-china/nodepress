## NodePress V1.0.1

Author By Surmon Surmon@foxmail.com

# 开发者文档

## 接口基础

## 全站接口

  - 文章分类
  
    * 获取分类列表：

    ```
    API: /api/category  GET
    REMARK: 数组形式返回，需客户端自己组装嵌套数据
    ```

    * 添加分类：
    
    ```
    API: /api/category  POST
    DATA: {
        name: '分类名称',
        slug: 'cate_slug',
        pid: 'objectID' || null,
        description: '分类描述'
    }
    REMARK: pid和描述非必填项
    TODU: ~~slug需具备唯一性，缺乏验证限制~~
    ```

    * 批量删除分类：
    
    ```
    API: /api/category  DELETE
    DATA: {
        categories: 'objectID,objectID,objectID,...'
    }
    ```
    
    * 获取单个分类（以及此分类上级关系）：
    
    ```
    API: /api/category/:category_id  GET
    PATH: {
        category_id: 'objectID'
    }
    REMARK: 数组形式返回，从前到后，分别是此分类的最高父级至自身
    ```
    
    * 修改单个分类：
    
    ```
    API: /api/category/:category_id  PUT
    DATA: {
        name: '分类名称',
        slug: 'cate_slug',
        pid: 'objectID' || null,
        description: '分类描述'
    }
    REMARK: 修改后返回最新数据，pid非必填，pid值应为objID || 0 || false || null
    TODU: ~~slug需具备唯一性，缺乏验证限制~~
    ```
    
    * 删除单个分类：
    
    ```
    API: /api/category/:category_id  DELETE
    PATH: {
        category_id: 'objectID'
    }
    REMARK: 删除一个分类后，如果此分类包含子分类，则会将自己的子分类的pid自动更正为自己之前的pid或者NULL
    ```


## 文件架构

### 目录结构

## 插件机制

## 主题机制