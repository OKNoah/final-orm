import "babel-polyfill"
import ui from 'ui-js'

import Pagination from './component/pagination/pagination'
import Checkbox from './component/checkbox/checkbox'
import Textarea from './component/textarea/textarea'
import Select from './component/select/select'
import Option from './component/select/option'
import Button from './component/button/button'
import Submit from './component/submit/submit'
import Email from './component/email/email'
import Phone from './component/phone/phone'
import Popup from './component/popup/popup'
import Modal from './component/modal/modal'
import Text from './component/text/text'
import Tabs from './component/tabs/tabs'
import Tab from './component/tabs/tab'
import TabTray from './component/tabs/tab-tray'
import TabTitle from './component/tabs/tab-title'
import Pass from './component/pass/pass'
import File from './component/file/file'
import Form from './component/form/form'
import Notificator from './component/notificator/notificator'
import Gallery from './component/gallery/gallery'
import Confirm from './component/confirm/confirm'

ui.component(Pagination)
ui.component(Checkbox)
ui.component(Textarea)
ui.component(Select)
ui.component(Option)
ui.component(Button)
ui.component(Submit)
ui.component(Email)
ui.component(Phone)
ui.component(Popup)
ui.component(Modal)
ui.component(Text)
ui.component(Tabs)
ui.component(Tab)
ui.component(TabTray)
ui.component(TabTitle)
ui.component(Pass)
ui.component(File)
ui.component(Form)
ui.component(Notificator)
ui.component(Gallery)
ui.component(Confirm)


import UserApi from './api/user-api'
import SectorApi from './api/sector-api'

ui.global('UserApi', UserApi)
ui.global('SectorApi', SectorApi)


// start app
import App from './app/app'
ui.bootstrap(App)

