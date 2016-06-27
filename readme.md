Frontend MVVM framework like Angular 2, but better =)
---

Use Webpack to build application


Basic example:
---

index.js:
```javascript
let ui = require('ui-js')
let App = require('./app.js')

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
---

```javascript
// webpack loader as css text
let style = require('./button.css')


export default class Button {

  // this is custom html element name
  static selector = 'button'

  // this is shadow styles (isolated, even * selector)
  static styles = [style]

  // components to be used in a template
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
var Button = require('./button.js')

export default class App {

  // button component weel be used in template
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
---

Add button to global component (used in all component templates)
Replace all `button` tags in application to Button component.
```javascript
var Button = require('./button.js')
ui.component(Button)
```


Template features
---

```javascript
class Chat {

  static selector = 'chat'
  static template = `
    <ul .messages>
      <li .message *for='message, index in messages'>

        {{message.text}} {{index}}

        <button (click)='removeMessage(message)'>
          remove
        </button>

      </li>
    </ul>
  `

  constructor(){
    this.messages = [
     {text:'ololo'},
     {text:'trololo'}
    ]
  }

  removeMessage(message){
    let index = this.messages.indexOf(message)
    if(index !== -1) {
    	this.messages.splice(index, 1)
    }
  }

}
```


.classes
===
- .class-name // add class name alias class='class-name'
- .active='expression' // if expression is true then add class, if false then remove class

*directives
===
- *for="item, index in arr" // iterate element
- *for="10" // iterate element 10 times
- *if="exp" // create or remove element with expression

(events)
===
- (click)='handler($event)' // with click call `handler` function ($event is a internal variable)
- (custom-event)='handler($event)'

```javascript
class Component {

  constructor(){
    setTimeout(()=>
      // this emit 'custom-event' event and call handler function
      this.emit('custom-event', 22)
    , 1000)
  }

  handler(event){
  	alert(event) // 22
  }

}
```

#links
===
- \#linkName (add link for element or component to scope)

```javascript
class Comopnent {

  static template = `
    <input #myInput>
    {{myInput.value}}
  `

  constructor(){
    this.locals.myInput // link to input element
  }
}
```

Two Way Data Binding
===
- \<div [prop]='exp' >\</div>

```javascript
class Componenr {

  // this is bind "div.style.width" to "this.width"
  // if you change one path, secont path change automatically and instantly
  // system use getters and setters. no need scope.$digest() no more =)

  static template = `
    <div [style.width]='width'></div>
  `

  constructor(){
  	this.width = 200
  }

}
```

if exp has tag {{ }}, then exp is interpreted as a string

- `<div [prop]="100">` // prop will be number 100
- `<div [prop]="{{100}}px">` // prop will be string "100px"

