new Vue({
  el: '#app',
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
      </a-button>
      <!-- 提示 -->
      <span class="import-hint">小提示：上传名单只支持 .xlsx、.xls、.csv 文件格式，纯名单即可！</span>
    </div>
  `,
  data () {
    return {
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
  methods: {
    // 跳转
    touchLuckyDrawPage () {
      window.location.href = './lucky-draw.html'
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