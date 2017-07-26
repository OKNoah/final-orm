import dotenv from 'dotenv'
import { randomBytes } from 'crypto'
import ormjs from './index'

dotenv.config()

const { NAME } = process.env

const username = `test${randomBytes(8).toString('hex')}`

const db = ormjs.connect({
  database: NAME || 'test'
})

class User extends db.Model {
  static schema = {
    name: String,
    created: String
  }
}

class Post extends db.Model {
  static schema = {
    body: String
  }
}

class Likes extends db.Edge {
  static schema = {
    date: String
  }
}

test('initialize ormjs', () => {
  expect(db).toHaveProperty('Edge')
  expect(db).toHaveProperty('Model')
})

test('create new model instance', async () => {
  expect(await User.add({ name: username, created: Date() }))
  .toHaveProperty('_id')
})

test('create test post', async () => {
  expect(await Post.add({ body: 'This is a test post' }))
  .toHaveProperty('_id')
})

test('create edge collection relationship', async () => {
  const user = await User.findOne({ name: username })
  const post = await Post.findOne({ body: 'This is a test post' })

  expect(await Likes.add(user, post, { date: Date() }))
  .toHaveProperty('_from')
})
