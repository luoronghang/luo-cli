/*
* 交互提示
*/
module.exports = [
  {
    type: 'input',
    message: '请输入项目名称:',
    name: 'name',
    default: "luo_project_init" // 默认值
  },
  {
    type: 'list',
    message: '请选择项目类型:',
    name: 'type',
    choices:[
      'vue2',
      'vue3',
      'react',
      'nodejs'
    ]
  }
]