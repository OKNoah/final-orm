import dotenv from 'dotenv'
import { randomBytes } from 'crypto'
import ormjs from './index'
import moment from 'moment'
import { isEqual, sortBy, isEmpty } from 'lodash'

dotenv.config()

const { NAME } = process.env

const username = `test${randomBytes(8).toString('hex')}`

const db = ormjs.connect({
  database: NAME || 'test'
})

class User extends db.Model {
  static schema = {
    name: { $type: String, index: true, unique: true },
    profile: {
      vegan: { $type: Boolean, optional: true }
    }
  }
}

class Post extends db.Model {
  static schema = {
    body: { $type: String, optional: true },
    creator: { $type: User, optional: false }
  }
}

class Likes extends db.Edge {}

test('initialize ormjs', () => {
  expect(db).toHaveProperty('Edge')
  expect(db).toHaveProperty('Model')
})

test('create new model instance', async () => {
  const newUser = await User.add({ name: username })

  expect(newUser._id).toBeTruthy()
})

test('check name must be unique', async () => {
  try {
    await User.add({ name: username })
  } catch (error) {
    expect(error)
    .not.toHaveProperty('_id')
  }
})

test('create test post', async () => {
  const user = await User.findOne({ where: { name: username } })
  const post = await Post.add({ body: username, creator: user })

  expect(post.body === username).toBeTruthy()
  expect(post.body.length > 4).toBeTruthy()
})

test('create edge collection relationship', async () => {
  const user = await User.findOne({ where: { name: username } })
  const post = await Post.findOne({ where: { body: username } })
  const like = await Likes.add(user, post)

  expect(like._from).toBe(user._id)
})

test('find collections by example', async () => {
  const user = await User.findOne({ where: { name: username } })

  expect(user).toHaveProperty('_key')
})

test('find edge collections by example', async () => {
  const user = await User.findOne({ where: { name: username } })
  const edge = await Likes.findOne({ where: { _from: user._id } })

  expect(edge._from).toBe(user._id)
})

test('find only certain attributes', async () => {
  const user = await User.findOne({
    where: { name: username },
    attributes: ['_id', 'createdAt']
  })

  expect(user.name).toBe(undefined)
  expect(user._id).not.toBe(undefined)
})

test('make sure all documents have createdAt field', async () => {
  const user = await User.findOne({
    where: { name: username }
  })

  expect(user).toHaveProperty('createdAt')
  expect(moment(user.createdAt).isValid()).toBe(true)
})

test('make sure all documents have updatedAt field', async () => {
  const post = await Post.findOne({
    body: username
  })

  post.body = 'Updated!'
  await post.save()

  expect(post).toHaveProperty('updatedAt')
  expect(moment(post.updatedAt).isValid()).toBe(true)
})

test('use aql query', async () => {
  const { aql, _database } = await db.Model

  const cursor = await _database.query(aql`for u in User limit 10 return u`)
  const users = await cursor.all()
  expect(users.length).toBe(10)
})

test('check list is sorted', async () => {
  const posts = await Post.find({
    sort: 'createdAt asc',
    limit: 100
  })

  const sorted = await sortBy(posts, ['createdAt'])

  expect(isEqual(posts, sorted)).toBe(true)
  expect(isEqual(posts, sorted.reverse())).not.toBe(true)
})

test('find with include', async () => {
  const posts = await Post.find({
    include: {
      model: User,
      as: 'creator'
    }
  })

  expect(posts[0]).toHaveProperty('creator')
  expect(posts[0]).toHaveProperty('_key')
  expect(posts[0]).toHaveProperty('body')
})

test('find and count include', async () => {
  const included = await Post.findAndCount({
    include: {
      model: User,
      as: 'creator'
    }
  })

  const { data: posts, meta: { count } } = included

  expect(posts[0]).toHaveProperty('creator')
  expect(posts[0]).toHaveProperty('_key')
  expect(posts[0]).toHaveProperty('body')
  expect(typeof count === 'number').toBeTruthy()
})

// test('remove item', async () => {
//   const userToRemove = await User.findOne({
//     where: { name: username }
//   })
//   await userToRemove.remove()
//   const user = await User.findOne({
//     where: { name: username }
//   })

//   expect(user).toBe(null)
// })

test('do not allow injection', async () => {
  const users = await User.find({
    where: { name: `123" || user._id == 'User/4627980' || user.name == "hi` },
    limit: 100
  })

  expect(isEmpty(users)).toBe(true)
  // expect(statuses.includes(true) !== true).toBe(true)
})

test('find by include where', async () => {
  const post = await Post.findOne({
    include: {
      as: 'creator',
      where: {name: username}
    }
  })

  expect(post.creator.name).toBe(username)
})

test('complex query', async () => {
  const posts = await Post.findAndCount({
    limit: 5,
    skip: 0,
    sort: 'createdAt DESC',
    attributes: ['creator', 'createdAt'],
    include: {
      as: 'creator',
      where: {name: username}
    }
  })

  expect(posts.data[0].creator.name).toBe(username)
})
