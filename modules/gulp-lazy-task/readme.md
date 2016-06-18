gulp-lazy-task - lazy gulp task loader


1) place your tasks in external files
2) write in gulpfile just paths and configurations
3) you task will be required only when task will be started
4) load gulp plugins in you task just by getter: `this.util` or `this.sourceMaps` no more require.
5) automatic add gulp-plumber in pipe (error no more crash node)

Usage in gulpfile.js
---

```javascript
var task = require('gulp-lazy-task')('./tasks');

task('ololo', {param:11})
````

in file './tasks/' + taskName + '.js'
```javascript
module.exports = function (options, callback) {
  options // {param: 11}
  this.gulp // gulp
  this.util // gulp-util plugin
  this // gulp-load-plugins

  // his read you package.json file and create getters on "this"
  // you no longer need to call require()
  // to load gulp plugin like "gulp-source-maps" just white this.sourceMaps
  // and anjoy =)
}
```

example:
======

in gulpfile.js :
```javascript
var task = require('gulp-lazy-task')('./tasks');

task('babel', {
  src:['./src/**/*.js'],
  dest: './build/'
})
```

---
in './tasks/babel.js' :

```javascript
module.exports = function (options) {
  return this.gulp.src(options.src)
  .pipe(this.babel())
  .pipe(this.gulp.dest(options.dest))
}
```
---
in package.json :
```json
{
  "dependencies": {
    "gulp-babel": "*"
  }
}

```


P.S. to support coffee-script tasks just use or gulpfile.coffee, or in head of gulpfile.js write
`require('coffee-script/register')`

enjoy ;)