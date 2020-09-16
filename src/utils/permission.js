/*
 * @Author: Hzh
 * @Date: 2020-09-14 09:38:49
 * @LastEditTime: 2020-09-16 13:31:26
 * @LastEditors: Hzh
 * @Description:权限判断函数
 */
import store from '@/store'

/**
 <div :key="'checkPermission'+key" style="margin-top:60px;">
<aside>
  在某些情况下，不适合使用 v-permission。例如：Element-UI 的 el-tab 或 el-table-column 以及其它动态渲染 dom 的场景。你只能通过手动设置 v-if 来实现。
  <br>
  例如下面例子：
</aside>

<el-tabs type="border-card" style="width:550px;">
  <el-tab-pane v-if="checkPermission(['admin'])" label="Admin">
    Admin 能看到这段内容
    <el-tag class="permission-sourceCode" type="info" @click="handleCopy($event)">
      v-if="checkPermission(['admin'])"
    </el-tag>
  </el-tab-pane>

  <el-tab-pane v-if="checkPermission(['editor'])" label="Editor">
    Editor 能看到这段内容
    <el-tag class="permission-sourceCode" type="info" @click="handleCopy($event)">
      v-if="checkPermission(['editor'])"
    </el-tag>
  </el-tab-pane>

  <el-tab-pane v-if="checkPermission(['admin','editor'])" label="Admin或者Editor">
    admin 或者 editor 能看到这段内容
    <el-tag class="permission-sourceCode" type="info" @click="handleCopy($event)">
      v-if="checkPermission(['admin','editor'])"
    </el-tag>
  </el-tab-pane>
</el-tabs>
</div>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数

methods:{
  checkPermission,
}
</script>
*/

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}
