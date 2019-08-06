<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        @select="getMenuNo"
      >
        <sidebar-item v-for="item in menuTree" :key="item.path" :item="item" :base-path="item.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import { getMenuTree } from '../../API'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      menuTree: []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    activeMenu() {
      // 执行存储menuNo方法
      this.getMenuNo(this.$route.path)
      return this.$route.path
    },
    showLogo() {
      return this.$settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化菜单
    init() {
      getMenuTree({ Data: {}}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.menuTree = response.data.Data.reduce((prev, cur) => {
            if (cur.Children) {
              const newArr = cur.Children.reduce((arr, item) => {
                if (item.Children) {
                  arr.push({ menuNo: item.MenuNo, name: item.MenuUrl.slice(1), path: item.MenuUrl, hidden: !item.EnabledMark, meta: { title: item.MenuUrl.slice(1), icon: item.MenuIcon, affix: item.FixedTagsView }, children: item.Children })
                } else {
                  arr.push({ menuNo: item.MenuNo, name: item.MenuUrl.slice(1), path: item.MenuUrl, hidden: !item.EnabledMark, meta: { title: item.MenuUrl.slice(1), icon: item.MenuIcon, affix: item.FixedTagsView }})
                }
                return arr
              }, [])
              prev.push({ menuNo: cur.MenuNo, name: cur.MenuUrl.slice(1), path: cur.MenuUrl, hidden: !cur.EnabledMark, meta: { title: cur.MenuUrl.slice(1), icon: cur.MenuIcon, affix: cur.FixedTagsView }, children: newArr })
            } else {
              prev.push({ menuNo: cur.MenuNo, name: cur.MenuUrl.slice(1), path: cur.MenuUrl, hidden: !cur.EnabledMark, meta: { title: cur.MenuUrl.slice(1), icon: cur.MenuIcon, affix: cur.FixedTagsView }})
            }
            return prev
          }, [])
        }
      })
    },
    getMenuNo(key) {
      // 通过key值，查menuNo
      const menuItem = this.menuTree.reduce((prev, cur) => {
        if (cur.children) {
          const obj = cur.children.find(item => item.path === key)
          obj ? prev = obj : ''
        } else {
          cur.path === key ? prev = cur : ''
        }
        return prev
      }, {})
      const menuNo = menuItem.menuNo
      menuNo ? localStorage.setItem('FsMenuNo', JSON.stringify(menuNo)) : ''
    }
  }
}
</script>
