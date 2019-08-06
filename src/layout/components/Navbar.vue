<template>
  <div class="navbar">
    <!-- 折叠菜单 -->
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <!-- 面包屑导航 -->
    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- 菜单检索 -->
        <search id="header-search" class="right-menu-item" />

        <!-- 全屏 -->
        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <!-- 选择语言 -->
        <el-tooltip :content="this.$t('common.SwitchLanguage')" effect="dark" placement="bottom">
          <language-select id="language-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>
      <!-- 个人中心 -->
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <div class="user-avatar"><img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"></div>
          <div class="user-name"><span>{{ realName }}</span><i class="el-icon-caret-bottom" /></div>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- 修改密码 -->
          <el-dropdown-item>
            <span style="display:block;" @click="handlePassword">{{ this.$t('buttons.BtnPassword') }}</span>
          </el-dropdown-item>
          <!-- 退出登录 -->
          <el-dropdown-item>
            <span style="display:block;" @click="logout">{{ this.$t('buttons.BtnLogout') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 修改密码弹窗 -->
    <modify-password v-if="dialogConfig.dialogVisible" :dialog-config="dialogConfig" @login-out="logout" />
  </div>
</template>

<script>
import { getUserInfo } from '@/utils/auth'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import LanguageSelect from '@/components/LangSelect'
import Screenfull from '@/components/Screenfull'
import Search from '@/components/HeaderSearch'
import ModifyPassword from '@/components/ModifyPassword'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    LanguageSelect,
    Screenfull,
    Search,
    ModifyPassword
  },
  data() {
    return {
      dialogConfig: {
        dialogVisible: false,
        title: this.$t('common.ModifyPassword')
      },
      firstLogin: JSON.parse(getUserInfo()).FirstLogin,
      userList: this.$store.state.common.userList || JSON.parse(localStorage.getItem('FsUserList')),
      realName: JSON.parse(getUserInfo()).RealName
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'device'
    ])
  },
  created() {
    this.firstLogin ? this.dialogConfig.dialogVisible = true : this.dialogConfig.dialogVisible = false
  },
  methods: {
    // 侧边栏
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 退出登录
    async logout() {
      await this.$store.dispatch('user/logout').then(() => {
        this.$store.dispatch('user/resetToken')
        this.$router.push('/login')
        location.reload()
      })

      // 退出登录以后，清空localStorage缓存数据
      localStorage.clear()
    },
    // 修改密码
    handlePassword() {
      this.dialogConfig.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-left: 10px;
      margin-right: 10px;
      height: 50px;
      overflow: hidden;

      .avatar-wrapper {
        display: flex;
        justify-content: space-between;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          margin-top: 5px;
          img{
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }
        }

        .user-name{
          cursor: pointer;
          margin-left: 5px
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
