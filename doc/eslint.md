# eslint

## 配置文件
```
├─.eslintrc            # 配置文件
```

```js
{
  "extends": "airbnb" // 基于airbnb配置
}
```

## git提交前触发
```
├─package.json         # 配置pre-commit
```

```json
{
  "scripts": {
    "precommit": "npm run lint-staged",
    "lint-staged": "lint-staged",
    "lint-staged:js": "eslint --ext .js"
  },
  "lint-staged": {
    "**/*.{js,jsx}": "lint-staged:js",
    "**/*.less": "stylelint --syntax less"
  }
}
```

## IDE配置eslint
| IDE | 配置 |
| - | - |
| atom | linter linter-eslint linter-stylelint linter-ui-default |
