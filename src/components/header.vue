<template>
  <div class="header">
    <div class="headerWrap">
      <div class="headerWrapLeft">
        <div class="logo">
          <i class="iconfont icon-bokeblogger3"></i>
        </div>
        <div>
          <span>前端交流聚集地</span>
        </div>
        <div class="headerInput" :class="[{ headerInputTwo: isActive }]" v-if="searchShow">
          <i class="iconfont icon-sousuo" @click="search"></i>
          <input type="text" placeholder="请输入标题搜索" v-model="title" class="search" @focus="headerInput(true)" @blur="headerInput(false)" @keyup.enter.native="search">
        </div>
      </div>
      <div class="headerWrapRight">
        <i class="iconfont icon-fabu" @click="createTopic" v-show="isLogin && searchShow"></i>
        <el-dropdown v-show="isLogin" @command="handleCommand">
              <span class="el-dropdown-link">
                <i class="iconfont icon-shezhi"></i>
              </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="个人资料" v-text="userInfo.userName"></el-dropdown-item>
            <el-dropdown-item command="参考资料">参考资料</el-dropdown-item>
            <el-dropdown-item command="关于">关于</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <i class="iconfont icon-zhuce" @click="login(false)" v-show="!isLogin"></i>
        <i class="iconfont icon-h" @click="quit()" v-show="isLogin"></i>
        <i class="iconfont icon-denglu" @click="login(true)" v-show="!isLogin"></i>
      </div>
    </div>
    <!--设置弹出的dialog-->
    <el-dialog :title="setUpDialogName" :visible.sync="dialogFormVisible" :before-close="closeDialog">
      <!--修改和查看个人资料-->
      <el-form :model="form" ref="form" v-show="setUpDialogName == '个人资料'" label-width="70px">
        <el-form-item label="头像" prop="user_img">
          <el-upload
            list-type="picture-card"
            action="http://127.0.0.1:7001/hzx/v1/upload"
            :show-file-list="false"
            :before-upload="beforeUploadImg"
            :on-success="uploadSuccessImg"
            ref="OneUploadImg"
          >
            <img v-if="form.user_img" :src="form.user_img" class="avatar">
            <i v-else class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户名" prop="userName" :rules="filter_rules({required:'请输入用户名'})">
          <el-input v-model="form.userName" autocomplete="off" placeholder="请输入用户名" maxlength="25"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="accountNumer" :rules="filter_rules({required:'请输入手机号或邮箱',type:'mobile'})">
          <el-input v-model="form.accountNumer" autocomplete="off" placeholder="请输入手机号" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="filter_rules({required:'请输入密码',type:'regexn',min:6,max:18})">
          <el-input type="password" v-model="form.password" autocomplete="off" placeholder="请输入密码" maxlength="18" minlength="6"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" autocomplete="off" placeholder="请输入备注" maxlength="150"></el-input>
        </el-form-item>
      </el-form>
      <!--登录或注册-->
      <el-form :model="form" ref="formTwo" v-show="setUpDialogName == '登录' || setUpDialogName == '注册'" label-width="70px">
        <el-form-item label="用户名" prop="accountNumer" :rules="filter_rules({required:'请输入手机号',type:'mobile'})">
          <el-input v-model="form.accountNumer" autocomplete="off"  placeholder="请输入手机号" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="filter_rules({required:'请输入密码',type:'regexn',min:6,max:18})">
          <el-input type="password" v-model="form.password" autocomplete="off"  placeholder="请输入密码" maxlength="18" minlength="6"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog()">取 消</el-button>
        <el-button type="primary" @click="okDialog()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'commonHeader',
  data () {
    return {
      isActive: false,
      isLogin: false,
      setUpDialogName: '',
      form: {},
      dialogFormVisible: false,
      userInfo: {},
      deleteImg: [],
      title: ''
    }
  },
  props: ['name', 'searchShow'],
  watch: {
    'name': function (newVal, oldVal) {
      this.title = newVal
    }
  },
  created: function () {
    if (localStorage.getItem('userInfo') != null) {
      this.isLogin = true
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    }
  },
  methods: {
    search () {
      this.$emit('search', this.title)
    },
    beforeUploadImg (file) {
      const fileNameArr = file.name.split('.')
      const typeName = fileNameArr[fileNameArr.length - 1].toLocaleLowerCase()
      if (typeName !== 'jpg' && typeName !== 'png' && typeName !== 'jpeg' && typeName !== 'gif') {
        this.$message('上传文件只能是 jpg、png、jpeg、gif 格式!')
        return false
      }
    },
    uploadSuccessImg (res, file) {
      this.form.user_img = res.body.message
      const url = res.body.message
      const urlTwo = url.substring(url.lastIndexOf('/') + 1, url.length)
      this.deleteImg.push(urlTwo)
    },
    headerInput (val) {
      this.isActive = val
    },
    handleCommand (command) {
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
      this.setUpDialogName = command
      if (command === '个人资料') {
        this.form = JSON.parse(localStorage.getItem('userInfo'))
      }
      this.dialogFormVisible = true
    },
    cancelDialog () {
      this.dialogFormVisible = false
      if (this.setUpDialogName === '个人资料') {
        this.$axios.post('/hzx/v1/upload/delete', this.deleteImg).then((response) => {
          this.deleteImg = []
        })
      }
    },
    okDialog () {
      if (this.setUpDialogName === '个人资料') {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let deleteArr = []
            if (this.deleteImg.length > 1) {
              deleteArr = this.deleteImg.slice(0, -1)
            }
            if (this.deleteImg.length > 0) {
              this.form.isDeleteImg = true
            }
            Promise.all([
              this.$axios.put('/hzx/v1/user/' + this.userInfo['_id'], this.form),
              this.$axios.post('/hzx/v1/upload/delete', deleteArr)
            ]).then(response => {
              if (response[0].code === 200) {
                this.$message.success('修改成功')
                this.dialogFormVisible = false
                this.userInfo = response[0].message
                localStorage.setItem('userInfo', JSON.stringify(response[0].message))
              } else {
                this.$message.error(response[0].message)
              }
              this.deleteImg = []
            })
          } else {
            return false
          }
        })
      } else {
        this.$refs['formTwo'].validate((valid) => {
          if (valid) {
            if (this.setUpDialogName === '登录') {
              this.$axios.post('/hzx/v1/login', this.form).then((response) => {
                if (response.code === 200) {
                  localStorage.setItem('userInfo', JSON.stringify(response.message))
                  this.userInfo = response.message
                  this.isLogin = true
                  this.dialogFormVisible = false
                  this.$router.push('/index')
                } else {
                  this.$message.error(response.message)
                }
              })
            } else if (this.setUpDialogName === '注册') {
              this.$axios.post('/hzx/v1/user', this.form).then((response) => {
                console.log(response)
                if (response.code === 1) {
                  this.$message.error(response.message)
                } else {
                  this.dialogFormVisible = false
                  this.$message.success(response.message)
                }
              })
            }
          } else {
            return false
          }
        })
      }
    },
    closeDialog () {
      this.dialogFormVisible = false
      if (this.setUpDialogName === '个人资料') {
        this.$axios.post('/hzx/v1/upload/delete', this.deleteImg).then((response) => {
          this.deleteImg = []
        })
      }
    },
    login (flag) {
      this.form = {}
      if (flag) {
        this.setUpDialogName = '登录'
      } else {
        this.setUpDialogName = '注册'
      }
      if (this.$refs['formTwo']) {
        this.$refs['formTwo'].resetFields()
      }
      this.dialogFormVisible = true
    },
    quit () {
      this.$confirm('确认退出？')
        .then(() => {
          this.isLogin = false
          localStorage.removeItem('userInfo')
          this.$router.push('/index')
        })
        .catch(() => {})
    },
    createTopic () {
      this.$router.push('/topic')
    }
  }

}
</script>

<style scoped>

</style>
