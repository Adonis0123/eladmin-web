<!--
 * @Author: Hzh
 * @Date: 2020-07-22 18:16:18
 * @LastEditTime: 2020-09-15 10:01:30
 * @LastEditors: Hzh
 * @Description:组件嵌套
-->

<template>
  <div v-if="!item.hidden">
    <!-- 菜单 -->
    <!-- alwaysShow 当菜单目录下只有一个菜单时，也展示该菜单目录 -->
    <template v-if="theOnlyOneChild&&!item.alwaysShow">
      <app-link v-if="theOnlyOneChild.meta" :to="resolvePath(theOnlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(theOnlyOneChild.path)"
          :class="{'submenu-title-noDropdown':!isNest}"
        >
          <item
            :icon="theOnlyOneChild.meta.icon||(item.meta&&item.meta.icon)"
            :title="theOnlyOneChild.meta.title"
          />
        </el-menu-item>
      </app-link>
    </template>

    <!-- 菜单目录 -->
    <!-- 递归循环此组件 -->
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object  第一级的路由或递归时菜单目录的路由
    item: {
      type: Object,
      required: true
    },
    // 一级菜单目录下，菜单收起时的样式
    isNest: {
      type: Boolean,
      default: false
    },
    // 第一级的路由路径或递归时菜单目录的路径
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {
    /**
     * 获取需要显示的子菜单或菜单目录数组，当数组长度大于0时，说明当前是菜单目录
     */
    showingChildren() {
      if (this.item.children) {
        const showingChildren = this.item.children.filter((item) => {
          if (item.hidden) {
            return false
          } else {
            return true
          }
        })
        return showingChildren
      }
      return []
    },

    /**
     * 判断当前是子菜单还是菜单目录， 获取要显示的子菜单
     */
    theOnlyOneChild() {
      // 需要显示的子菜单数量大于1，说明当前是菜单目录
      if (this.showingChildren.length > 1) {
        return false
      }

      // 当只有一个子菜单时，返回该子菜单，菜单目录将会隐藏直接显示子菜单
      if (this.showingChildren.length === 1) {
        return this.showingChildren[0]
      }

      // 当前的菜单,这里path之所以要清空，是因为不清空的话会造成最后一个拼接的path重复
      return { ...this.item, path: '' }
    }
  },
  methods: {
    /**
     * @description: 处理跳转的路由
     * @param {Srting} routePath 路由路径或者外链
     * @returns {String} 处理过后路由路径
     */
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      // 合并basePath和routerPath 例如/permission page将会变成/permission/page
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
