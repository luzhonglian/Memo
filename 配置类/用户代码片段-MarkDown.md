文件->首选项->设置->打开设置(json)//run code 旁边

```json
 "[markdown]": {
    "editor.quickSuggestions": {
      "other": true,
      "comments": true,
      "strings": true
    },
  }
```

文件->首选项->配置用户代码片段

````json
{
  "code": {
    "prefix": "co",
    "body": ["```", "$1", "```"],
    "description": "Add  code block"
  },
  "JSCode": {
    "prefix": "js",
    "body": ["```javascript", "$1", "```"],
    "description": "Add js code block"
  }
}
````
