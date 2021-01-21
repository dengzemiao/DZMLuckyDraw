// 自定义抽奖弹窗组件
const CustomLuckyDrawDrawer = {
  data () {
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
    showDrawer () {
      // 获取自定义列表
      this.customs = JSON.parse(sessionStorage.getItem('customs')) || []
      // 显示
      this.visible = true
    },
    // 关闭抽屉
    onClose () {
      // 过滤空名称奖项
      const customs = this.customs.filter(item => {
        return !!item.name
      })
      // 转成 json
      const jsonString = JSON.stringify(customs)
      // 存储到 sessionstorage
      sessionStorage.setItem('customs', jsonString)
      // 关闭窗口
      this.visible = false
    },
    // 新增
    touchAdd () {
      const custom = {
        name: undefined,
        tag: undefined
      }
      this.customs.push(custom)
    },
    // 删除
    touchDelete (index) {
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
        :disabled="isLoading"
        accept=".xlsx,.xls,.csv"
        :fileList="[]"
        :beforeUpload="beforeUpload"
        :customRequest="customRequest" 
      >
        <a-button
          class="import-button"
          :type="isSuccess ? 'primary' : 'default'"
          :loading="isLoading"
        >
          {{ isSuccess ? '更新名单' : '上传名单' }}
          <a-icon type="upload" />
        </a-button>
      </a-upload>
      <!-- 进入抽奖池 -->
      <!-- <a-button class="import-button-bg" type="danger" :disabled="isLoading || !isSuccess">进入抽奖池</a-button> -->
      <a-button
        class="import-button-bg"
        :type="isSuccess ? 'danger' : 'default'"
        :disabled="isLoading"
        @click="touchLuckyDrawPage"
      >
        进入抽奖池
        <a-icon type="crown" />
      </a-button>
      <!-- 切换模式 -->
      <a-select
        class="import-mode"
        v-model="modeType"
        @change="handleImportModeChange"
      >
        <a-select-option :value="0">默认抽奖模式</a-select-option>
        <a-select-option :value="1">自定义奖项模式</a-select-option>
      </a-select>
      <!-- 设置按钮 -->
      <a-button
        v-if="modeType == 1"
        class="import-setting"
        type="primary"
        shape="circle"
        @click="touchCustom"
      >
        <a-icon type="setting" />
      </a-button>
      <!-- 提示 -->
      <span class="import-hint">小提示：上传名单只支持 .xlsx、.xls、.csv 文件格式，纯名单即可！已中奖用户不会重复中奖！</span>
      <!-- 自定义抽奖组件 -->
      <custom-lucky-draw-drawer ref="custom-lucky-draw-drawer"></custom-lucky-draw-drawer>
    </div>
  `,
  data () {
    return {
      // 0 默认抽奖模式，1 自定义抽奖模式
      modeType: 0,
      // 上传文件列表
      fileList: [],
      // 上传状态
      isLoading: false,
      // 是否上传名单成功
      isSuccess: false,
      // 用户列表
      users: []
    }
  },
  created () {
    // 初始化数据
    const modeType = sessionStorage.getItem('modeType')
    if (modeType) {
      this.modeType = Number(modeType)
    } else {
      this.modeType = 0
    }
  },
  methods: {
    // 跳转
    touchLuckyDrawPage () {
      window.location.href = './lucky-draw.html'
    },
    // 抽奖模式切换
    handleImportModeChange (e) {
      // 存储到 sessionstorage
      sessionStorage.setItem('modeType', e)
    },
    // 自定义抽奖组件
    touchCustom () {
      this.$refs["custom-lucky-draw-drawer"].showDrawer()
    },
    // 上传之前检查
    beforeUpload (file, fileList) {
      return true
    },
    // 自定义上传名单
    customRequest (data) {
      // 数据记录
      this.users = []
      // 进入加载
      this.isSuccess = false
      this.isLoading = true
      // 开始解析数据
      formJson(data.file, (code, sheets) => {
        // 解析成功且有数据
        if (code === 0) {
          // 导入成功
          this.isSuccess = true
          this.$message.success('上传名单成功')
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
          // 存储到 sessionstorage
          sessionStorage.setItem('users', jsonString)
          // 结束加载
          this.isLoading = false
        } else {
          // 结束加载
          this.isLoading = false
          // 导入失败
          this.isSuccess = false
          this.$message.success('上传名单失败')
        }
      })
    },
    // 获取单个用户数据，传入单元格字段
    userJson (item) {
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