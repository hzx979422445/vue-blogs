<template>
  <div>
    <v-head :name="title" :searchShow="searchShow" @search="searchTitle"></v-head>
    <div class="middle">
      <div class="topic_header">
        <div v-for="(item, index) in dictionarys" class='tab' @click="choiceTab(item,index)" :key="item.label"
             v-text="item.label" :class="{'choiceTab':index === tabIndex}">

        </div>
      </div>
      <div class="topic_wraper" v-if="this.total > 0">
        <div class="topic_wraper_list" v-for="(item, index) in topics" :key="item['_id']" @click="toTopicInfo(item['_id'])">
          <div class="topic_list_img">
            <img :src="item.user_id.user_img" alt="头像" :onerror="defaultImg">
          </div>
          <div class="topic_list_comment">
            <span v-text="item.comments.length" style="color: #9e78c0"></span>
            <span>/</span>
            <span v-text="item.browse"></span>
          </div>
          <div class="topic_list_tab" v-text="item.type.name" :class="{'choice_topic_list_tab':index === 0}"></div>
          <div class="topic_list_titile" v-text="item.title" ></div>
         <div class="topic_list_time" v-if="item.comments.length > 0">
           <img :src="item.comments[item.comments.length - 1].comment.comment_user.user_img" alt="头像" title="最新评论人" :onerror="defaultImg" style="width: 30px;height: 30px;float: left;margin-top: 10px">
           <div  v-text="timeDifference(item.comments[item.comments.length - 1].comment.create_time)" style="margin-left: 10px;float: left"></div>
         </div>
          <div class="topic_list_time" v-else>
            <div  v-text="timeDifference(item.upload_time)"></div>
          </div>
        </div>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total" v-if="this.total > 0">
        </el-pagination>
      </div>
      <div class="topic_wraper_noData" v-else>
        暂无数据
      </div>
    </div>
    <!-- <div v-highlight v-for="tab in content" v-html="tab"></div>-->
  </div>
</template>

<script>
import vHead from './header.vue'
export default {
  name: 'index',
  components: {
    vHead
  },
  data () {
    return {
      dictionarys: [
        {
          label: '全部',
          value: ''
        }
      ],
      form: {breakTime: ['00:00', '01:00']},
      tabIndex: 0,
      tabType: '',
      currentPage: 1,
      total: 0,
      pageSize: 10,
      topics: [],
      title: '',
      defaultImg: 'this.src="' + require('../assets/img/touxiang.png') + '"',
      topicId: '',
      searchShow: true
    }
  },
  created: function () {
    if (localStorage.getItem('userInfo') != null) {
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    }
    if(sessionStorage.getItem('curPage') != null){
      this.currentPage = Number(sessionStorage.getItem('curPage'))
    }
    this.$axios.get('/hzx/v1/dictionary/' + '10').then((response) => {
      response.message.forEach((currentValue, index) => {
        this.dictionarys.push({
          label: currentValue['name'],
          value: currentValue['_id']
        })
      })
    })
    this.pageList()
  },
  methods: {
    choiceTab (item, index) {
      this.tabIndex = index
      this.tabType = item.value
      this.currentPage = 1
      this.title = ''
      this.pageList()
    },
    searchTitle (val) {
      this.title = val
      this.pageList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.pageList()
    },
    pageList () {
      this.$axios.post('/hzx/v1/topic/', {type: this.tabType, title: this.title}, {
        'Page-Number': this.currentPage,
        'Page-Size': this.pageSize,
        'OrderBy': 'id',
        'Dir': 'desc'
      }).then((response) => {
        this.total = response.total
        this.topics = response.data
      })
    },
    toTopicInfo (id) {
      this.topicId = id
      sessionStorage.setItem('topicId', this.topicId)
      this.$router.push('/topicInfo')
    }
  }
}
</script>

<style scoped>
  .topic_header {
    width: 100%;
    height: 40px;
    background-color: #f6f6f6;
    border-radius: 3px 3px 0 0;
    line-height: 40px;
    color: #999;
  }

  .topic_header > .tab {
    float: left;
    color: #369219;
    margin: 12px 10px 0px 10px;
    height: 16px;
    line-height: 16px;
    cursor: pointer;
  }

  .topic_header > .choiceTab {
    background-color: #369219;
    color: #fff;
    padding: 3px 4px;
    margin-top: 9px;
    border-radius: 4px;
  }

  .topic_wraper {
    background: #fff;
    padding-bottom: 10px;
  }
  .topic_wraper_noData{
    background-color: #fff;
    min-height: 500px;
    line-height: 500px;
    text-align: center;
  }
  .topic_wraper_list {
    height: 50px;
    margin: 0px 10px;
    border-bottom: 1px solid #e5e5e5;
    overflow: hidden;
  }
  .topic_wraper_list > div{
    float: left;
    cursor: pointer;
  }
  .topic_list_img > img {
    width: 30px;
    height: 30px;
    margin-top: 10px;
  }
  .topic_list_comment{
    width: 70px;
    text-align: center;
    line-height: 50px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .topic_list_tab{
    background-color:#e5e5e5;
    color: #999;
    padding: 2px 4px;
    font-size: 12px;
    border-radius: 3px;
    margin-top: 16px;
  }
  .choice_topic_list_tab{
    background-color: #369219;
    color: #ffffff;
  }
  .topic_list_titile{
    line-height: 50px;
    padding-left: 5px;
    width: 800px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .topic_wraper_list > .topic_list_time{
    float: right;
    line-height: 50px;
    color: #999;
  }
  .el-pagination{
    margin-top: 10px;
    margin-left: 10px;
  }
</style>
