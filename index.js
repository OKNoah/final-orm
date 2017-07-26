import Model from './models/model'
import Edge from './models/edge'

// TODO сделать нормальный коннекшен и драйвера
export default {
  connect: (options) => ({
    Model: class extends Model { static options = options },
    Edge: class extends Edge { static options = options }
  })
}
