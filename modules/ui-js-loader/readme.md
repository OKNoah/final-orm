Webpack loader for [UI-js](https://www.npmjs.com/package/ui-js) framework
===

Features:
---
- Dev server hot module replacement (reload) for Components


TODO:
---

1) Pre compile component templates (string) to Virtual DOM elements, like React.
2) Pre compile styles to shadow styles for Shadow DOM.


Now this is the runtime, but I want to be able to produce precompile to accelerate the launch of the application, like this:
```javascript
class Button {
	
  static template = `
    <div .active (click)='alert(11)'>
      Push on me
    </div>
    <span>Text</span>
  `
  
}
```

compile to:
```javascript
class Button {
	
  static template = ui.elemen('template', null, [
    ui.element('div', {class: 'active', '(click)': 'alert(11)'}, [
    	' Push on me '
    ]),
    ui.element('span', null, [
    	'Text'
    ])
  ])
  	
}
```



