<template>
  <div :class="{'show':show}" class="header-search">
    <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" />
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      clearable
      default-first-option
      remote
      :placeholder="this.$t('common.SearchMenu')"
      class="header-search-select"
      @change="change"
    >
      <el-option v-for="item in options" :key="item.path" :value="item" :label="item.title.join(' > ')" />
    </el-select>
  </div>
</template>

<script>
// fuse is a lightweight fuzzy-search module
// make search results more in line with expectations
import Fuse from 'fuse.js'
import path from 'path'
import { getMenuTree } from './API'

export default {
  name: 'HeaderSearch',
  data() {
    return {
      search: '',
      options: [],
      searchPool: [],
      show: false,
      fuse: undefined,
      menuTree: []
    }
  },
  watch: {
    menuTree() {
      this.searchPool = this.generateRoutes(this.menuTree)
    },
    searchPool(list) {
      this.initFuse(list)
    },
    show(value) {
      if (value) {
        document.body.addEventListener('click', this.close)
      } else {
        document.body.removeEventListener('click', this.close)
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
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

          // 把请求的菜单方法做数据处理
          this.searchPool = this.generateRoutes(this.menuTree)
        }
      })
    },
    click() {
      this.show = !this.show
      if (this.show) {
        this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus()
      }
    },
    close() {
      this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur()
      this.options = []
      this.show = false
    },
    change(val) {
      this.$router.push(val.path)
      this.search = ''
      this.options = []
      this.$nextTick(() => {
        this.show = false
      })
    },
    initFuse(list) {
      this.fuse = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [{
          name: 'title',
          weight: 0.7
        }, {
          name: 'path',
          weight: 0.3
        }]
      })
    },
    // Filter out the routes that can be displayed in the sidebar
    // And generate the internationalized title
    generateRoutes(routes, basePath = '/', prefixTitle = []) {
      let res = []

      for (const router of routes) {
        // skip hidden router
        if (router.hidden) { continue }
        const data = {
          path: path.resolve(basePath, router.path),
          title: [...prefixTitle]
        }

        if (router.meta && router.meta.title) {
          data.title = [...data.title, this.$t('route.' + router.meta.title)]

          if (router.redirect !== 'noRedirect') {
            // only push the routes with title
            // special case: need to exclude parent router without redirect
            res.push(data)
          }
        }

        // recursive child routes
        if (router.children) {
          const tempRoutes = this.generateRoutes(router.children, data.path, data.title)
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    },
    querySearch(query) {
      if (query !== '') {
        this.options = this.fuse.search(query)
      } else {
        this.options = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    /deep/ .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
