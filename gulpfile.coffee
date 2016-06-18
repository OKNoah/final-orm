# загрузчик задач
task = require('./modules/gulp-lazy-task')('./tasks')

task 'default', ['webpack-dev-server']

# сборка фронтенда
task 'webpack-dev-server'
task 'webpack-production'



