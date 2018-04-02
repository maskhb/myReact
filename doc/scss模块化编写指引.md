# scss模块化编写指引

## 引入scss文件
```js
import './index.scss';
```

## scss模块化写法
```scss
.a {
  .b {
    
  }
  
  :global {
    .c {
      
    }
  }
}
```

## react模块化写法
```html
<div styleName="a">
  <div styleName="b">
    <div className="c">
      
    </div>
  </div>
</div>
```

## 生成的类名
```html
<div className="src-views-Goods-List-___view__a___3DLk0">
  <div className="src-views-Goods-List-___view__b___2QN1l"></div>
  <div className="c"></div>
</div>
```

## 类名生成规则
```
[path]___[name]__[local]___[hash:base64:5]
```
