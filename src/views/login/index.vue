<template>
  <div class="login-container">
    <div class="web-info" :style="{marginTop:bodyHeight/2 - 80+'px'}">

      <h2><mallki class="title" :text="$settings.title" /></h2>
      <span><mallki :text="$settings.slogan" /></span>
    </div>
    <div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left" :style="{marginTop:bodyHeight/2 - 240+'px'}">
        <div class="title-container">
          <h3>{{ $t('buttons.BtnLogin') }}</h3>
        </div>
        <!-- 用户名 -->
        <el-form-item prop="UserName">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.UserName"
            :placeholder="$t('basicSettings.PleaseInputUserName')"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
            clearable
          />
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="Password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.Password"
            :type="passwordType"
            :placeholder="$t('basicSettings.PleaseInputPassword')"
            name="password"
            tabindex="2"
            auto-complete="on"
            clearable
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <!-- 验证码 -->
        <el-form-item prop="DynamicPassword">
          <el-row>
            <el-col :span="18">
              <span class="svg-container">
                <svg-icon icon-class="verification" />
              </span>
              <el-input
                ref="verification"
                v-model="loginForm.DynamicPassword"
                :placeholder="$t('basicSettings.PleaseInputVerifyCode')"
                tabindex="3"
                auto-complete="on"
                clearable
                @keyup.enter.native="handleLogin"
              />
            </el-col>
            <el-col :span="6" style="position: relative">
              <!-- 发送验证码按钮 -->
              <el-button style="width:90%; height:28px; position: absolute; top:10px; right:5%" :disabled="sended" @click.native.prevent="handleSendCode">
                {{ sended ? $t('basicSettings.CountdownSecond').formatI18n(second) : $t('basicSettings.SendCode') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 登录按钮 -->
        <el-button v-loading="loading" type="primary" style="width:100%;height:40px;margin-top:5px;" @click.native.prevent="handleLogin">
          {{ $t('buttons.BtnLogin') }}
        </el-button>

        <div style="line-height:40px; color:#666; text-align:center"> {{ $settings.version }}</div>
      </el-form>
    </div>
  </div>
</template>

<script>
import Mallki from '@/components/TextHoverEffect/Mallki'
import { sendCode, getButtons, getUserList } from './API'
export default {
  name: 'Login',
  components: {
    Mallki
  },
  data() {
    return {
      loginForm: {
        UserName: '',
        Password: '',
        DynamicPassword: ''
      },
      loginRules: {
        UserName: [{ required: true, trigger: 'blur', message: this.$t('common.NotNull') }],
        Password: [{ required: true, trigger: 'blur', message: this.$t('common.NotNull') }],
        DynamicPassword: [{ required: true, trigger: 'blur', message: this.$t('common.NotNull') }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      second: 60,
      sended: false
    }
  },
  computed: {
    bodyHeight() {
      return document.body.clientHeight
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    // 清空localStorage缓存数据
    localStorage.clear()
  },
  methods: {
    // 查看密码
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 登录
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(response => {
            if (response.data.MsgStatus === 1) {
              this.$router.push('/') // path: this.redirect ||

              // 获取所有按钮
              getButtons({ Data: {}}).then(response => {
                if (response.data.MsgStatus === 1) {
                  const allButtons = response.data.Data.reduce((prev, cur) => {
                    prev.push({ btnCode: cur.BtnNo, btnName: cur.BtnNo, type: cur.BtnType, icon: cur.MenuIcon, region: cur.MenuRegion, menuNo: cur.ParentNo })
                    return prev
                  }, [])
                  // 把返回的数据存入Vuex、localStorage
                  this.$store.commit('SET_BUTTONS', allButtons)
                  localStorage.setItem('FsAllButtons', JSON.stringify(allButtons))
                }
              })

              // 获取用户下拉数据
              getUserList({ Data: {}}).then(response => {
                if (response.data.MsgStatus === 1) {
                  // 把返回的数据存入Vuex、localStorage
                  response.data.Data.push({ Key: 'admin', Value: '超级管理员' })
                  this.$store.commit('SET_USER_LIST', response.data.Data)
                  localStorage.setItem('FsUserList', JSON.stringify(response.data.Data))
                }
              })
            } else {
              this.$message.error(response.data.Msg)
            }
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    // 发送验证码
    handleSendCode() {
      if (this.loginForm.UserName) {
        sendCode({ Data: { UserName: this.loginForm.UserName }}).then(response => {
          if (response.data.MsgStatus === 1) {
            this.sended = true
            // 设置定时器，倒数60秒
            const timer = setInterval(() => {
              this.second--

              // 清除定时器,并把按钮转为"发送验证码"
              if (this.second < 1) {
                clearInterval(timer)
                this.second = 60
                this.sended = false
              }
            }, 1000)
          } else {
            this.$message.error(response.data.Msg)
          }
        })
      } else {
        this.$message.warning(this.$t('basicSettings.PleaseInputUserName'))
      }
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #333;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #333;
      height: 47px;
      caret-color: $cursor;
      font-size: 14px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #f0f0f0 inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #fff;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  background-image: url('../../assets/login-bg.jpg');
  background-size: cover;
  display: flex;
  justify-content: space-around;

  .web-info{
    height: 160px;
    color: #fff;

    h2{
      font-size: 36px;
      font-weight: bold;
    }
  }

  .login-form {
    position: relative;
    width: 520px;
    height: 400px;
    padding: 40px 30px;
    overflow: hidden;
    margin: 0px auto;
    background-color: $light_gray;
    border-radius: 6px
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    text-align: center;

    .title {
      font-size: 26px;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 12px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
