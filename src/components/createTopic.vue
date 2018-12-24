<template>
 <div>
   <v-head :searchShow="searchShow"></v-head>
   <div class="middle">
     <div class="topic_left">
       <div class="topic_header">
         <span class="span" @click="routeIndex">主页</span>
         <span>/</span>
         <span>发布话题</span>
       </div>
       <div class="topic_content">
         <el-form ref="form" label-width="80px">
           <el-form-item label="选择版块" style="padding-left: 10px;padding-top: 10px">
             <el-select v-model="formData.type" placeholder="请选择版块">
               <el-option
                 v-for="item in options"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value"
               >
               </el-option>
             </el-select>
           </el-form-item>
         </el-form>
         <input v-model="formData.title" autocomplete="off" placeholder="标题字数10字以上" maxlength="25" class="title">
         <mavon-editor v-model="formData.text" :toolbars="toolbars"  :ishljs = "true"/>
         <div  class="topic-footer">
           <el-button type="primary" @click="submit">提 交</el-button>
         </div>
       </div>
     </div>
     <div class="topic_right">
       <div class="panel">
         <div class="header">
           <span class="col_fade">Markdown 语法参考</span>
         </div>
         <div class="inner">
           <ol>
             <li><tt>### 单行的标题</tt></li>
             <li><tt>**粗体**</tt></li>
             <li><tt>`console.log('行内代码')`</tt></li>
             <li><tt>```js\n code \n```</tt> 标记代码块</li>
             <li><tt>[内容](链接)</tt></li>
             <li><tt>![文字说明](图片链接)</tt></li>
           </ol>
           <span><a href="http://www.ituring.com.cn/article/775" target="_blank">Markdown 文档</a></span>
         </div>
       </div>
       <div class="panel">
         <div class="header">
           <span class="col_fade">话题发布指南</span>
         </div>
         <div class="inner">
           <ol>
             <li>尽量把话题要点浓缩到标题里</li>
             <li>代码含义和报错可在 <a href="http://segmentfault.com/t/node.js" target="_blank">SegmentFault</a> 提问</li>
             <li>给话题选择合适的标签能增加浏览</li>
           </ol>
         </div>
       </div>
     </div>
   </div>
 </div>
</template>

<script>
import vHead from './header.vue'
export default {
  name: 'create_topic',
  components: {
    vHead
  },
  data () {
    return {
      userInfo: {},
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        fullscreen: true, // 全屏编辑
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true// 预览
      },
      formData: {},
      options: [],
      searchShow: false
    }
  },
  created: function () {
    if (localStorage.getItem('userInfo') != null) {
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
      this.formData.user_id = this.userInfo['_id']
    } else {
      this.$router.push('/index')
    }
    this.$axios.get('/hzx/v1/dictionary/' + '10').then((response) => {
      response.message.forEach((currentValue, index) => {
        this.options.push({
          label: currentValue['name'],
          value: currentValue['_id']
        })
      })
    })
  },
  methods: {
    routeIndex () {
      this.$router.push('/index')
    },
    submit () {
      if (this.formData.type === '' || this.formData.type === undefined) {
        this.$message.error('请选择版块')
        return
      }
      if (this.formData.title === '' || this.formData.type === undefined || this.formData.title.length < 10) {
        this.$message.error('请最少输入超过10个字的标题')
        return
      }
      if (this.formData.text === '' || this.formData.text === undefined) {
        this.$message.error('请编辑内容')
        return
      }
      this.$axios.post('/hzx/v1/topic/add', this.formData).then((response) => {
        if (response.code === 100) {
          this.$router.push('/index')
        } else {
          this.$message.error('服务器异常')
        }
      })
    }
  }
}
</script>

<style scoped>
  .topic_left {
    width: 890px;
    float: left;
    margin-right: 10px;
  }

  .topic_header {
    width: 100%;
    height: 40px;
    background-color: #f6f6f6;
    border-radius: 3px 3px 0 0;
    line-height: 40px;
    color: #999;
  }

  .topic_header > .span {
    margin-left: 10px;
    color: #369219;
    cursor: pointer;
  }

  .topic_right {
    width: 290px;
    float: right;
  }

  .panel {
    font-size: 13px;
    margin-bottom: 13px;
  }

  .panel .header {
    color: #51585c;
    border-radius: 3px 3px 0 0;
    background-color: #f6f6f6;
    height: 40px;
    line-height: 40px;
  }

  .header .col_fade {
    color: #1c6132;
    margin-left: 10px;
  }

  .panel .inner {
    line-height: 2em;
    padding: 10px;
    background: #fff;
    border-radius: 0 0 3px 3px;
  }

  .panel .inner a {
    color: #778087;
  }
  .topic_content {
    background-color: #ffffff;
  }
  .topic_content .title {
    width: 855px;
    height: 30px;
    padding-left: 15px;
    margin-bottom: 15px;
    border: 1px solid #e5e5e5;
    margin-left: 10px;
    border-radius: 4px;
  }
  .v-note-wrapper{
    margin: 10px;
    min-height: 480px;
  }
  .topic-footer{
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
  }
</style>
