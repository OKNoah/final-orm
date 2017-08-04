import dotenv from 'dotenv'
import { randomBytes } from 'crypto'
import ormjs from './index'
import moment from 'moment'

dotenv.config()

const { NAME } = process.env

const username = `test${randomBytes(8).toString('hex')}`

const db = ormjs.connect({
  database: NAME || 'test'
})

class User extends db.Model {
  static schema = {
    name: String,
    created: String,
    friends: { $type: [String], optional: true }
  }
}

class Post extends db.Model {
  static schema = {
    body: String
  }
}

class Likes extends db.Edge {}

test('initialize ormjs', () => {
  expect(db).toHaveProperty('Edge')
  expect(db).toHaveProperty('Model')
})

test('create new model instance', async () => {
  expect(await User.add({ name: username, created: Date() }))
  .toHaveProperty('_id')
})

test('create test post', async () => {
  expect(await Post.add({ body: username }))
  .toHaveProperty('_id')
})

test('create edge collection relationship', async () => {
  const user = await User.findOne({ name: username })
  const post = await Post.findOne({ body: username })
  const like = await Likes.add(user, post)

  expect(like._from).toBe(user._id)
})

test('find collections by example', async () => {
  const user = await User.findOne({ where: { name: username } })

  expect(user).toHaveProperty('_key')
})

test('find edge collections by example', async () => {
  const user = await User.findOne({ where: { name: username } })
  console.log('user', user)
  const edge = await Likes.findOne({ where: { _from: user._id } })

  expect(edge).toHaveProperty('_from')
})

test('find only certain attributes', async () => {
  const user = await User.findOne({
    where: { name: username },
    attributes: ['_id', 'createdAt']
  })

  expect(user.name).toBe(undefined)
})

test('make sure all documents have createdAt field', async () => {
  const user = await User.findOne({
    where: { name: username }
  })

  expect(user).toHaveProperty('createdAt')
  expect(moment(user.createdAt).isValid()).toBe(true)
})

test('make sure all documents have updateddAt field', async () => {
  const post = await Post.findOne({
    body: username
  })

  post.body = 'Updated!'

  expect(post).toHaveProperty('updatedAt')
  expect(moment(post.updatedAt).isValid()).toBe(true)
})

test('use aql query', async () => {
  const { aql, _database } = await db.Model

  const cursor = await _database.query(aql`for u in User limit 10 return u`)
  const users = await cursor.all()
  expect(users.length).toBe(10)
})
