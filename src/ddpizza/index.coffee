ui = require('ui-js')

# add base components
ui.component require('./component/checkbox/checkbox')
ui.component require('./component/textarea/textarea')
ui.component require('./component/button/button')
ui.component require('./component/select/select')
ui.component require('./component/text/text')
ui.component require('./component/email/email')
ui.component require('./component/phone/phone')
ui.component require('./component/popup/popup')
ui.component require('./component/modal/modal')
ui.component require('./component/tabs/tabs')
ui.component require('./component/pass/pass')
ui.component require('./component/file/file')
ui.component require('./component/form/form')



# start app
App = require('./app/app')
ui.bootstrap(App)

