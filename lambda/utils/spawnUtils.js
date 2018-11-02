'use strict'
const {spawn} = require('child_process')
process.env['PATH']=`${process.env['PATH']}:${process.env['LAMBDA_TASK_ROOT']}`
const genericSpawn=(binaryName, options, callback)=>{
  const binSubPath=`functions/target/x86_64-unknown-linux-musl/release/${binaryName}`
  const binaryPath=process.env['LAMBDA_TASK_ROOT']?
    `${process.cwd()}/${binSubPath}`:
    `./${binSubPath}`
  const model=spawn(binaryPath,options)
  let modelOutput=''
  let modelErr=''
  model.stdout.on('data', data=>{
    modelOutput+=data
  })
  model.stderr.on('data', data=>{
    modelErr+=data
  })
  model.on('close', code=>{
    if(modelErr){
      return callback(modelErr, null)
    }
    return callback(null, modelOutput)
  })
}
module.exports.genericSpawn=genericSpawn