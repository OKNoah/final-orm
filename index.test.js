import dotenv from 'dotenv'
import { randomBytes } from 'crypto'
import ormjs from './index'
import moment from 'moment'
import { isEqual, sortBy } from 'lodash'

dotenv.config()

const { NAME } = process.env

const username = `test${randomBytes(8).toString('hex')}`

const db = ormjs.connect({
  database: NAME || 'test'
})

class User extends db.Model {
  static schema = {
    name: String,
    profile: {
      vegan: { $type: Boolean, optional: true }
    }
  }
}

class Post extends db.Model {
  static schema = {
    body: String,
    creator: User
  }
}

class Likes extends db.Edge {}

test('initialize ormjs', () => {
  expect(db).toHaveProperty('Edge')
  expect(db).toHaveProperty('Model')
})

test('create new model instance', async () => {
  expect(await User.add({ name: username }))
  .toHaveProperty('_id')
})

test('create test post', async () => {
  const user = await User.findOne({ where: { name: username } })

  expect(await Post.add({ body: username, creator: user }))
  .toHaveProperty('_id')
})

test('create edge collection relationship', async () => {
  const user = await User.findOne({ where: { name: username } })
  const post = await Post.findOne({ where: {body: username } })
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
    sort: 'post.createdAt asc',
    limit: 100
  })

  const sorted = await sortBy(posts, ['createdAt'])

  expect(isEqual(posts, sorted)).toBe(true)
})

test('remove item', async () => {
  const userToRemove = await User.findOne({
    where: { name: username }
  })
  await userToRemove.remove()
  const user = await User.findOne({
    where: { name: username }
  })

  expect(user).toBe(null)
})
