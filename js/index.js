// 自定义抽奖弹窗组件
const CustomLuckyDrawDrawer = {
  data() {
    return {
      // 显示状态
      visible: false,
      // 自定义列表
      customs: []
    }
  },
  template: `
    <a-drawer
      title="自定义奖项"
      width="500px"
      placement="right"
      :visible="visible"
      @close="onClose"
    >
      <!-- 提示 -->
      <a-alert
        class="custom-hint" 
        message="名称为必填，标签为选填，关闭本窗口会自动保存，并清理名称为空的奖项！"
        type="info"
        show-icon
      />
      <!-- 自定义列表 -->
      <div class="custom-item" v-for="(item, index) in customs" :key="index">
        <div>名称：</div>
        <a-input
          class="custom-item-input-name"
          placeholder="例如：一等奖"
          v-model="item.name"
        />
        <div style="margin-left: 20px;">标签：</div>
        <a-input
          class="custom-item-input-tag"
          placeholder="填数字，且大于0"
          v-model="item.tag"
        />
        <a-button
          class="custom-item-delete"
          type="primary"
          shape="circle"
          size="small"
          @click="touchDelete(index)"
        >
        一
        </a-button>
      </div>
      <!-- 添加按钮 -->
      <a-button
        class="custom-add-btn"
        type="dashed"
        @click="touchAdd"
      >
        新建奖项
      </a-button>
    </a-drawer>
  `,
  methods: {
    // 显示抽屉
    showDrawer() {
      // 获取自定义列表
      this.customs = JSON.parse(localStorage.getItem('customs')) || []
      // 显示
      this.visible = true
    },
    // 关闭抽屉
    onClose() {
      // 过滤空名称奖项
      const customs = this.customs.filter(item => {
        return !!item.name
      })
      // 转成 json
      const jsonString = JSON.stringify(customs)
      // 存储到 localStorage
      localStorage.setItem('customs', jsonString)
      // 关闭窗口
      this.visible = false
      // 回调
      this.$emit('close')
    },
    // 新增
    touchAdd() {
      const custom = {
        name: undefined,
        tag: undefined
      }
      this.customs.push(custom)
    },
    // 删除
    touchDelete(index) {
      this.customs.splice(index, 1)
    }
  }
}

