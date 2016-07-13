import Text from '../text/text'


export default class Email extends Text {

	static selector = 'email'
	test = /^.+@.+$/im

}



