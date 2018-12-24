<template>
    <div>
      <v-head :searchShow="searchShow"></v-head>
      <div class="middle">
        <div class="topicInfoHeader">
          <div class="topicInfoHeaderLeft">
              <div v-text="topicInfo.title" class="topicInfoTitle"></div>
             <div class="topicInfoAuthor">
               <span>
                 <span class="ball"></span>
                 <span>发布于</span>
                 <span v-text="timeDifference(topicInfo.upload_time)"></span>
               </span>
               <span>
                 <span class="ball"></span>
                 <span>作者</span>
                  <span v-if="topicInfo.user_id">
                     <span v-text="topicInfo.user_id.userName"></span>
                  </span>
               </span>
               <span>
                  <span class="ball"></span>
                 <span v-text="topicInfo.browse"></span>
                 <span>次浏览</span>
               </span>
               <span>
                  <span class="ball"></span>
                 <span>来自</span>
                 <span v-if="topicInfo.type">
                     <span v-text="topicInfo.type.name"></span>
                  </span>
                 <span>版块</span>
               </span>
             </div>
          </div>
          <div class="topicInfoHeaderRight" v-if="userInfo.accountNumer">
             加入收藏
          </div>
        </div>
        <div class="topicInfoContent">
            <div v-highlight v-html="content"></div>
        </div>
        <div class="topicReply" v-if="topicReply.length > 0">
          <div class="topicReplyHeader">
            <span v-text="topicReply.length" class="topicReplyNum"></span>
            <span>回复</span>
          </div>
          <div class="topicReplyContent" v-for="(item , index) in topicReply" :key="item._id">
            <el-row style="min-height: 70px">
              <el-col :span="1">
                <div class="topicReplyContentLeft">
                  <img :src="item.comment_user.user_img" alt="头像" :onerror="defaultImg">
                </div>
              </el-col>
              <el-col :span="23">
                <el-row class="topicReplyContentRight">
                  <el-col :span="23">
                    <span>
                      <span v-text="item.comment_user.userName"></span>
                    </span>
                    <span style="color: #0085d0">
                      <span v-text="(index+1)+'楼'"></span>
                      <span class="ball"></span>
                      <span v-text="timeDifference(item.create_time)"></span>
                    </span>
                  </el-col>
                  <el-col :span="1" v-if="userInfo.accountNumer">
                    <i class="iconfont icon-huifu" @click="replay_comment(item,index)"></i>
                  </el-col>
                </el-row>
                <el-row class="topicReplyContentRight">
                  <div v-if="item.reply_user">
                    <span style="color: #0085d0;float: left;margin-right: 10px">
                      <span>@</span><span v-text="item.reply_user.userName"></span>
                    </span>
                    <span v-highlight v-html="marked(item.content)"  style="float: left"></span>
                  </div>
                  <div v-else>
                    <span v-highlight v-html="marked(item.content)"  style="float: left"></span>
                  </div>
                </el-row>
              </el-col>
            </el-row>
            <div class="editorContent" v-show="item.isShow">
              <mavon-editor v-model="editorContentTwo" :toolbars="toolbars"  :ishljs = "true"/>
              <div  class="reply-footer">
                <el-button type="primary" @click="commentSubmit(true)">回 复</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="editorContent" v-if="userInfo.accountNumer">
          <mavon-editor v-model="editorContent" :toolbars="toolbars"  :ishljs = "true"/>
          <div  class="reply-footer">
            <el-button type="primary" @click="commentSubmit(false)">回 复</el-button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import vHead from './header.vue'
