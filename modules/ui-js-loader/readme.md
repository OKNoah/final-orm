Webpack loader for ui-js framework https://www.npmjs.com/package/ui-js
===

Features:
---
- Dev server hot module replacement (reload) for Components


TODO:
---
Pre compile component templates (string) to Virtual DOM elements

like this:
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
