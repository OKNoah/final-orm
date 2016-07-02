ORMjs this is javascript OOP interface to Database.
Its use ArangoDB, but later I will add drivers for other databases (such as mongodb).

GitHub https://github.com/uMaxmaxmaximus/ui-js/tree/master/server/core/orm

Conception: Using the ES7 operator `await`, `getters` and `promises`,
we can navigate the graph objects tree.

It recommended for use with the ES7 (async await) For a more beautiful syntax.
BUT you can use and ES5.

I think this is epic =) It is very very very very very elegant API for databases.
What do you think about it? =)

This is part of a large project, but I upload it to npm as a separate module.
May be it will be useful to someone.


It uses ArangoDB https://www.arangodb.com/2015/10/benchmark-postgresql-mongodb-arangodb/



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
Model.find(selector, offset = 0, limit = 100) // find models by selector obj
Model.findOne(selector, offset = 0) // find one model by selector obj
Model.count(selector) // return count models matches of selector
Model.have(selector) // returns true if there is at least one model suitable for selector
```

instance
```javascript
Model.prototype.save() // alias  Model.save(this)
Model.prototype.update() // alias  Model.update(this)
Model.prototype.remove() // alias  Model.remove(this)
Model.prototype.restore() // alias  Model.remove(this)
```

Basics
---

create init class model.js
```javascript
let orm = require('orm')
let Model = orm.connect({options})
export default Model
```
orm.connect() return Model class, and you need export and extend it


Define collection User (class name will be collection name)
```javascript
import Model from './model.js'

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
		status: {$type: String, enum: ['sleep', 'eat']}, // enum
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
	let user = await User.add({
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

}())
```

Example 1:
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
    let friends = await this.friends
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

  let user = await User.add({
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

	let sector = await Sector.add({
		size: 236
	})

	let user = await User.add({
		name: 'Ашот',
		sector: sector
	})

	(await user.sector).size // 236


	let sector2 = await Sector.add({
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

	let user = await User.add({
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