import marked from 'marked'
import 'highlight.js/styles/default.css'
export default {
  name: 'info',
  components: {
    vHead
  },
  data () {
    return {
      topicId: '',
      searchShow: false,
      topicInfo: {},
      userInfo: {},
      content: '',
      topicReply: [],
      defaultImg: 'this.src="' + require('../assets/img/touxiang.png') + '"',
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
      editorContent: '',
      editorContentTwo: '',
      reply_user: {}
    }
  },
  created: function () {
    if (sessionStorage.getItem('topicId')) {
      this.topicId = sessionStorage.getItem('topicId')
    } else {
      this.$router.push('/index')
    }
    if (localStorage.getItem('userInfo') != null) {
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    }
    if (this.topicId !== '') {
      Promise.all([
        this.$axios.get('/hzx/v1/topic/' + this.topicId),
        this.$axios.get('/hzx/v1/comment/' + this.topicId)
      ]).then(res => {
        this.topicInfo = res[0]
        this.content = marked(res[0].text)
        res[1].forEach((item) => {
          item.isShow = false
        })
        this.topicReply = res[1]
      })
    }
  },
  methods: {
    marked (val) {
      return marked(val)
    },
    commentSubmit (flag) {
      let obj
      if (flag) {
        if (this.editorContentTwo === '' || this.editorContentTwo === undefined) {
          this.$message.error('请编辑回复内容')
          return
        }
        if (this.reply_user === '' || this.reply_user === undefined) {
          this.$message.error('被回复人不存在')
          return
        }
        obj = {
          content: this.editorContentTwo,
          comment_user: this.userInfo,
          topic_id: this.topicId,
          reply_user: this.reply_user
        }
      } else {
        if (this.editorContent === '' || this.editorContent === undefined) {
          this.$message.error('请编辑回复内容')
          return
        }
        obj = {
          content: this.editorContent,
          comment_user: this.userInfo,
          topic_id: this.topicId
        }
      }
      this.$axios.post('/hzx/v1/comment/add', obj).then((res) => {
        this.topicReply.push(res)
        this.topicReply.forEach((item) => {
          item.isShow = false
        })
        this.editorContent = ''
        this.editorContentTwo = ''
      })
    },
    replay_comment (item, index) {
      const isShow = this.topicReply[index].isShow
      this.topicReply.forEach((item) => {
        item.isShow = false
      })
      this.topicReply[index].isShow = !isShow
      this.reply_user = item.comment_user
      this.editorContentTwo = ''
    }
  },
  beforeDestroy: function () {
    sessionStorage.removeItem('topicId')
  }
}
</script>

<style scoped>
.topicInfoHeader{
  width: 100%;
  min-height: 82px;
  background: #fff;
  overflow: hidden;
}
.topicInfoHeaderLeft{
  width: 900px;
  float: left;
  margin: 10px 0px 10px 10px;
}
.topicInfoTitle{
 font-size: 22px;
  line-height: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}
.topicInfoAuthor{
    color: #838383;
  font-size: 12px;
}
.ball{
  display: inline-block;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #838383;
  vertical-align: middle;
  margin-top: -1.5px;
}
  .topicInfoHeaderRight{
    width: 84px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    color: #fff;
    background-color: #369219;
    border-radius: 4px;
    float: right;
    margin-right: 20px;
    margin-top: 10px;
    cursor: pointer;
  }
  .topicInfoContent{
    background: #fff;
    border-top: 1px solid #e5e5e5;
    padding-bottom: 40px;
  }
  .topicInfoContent > div{
    margin: 10px;
  }
  .topicReply{
    width: 100%;
    background: #fff;
    min-height: 100px;
    margin-top: 10px;
  }
.topicReplyHeader{
  width: 100%;
  height: 40px;
  line-height: 40px;
  background-color: #f6f6f6;
  color: #1c6132;
}
.topicReplyNum{
    margin-left: 10px;
  }
  .topicReplyContentLeft > img{
    width: 30px;
    height: 30px;
    margin-left: 10px;
  }
  .el-row{
    margin-top: 15px;
    border-bottom: 1px solid #e5e5e5;
  }
.el-row:last-child {
   padding-bottom: 10px;
 }
  .topicReplyContentRight{
    margin-top: 0px;
    border: none;
  }
.topicReplyContentRight:last-child{
  padding-bottom: 10px;
}
  .icon-huifu{
    color: #999;
    cursor: pointer;
  }
  .editorContent{
    margin-top: 10px;
  }
  .reply-footer{
    margin-top: 10px;
  }
</style>
