`UI-js` (alpha 0.0)

Frontend MVVM framework like Angular 2 and React, but better =)
===

Link to [GitHub](https://github.com/uMaxmaxmaximus/ui-js/issues)

Don't use it! Please don't install it! Don't use! This is experiment I change API every day. And I come up with something new every day. It is not even beta, even not alpha! It's just my dream of an ideal framework =)
---


If you still want to immerse yourself in a fairy tale:

- Use ES6 with [Babel](https://www.npmjs.com/package/babel) 
- Use [Webpack](https://www.npmjs.com/package/webpack) to build application.
- Use [Webpack loader](https://www.npmjs.com/package/ui-js-loader) to hot components livereload. 
- Use Shadow DOM emulation and Shadow Styles emulation in components.
- Extend components cuz its just javascript classes.
- Enjoy =)


Basic example:
===

index.js:
```javascript
import ui from 'ui-js'
import App from './app.js'

// starting root component in body
ui.bootstrap(App)
```

app.js:
```javascript
export default class App {

  static template = `
    Hello {{name}} !!!
  `
  constructor(){
    this.name = 'World'
  }

}
```

its render to:
```html
<head></head>
<body>
  Hello World !!!
<body>
```


Component example:
===

```javascript
export default class Button {

  // this is custom html element name
  static tag = 'button'

  // this is shadow style (isolated style for component)
  // we can use any selectors, even * or tag names,
  // and they will act only within the component template
  static style = require('./button.css') // webpack loader as css text

  // child components to be used in a template
  static components = []

  // template
  static template = `
    <div>Button text</div>
  `

  constructor(){
    // This property will be seen in template as {{prop}}
    this.prop = 'val'
  }

}
```

usage:
```javascript
import Button from './button.js'

export default class App {

  // button component will be used in template
  static components = [Button]
  static template = `
    Demo buttons:
    <button></button>
    <button></button>
  `

}
```
its render to:
```html
<head></head>
<body>
  Demo buttons:

  <ui-button>
    <div>Button text</div>
  </ui-button>

  <ui-button>
    <div>Button text</div>
  </ui-button>

<body>
```

In style we can use `:host` selector to styling root component element.

If selector name is `button`, after rendering component name is `ui-button`,
to avoid conflict with the built-in browser elements.

ui-button element hav not display style, and you need set it:

```css
:host{
    display: block
}
```
This is a typical situation for the ShadowDOM

Global components
===

Add button to global component (used in all component templates)
Replace all `button` tags in application to Button component.
```javascript
import Button from './button.js'
ui.component(Button)
```


Template features
===

```html
<div>
  {{ 2+3 }} javascript expression injection
  undefined is interpreted as an empty string
  Hello {{ "World" }} !!
  
  Component fields available in expressions, and when field will
  change, then expression will instantly recalculate.
  Cuz framework use getters and setters to watch data changes.
   
  Global window fields not available in expressions,
  only component instance fields available.
</div>


<div class="Hello {{'World'}}">
  Expressions works even in all attributes
</div>


<div .class-name>
  Alias for class='class-name'
</div>


<div .class-name='exp'>
  if expression is true, class added to element,
  if false, class removed
</div>
  
  
<div (click)='handler($event)'>
  Call handler($event) on click event.
  In expression available $event variable for access
  to the event. If in javascript we emit custom event, 
  element.emit('ololo', 11) its works too. 
  <div (ololo)="func($event)"> $event === 11
</div>
  

<div ((click))="handler()">
  Own click on element, not on children
</div>
  

<div *directive>
  Directives like angular.
  Directive can control the behavior of the framework at a low level.
</div>
  

<div *for="item in array">
  {{ item }} -- On this place is replaced with the item value
  Repeat element by array.
  Current array element available as item.
  in - keyword
  item - you to choose a name variable
  array - expression that returns array or number 
  
  Syntax variations:
  <div *for="item, index in arr"></div>
  <div *for="arr"></div>
  <div *for="11"></div>
  <div *for="item in 5"> {{ item }} </div> 1, 2, 3, 4, 5
</div>
 
 
<div [prop]="exp">
  Two way data binding element.prop = exp
  
  Example:
  <input [value]="text">
  Its automatic create text variable and we can use it
  {{ text }}
  
  We can bind even paths prop.prop.prop
  <div [style.color]="'red'"></div>
  
  If in expression we use {{  }} brackets,
  Expression result interpreted as string
  Example:
  <div [style.width]="{{ 100 }}px"></div>
  Expression {{ 100 }}px return string "100px"
  
  If element is component, data bind apply to component instance,
  instead of the host element component.
  <my-chat [smiles]="true"></my-chat>
  In this way we can set components options
  
  If we want access to host element of component, 
  we can use host property:
  <my-chat [host.style.width]="{{ 100 }}px"></my-chat>
  All components has 3 mandatory properties:
  
  host - root element of component
  scope - scope of component
  app - reference to the root component ui.bootstrap(Component)
  
  Thus, in any place, in any terms, we can turn to the 
  root component of the application, 
  and take from there needed value.
</div>


<div #link>
  Create link to element in scope, and we can use it:
  
  <input #myInput>
  {{ myInput.value }}
  
  If applying to component, link will refer to the component instance:
  <popup #myPopup>content</popup>
  <button (click)="myPopup.open()">show popup</button>
  
  In component links are available as as this.scope.myPopup
</div>
```


.classes
===
- .class-name // add class name alias class='class-name'
- .active='expression' // if expression is true then add class, if false then remove class

*directives
===
- *for="item in arr" // iterate element
- *if="exp" // create or remove element with expression

(events)
===
- (click)='handler($event)' // with click call `handler` function ($event is a internal variable)
- (custom-event)='handler($event)'


\<content>
===

if you use content element in you template, then original html content from host element, It will be placed there:

```javascript
class Button {
  static tag = 'button'
  static template = `
    Content: <content></content>
  `
}

class App {
  static components = [Button]
  static template = `
    <button>Ololo</button>
    <button> <span>Trololo</span> </button>
  `
}
```

render to:
```html
<head></head>
<body>
  <ui-button>Content: Ololo</ui-button>
  <ui-button>Content: <span>Trololo</span> </ui-button>
<body>
```


We can use select attribute to filter elements which will be replaced here:
```html
<div .titles>
  <content select="tab > title"></component>
</div>

<div .tabs>
  <content select="tab"></component>
</div>
```


Component methods
===
framework automatically extend  your components classes adding following fields:

```javascript
class Button {
  
  scope // Link to scope
  host // Link to root element
  app // Link to root component or application 
  
  
  on(eventName, handler){
    // Set event handler to host
    // Alias for this.host.on(eventName, handler)  
  }
  
  
  one(eventName, handler){
    // Set event handler to host, 
    // event handler will be removed after the first call
    // Alias for this.host.one(eventName, handler)  
  }
  
  
  off(eventName, handler){
    // Remove event handler to host 
    // Alias for this.host.off(eventName, handler)  
  }
  
  
  own(eventName, handler){
    // Set own event handler to host
    // Alias for this.host.own(eventName, handler)
  }
  
  
  emit(eventName, value){
    // Emit event from host
    // Alias for this.host.emit(eventName, value)
  }
  
  
  watch(exp, handler){
    // Watch expression with this, context,
    // and call handler if expression value is change.
    // Example we can use watch prop of component:
    
    this.watch('prop', value => console.log(value))
    this.prop = 11 
    // instantly call console.log(11),
    // cuz framework use end getters and setters  
    
    this.a = 2
    this.b = 4
    this.watch('a + b', value => console.log(value))
    this.a = 100
    // instantly call console.log(104)
  }
  
  
  bind(path, exp){
    // Alias for:
    this.watch(exp, (value)=> { this[path] = value })
    
    // Example:
    this.a = 100
    this.b = 200
    this.bind('summ', 'a + b')
    this.summ // 300
    this.b++
    this.summ // 301
  }
  
  
  bindClass(className, exp){
    // Alias for:
    this.watch(exp, value => {
    	if(value) this.host.addClass(className)
    	else this.host.removeClass(className)
    })
  }
  
  
  require(tag){
  	// Rreturn parent component by tag.
  	// If not found, then throw error.
  	var tabs = this.require('tabs')
  	tabs // tabs component instance
  	
  	// If we no need throw errors, we must add '?' symbol to the end
  	var form = this.require('form?')
  	form // or form component or null
  }
  
}
```
