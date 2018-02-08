# Final ORM

> Please check out https://github.com/oknoah/final and https://github.com/oknoah/final/packages/arangolize for similar projects that MAY be more up to date

Is a javascript OOP interface for ArangoDB

Based off of part of the ui-js code found here: https://github.com/uMaxmaxmaximus/ui-js/tree/master/server/core/orm

Conception: Using the ES7 operator `await`, `getters` and `promises`, we can navigate the graph objects tree.

It recommended for use with the ES7 (async await) For a more beautiful syntax. BUT you can use ES5.

Never heard of ArangoDB? Check out these benchmarks: https://www.arangodb.com/2015/10/benchmark-postgresql-mongodb-arangodb/

Please see `./index.test.js` for most up-to-date examples.

API
---

static:
```javascript
Model.get(_id) // get model by id
Model.add(obj) // add model by description obj
Model.remove(model) // remove model
Model.restore(model) // restore removed model
Model.save(model) // save modified model to db
Model.update(model) // update modified model from db
Model.find({ where: { key: value }, skip: 0, limit: 10 }) // find models by where obj
Model.findAndCount({ where: { key: value }, skip: 0, limit: 10 }) // find models by where obj and return as { data: [data], meta: { count: 123 } }
Model.findOne({ where: { key: value } }) // find one model by selector obj
Model.count(selector) // return count models matches of selector
Model.have(selector) // returns true if there is at least one model suitable for selector
```

instance:
```javascript
Model.prototype.save() // alias  Model.save(this)
Model.prototype.update() // alias  Model.update(this)
Model.prototype.remove() // alias  Model.remove(this)
Model.prototype.restore() // alias  Model.remove(this)
```

Basic usage:
---

create init class model.js
```javascript
var orm = require('final-orm')
var options = {
  database: 'test', // db name
  // You can initialize the database using a url.
  url: 'http://root:@localhost:8529',
  // Or supply each of these values. You do not need both.
  host: 'localhost',
  port: '8529',
  username: 'root',
  password: ''
}

var { Model, Edge } = orm.connect(options)

export default Model

export { Model, Edge }
```

`orm.connect()` returns `Model` and `Edge` classes, and you need export and extend it


Define collection User (class name will be collection name), and edge collection "Like"

```javascript
import { Model, Edge } from './model.js'

class User extends Model {
  static schema = {
    // basic types
    name: String,
    male: Boolean,
    age: Number,
    birth: Date,
    tags: Set, // like array but items are unique

    // structures
    messages: [String], // array of types
    prop1: {prop2: [{tags: [String]}] }, // sub schemas

    // relations with other (or self) db collections
    bestFriend: User, // link to model
    friends: [User], // link to array models

    // field options
    name: String,
    name: {$type: String},
    name: {$type: String, test: /^\w+$/},
    status: {
      $type: String,
      enum: ['sleep', 'eat'], // enum
      optional: true // allows null value
    }
  }
}

class Like extends Edge {
  static schema = {
    date: Date
  }
}
```


Example 0:
---


```javascript
import Model from './model.js'


class User extends Model {

  static schema = {
    name: String,
    age: Number,
  }

}
```

Usage:

```javascript
(async function () {

  // adding user to db
  var user = await User.add({
    name: 'Ашот',
    age: 24,
    })

  user._id // 'User/434370324723'
  user._removed // false
  user.name // 'Ашот'
  user.age // 24

  // change field
  user.name = 'Ololo'
  console.log(user.name) // 'Ololo' field is changed

  // reset changes
  await user.update() // load state from db
  user.name // 'Ашот'

  // saving changes
  user.name = 'Ololo' // change field
  await user.save() // save changes to db
  await user.update() // load state from db
  user.name // 'Ololo' because we save

  // like via edge collection
  const rose = await User.findOne({ where: { name: 'Rose' } })
  // in edge collections, the usage is Edge.add(from, to, data)
  Like.add(rose, user, { date: new Date() })

}())
```

Example 1: Instance methods
---

```javascript
import Model from './model.js'


class User extends Model {
  static schema = {
    name: String,
    age: Number,
    friends: [User]
  }

  async addFriend(user) {
    var friends = await this.friends
    friends.push(user)
    await this.save()
  }

  async removeAllFriends(){
    this.friends = []
    await this.save()
  }

}
```
Usage:

```javascript
(async function(){

  var user = await User.add({
    name: 'Ivan',
    age: 24,
    friends: []
  })

  await user.addFriend(user)
  await user.addFriend(user)
  await user.friends // [user, user]  two itself =)

  await user.removeAllFriends()
  await user.friends // []

  await user.friends === await user.friends // true

  user.name = 22
  await user.save() // ValidationError: Field `name` must be String, but have Number

  await user.removeAllFriends() // since this method uses this.update, you must do user.save() first

})()
```


Example 2:
---
```javascript
import Model from './model.js'


class Sector extends Model {

  static schema = {
    size: Number
  }

}


class User extends Model {

  static schema = {
    name: String,
    sector: Sector,
  }

}

```

Usage:

```javascript
(async function () {

  var sector = await Sector.add({
    size: 236
  })

  var user = await User.add({
    name: 'Ашот',
    sector: sector
  })

  (await user.sector).size // 236


  var sector2 = await Sector.add({
    size: 1004
  })
  user.sector = sector2
  await user.save()

  (await user.sector).size // 1004 because this another sector ^__^


})()
```

Custom types:
---
System types is: String, Number, Boolean, Data, Set
Actually we can use custom types:

```javascript
import Model from './model.js'


class Color {

  constructor(r, g, b) {
    this.r = r
    this.g = g
    this.b = b
  }


  // convert to db document
  toJSON() {
    return {
      r: this.r,
      g: this.g,
      b: this.b
    }
  }


  // restore from db document
  static fromJSON(json) {
    return new Color(json.r, json.g, json.b)
  }

}


class User extends Model {

  static schema = {
    name: String,
    color: Color
  }

}
```

Usage:

```javascript
(async function () {

  var user = await User.add({
    name: 'Ашот',
    color: new Color(0, 255, 0)
  })

  user.color instanceof Color //true

}())
```

Schemas
---

Number
```javascript
schema = {
  age: Number,
  age: {$type: Number},
  age: {$type: Number, min:0, max:100}
}
```

=======
String
```javascript
schema = {
  name: String,
  name: {$type: String},
  name: {$type: String, min:3, max:20, test:/^\w+$/}
}
```

=======
Set
```javascript
schema = {
  tags: Set,
  tags: {$type: Set},
  tags: {$type: Set, set: ['animals', 'porn', 'movie']}
}
```




