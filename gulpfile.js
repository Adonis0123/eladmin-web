/*
 * @Author: Hzh
 * @Date: 2020-07-03 17:57:36
 * @LastEditTime: 2020-10-27 18:31:30
 * @LastEditors: Hzh
 * @Description:
 */
const gulp = require('gulp')
const GulpSSH = require('gulp-ssh')

// 需要上传到服务器的路径
const remotePath = '/usr/local/ui-workspace/udisp-web/'
const config = {
  ssh: {
    host: '192.168.13.157', // 157
    port: 22,
    username: 'root',
    password: 'AAAaaa111'
  },
  remotePath,
  commands: [
    // 删除现有文件
    `rm -rf ${remotePath}`
  ]
}
const gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: config.ssh
})

/**
 * 上传前先删除服务器上现有文件...
 */
gulp.task('execSSH', () => {
  console.log('删除服务器上现有文件...')
  return gulpSSH.shell(config.commands, { filePath: 'commands.log' })
    .pipe(gulp.dest('logs'))
})

/**
 * 上传文件到服务器
 */
gulp.task('upload', () => {
  console.log('开始上传文件到服务器...')
  return gulp.src('./dist/**')
    .pipe(gulpSSH.dest(config.remotePath))
})

/**
 * 上传完成
 */
gulp.task('default', gulp.series('execSSH', 'upload', done => {
  console.log('上传完成，真香')
  done()
}))
