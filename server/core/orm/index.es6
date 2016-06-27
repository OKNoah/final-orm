import Model from './model'


// TODO сделать нормальный коннекшен и драйвера
export default {

	connect(options){
		return class extends Model {
			static options = options
		}
	}

}