// 主视图
new Vue({
  el: '#app',
  components: {
    CustomLuckyDrawDrawer
  },
  template: `
    <div class="import-view">
      <!-- 上传名单 -->
      <a-upload
        class="operation-button import-users"
        :disabled="isLoading"
        accept=".xlsx,.xls,.csv"
        :fileList="[]"
        :beforeUpload="beforeUpload"
        :customRequest="customRequest" 
      >
        <a-button
          class="operation-button-wrapper"
          :type="isImportUsers ? 'primary' : 'default'"
          :loading="isLoading"
        >
          {{ isImportUsers ? '更新名单' : '上传名单' }}
          <a-icon type="upload" />
        </a-button>
        <a-icon
          v-if="isImportUsers"
          class="operation-success-icon"
          type="check-circle"
        />
      </a-upload>
      <!-- 进入抽奖池 -->
      <a-button
        class="operation-button operation-button-wrapper"
        :type="isImportUsers ? 'danger' : 'default'"
        :disabled="isLoading"
        @click="touchLuckyDrawPage"
      >
        进入抽奖池
        <a-icon type="crown" />
      </a-button>
      <!-- 抽奖模式 -->
      <div class="operation-button">
        <a-select
          class="operation-button-wrapper"
          v-model="modeType"
          @change="onModeTypeChange"
        >
          <a-select-option :value="0">抽奖模式 - 按轮抽奖</a-select-option>
          <a-select-option :value="1">抽奖模式 - 自定义奖项</a-select-option>
        </a-select>
        <a-icon
          v-if="isImportMode"
          class="operation-success-icon"
          type="check-circle"
        />
      </div>
      <!-- 中奖模式 -->
      <div class="operation-button">
        <a-select
          class="operation-button-wrapper"
          v-model="winningType"
          @change="onWinningTypeChange"
        >
          <a-select-option :value="0">中奖模式 - 不可以重复中奖</a-select-option>
          <a-select-option :value="1">中奖模式 - 同轮可以重复中奖</a-select-option>
          <a-select-option :value="2">中奖模式 - 同轮不可以重复中奖，不同轮可以重复中奖</a-select-option>
        </a-select>
      </div>
      <!-- 重置按钮 -->
      <a-button
        class="operation-button operation-button-wrapper"
        @click="clearWinningData"
      >
        清空中奖数据，保持配置不变，重新抽奖
        <a-icon type="reload" />
      </a-button>
      <!-- 重置按钮 -->
      <a-button
        class="operation-button operation-button-wrapper"
        @click="clearData"
      >
        清空所有数据
        <a-icon type="reload" />
      </a-button>
      <!-- 工具栏 -->
      <div class="operation-tool">
        <!-- 自定义奖项 -->
        <a-button
          v-if="modeType == 1"
          class="operation-tool-button"
          shape="circle"
          :type="isImportMode ? 'primary' : 'default'"
          @click="touchCustom"
        >
         <a-icon type="database" />
        </a-button>
      </div>
      <!-- 提示 -->
      <span class="import-hint">小提示：上传名单只支持 .xlsx、.xls、.csv 文件格式，纯名单即可！推荐 Chrome 浏览器，兼容效果最佳！</span>
      <!-- 自定义抽奖组件 -->
      <custom-lucky-draw-drawer ref="custom-lucky-draw-drawer" @close="onCloseCustom"></custom-lucky-draw-drawer>
    </div>
  `,
  data() {
    return {
      // 0 默认抽奖模式，1 自定义抽奖模式
      modeType: 0,
      // 0 不可以重复中奖 1、同轮可以重复中奖 2、同轮不可以重复中奖，不同轮可以重复中奖
      winningType: 0,
      // 上传文件列表
      fileList: [],
      // 上传状态
      isLoading: false,
      // 用户列表
      users: [],
      // 是否导入了用户列表
      isImportUsers: false,
      // 是否有自定义奖项配置
      isImportMode: false
    }
  },
  created() {
    // 获取抽奖模式
    const modeType = localStorage.getItem('modeType')
    if (modeType) {
      this.modeType = Number(modeType)
    } else {
      this.modeType = 0
    }
    // 获取中奖模式
    const winningType = localStorage.getItem('winningType')
    if (winningType) {
      this.winningType = Number(winningType)
    } else {
      this.winningType = 0
    }
    // 获取抽奖用户
    const users = localStorage.getItem('users')
    this.isImportUsers = users ? JSON.parse(users).length : false
    // 获取自定义抽奖项
    this.onCloseCustom()
  },
  methods: {
    // 跳转
    touchLuckyDrawPage() {
      window.location.href = './lucky-draw.html'
    },
    // 抽奖模式切换
    onModeTypeChange(e) {
      // 存储到 localStorage
      localStorage.setItem('modeType', e)
    },
    // 中奖类型
    onWinningTypeChange(e) {
      // 存储到 localStorage
      localStorage.setItem('winningType', e)
    },
    // 自定义抽奖组件
    touchCustom() {
      this.$refs["custom-lucky-draw-drawer"].showDrawer()
    },
    // 关闭自定义抽奖窗口
    onCloseCustom() {
      const customs = localStorage.getItem('customs')
      this.isImportMode = customs ? JSON.parse(customs).length : false
    },
    // 清空中奖数据，保持配置不变，重新开始抽奖
    clearWinningData() {
      // 清空数据
      localStorage.setItem('winning-users', '[]')
      // 提示
      this.$message.success('清理成功')
    },
    // 清空数据
    clearData() {
      // 清空数据
      localStorage.clear()
      // 清空状态
      this.isImportUsers = false
      this.isImportMode = false
      this.modeType = 0
      this.winningType = 0
      // 提示
      this.$message.success('清理成功')
    },
    // 上传之前检查
    beforeUpload(file, fileList) {
      return true
    },
    // 自定义上传名单
    customRequest(data) {
      // 数据记录
      this.users = []
      // 进入加载
      this.isLoading = true
      // 开始解析数据
      formJson(data.file, (code, sheets) => {
        // 解析成功且有数据
        if (code === 0) {
          // 解析数据
          sheets.forEach(sheet => {
            // 单个 sheet
            sheet.list.forEach(row => {
              // 单行
              row.forEach(item => {
                // 每个单元格，解析成 user 对象存入数组
                if (item.length) {
                  const user = this.userJson(item)
                  this.users.push(user)
                }
              })
            })
          })
          // 解析成 JSON 字符串
          const jsonString = JSON.stringify(this.users)
          // 存储到 localStorage
          localStorage.setItem('users', jsonString)
          // 标记为有数据
          this.isImportUsers = this.users.length
          // 名单是否为空
          if (this.users.length) {
            // 名单有值
            this.$message.success('上传名单成功')
          } else {
            // 名单为空
            this.$message.error('上传名单是空的，打算抽空气么？')
          }
          // 结束加载
          this.isLoading = false
        } else {
          // 结束加载
          this.isLoading = false
          this.$message.success('上传名单失败')
        }
      })
    },
    // 获取单个用户数据，传入单元格字段
    userJson(item) {
      // 分割字符串
      const items = item.split('-')
      // 如果有3个字段
      if (items.length >= 3) {
        return {
          id: this.users.length,
          name: items[0],
          department: items[1],
          number: items[2]
        }
      }
      // 如果有2个字段
      if (items.length >= 2) {
        // 判断第二个是否为数字
        const isNumber = !isNaN(items[1])
        return {
          id: this.users.length,
          name: items[0],
          department: isNumber ? '' : items[1],
          number: isNumber ? items[1] : 0
        }
      }
      // 如果有1个字段
      if (items.length >= 1) {
        return {
          id: this.users.length,
          name: items[0],
          department: '',
          number: 0
        }
      }
    }
  }
})