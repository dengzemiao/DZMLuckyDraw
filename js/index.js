// 自定义抽签弹窗组件
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
      title="自定义抽签项目"
      width="380px"
      placement="right"
      :visible="visible"
      @close="onClose"
    >
      <!-- 提示 -->
      <a-alert
        message="名称为必填，标签为选填，关闭本窗口会自动保存，并清理名称为空的项目！"
        type="info"
        show-icon
      />
      <!-- 自定义列表 -->
      <div class="custom-item" v-for="(item, index) in customs" :key="index">
        <div>名称：</div>
        <a-input
          class="custom-item-input-name"
          placeholder="如一等奖"
          v-model="item.name"
        />
        <div style="margin-left: 20px;">标签：</div>
        <a-input
          class="custom-item-input-tag"
          placeholder="数字>0"
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
        新建抽签项目
      </a-button>
    </a-drawer>
  `,
  methods: {
    // 显示抽屉
    showDrawer () {
      // 获取自定义列表
      this.customs = JSON.parse(localStorage.getItem('customs')) || []
      // 显示
      this.visible = true
    },
    // 关闭抽屉
    onClose () {
      // 过滤空名称项目
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

    <!-- 标题 Lucky Draw-->
    <div class="setting-row-style"><span class="font-title">Lucky Draw</span></div>

    <!-- 设置抽签主题 -->
    <div class="setting-row-style"><span class="font-label">抽签主题</span></div>
    <div class="setting-row-style">
      <a-input
        class="setting-input-title"
        v-model="isTitle"
        @change="handleTitleChange"
        placeholder="抽签主题"
      />
    </div>

    <!-- 设置 -->
    <div class="setting-row-style"><span class="font-label">设置</span></div>

    <!-- 切换模式 -->
    <div class="setting-row-style">
      <a-select
        class="setting-selection"
        v-model="modeType"
        @change="handleImportModeChange"
      >
        <a-select-option :value="0">默认抽签模式</a-select-option>
        <a-select-option :value="1">自定义抽签模式</a-select-option>
      </a-select>
      <a-icon
        v-if="modeType == 1 && isImportMode"
        class="operation-success-icon"
        type="check-circle"
      />
      <a-button
        v-if="modeType == 1"
        class="operation-import-setting"
        type="primary"
        shape="circle"
        @click="touchCustom"
      >
        <a-icon type="setting" />
      </a-button>
    </div>

    <!-- 是否允许重复抽签 -->
    <div class="setting-row-style">
      <a-select
        class="setting-selection"
        v-model="modeDuplicate"
        @change="handleDuplicateModeChange"
      >
        <a-select-option :value="0">允许重复抽签</a-select-option>
        <a-select-option :value="1">禁止重复抽签</a-select-option>
      </a-select>
    </div>

      <!-- 上传抽签清单 -->
      <div class="setting-row-style">
        <a-upload
          :disabled="isLoading"
          accept=".xlsx,.xls,.csv"
          :fileList="[]"
          :beforeUpload="beforeUpload"
          :customRequest="customRequest"
        >
          <a-button
            class="setting-button"
            :type="isImportUsers ? 'primary' : 'default'"
            :loading="isLoading"
          >
            {{ isImportUsers ? '更新清单' : '上传清单' }}
            <a-icon type="upload" />
            <a-icon
              v-if="isImportUsers"
              class="operation-success-icon"
              type="check-circle"
            />
          </a-button>
        </a-upload>
      </div>
      <!-- 提示 -->
      <div class="setting-row-style">
        <span class="font-hint">支持 .xlsx、.xls、.csv 文件格式</span>
      </div>

      <!-- 重置按钮 -->
      <div class="setting-row-style">
        <a-button
          class="setting-button"
          @click="clearData"
        >
          清空数据
          <a-icon type="reload" />
        </a-button>
      </div>

      <!-- 副标题 -->
      <div class="setting-row-style"><span class="font-label">选择背景</span></div>

      <!-- 背景为图案还是纯色 -->
      <div class="setting-row-style">
        <a-select
          class="setting-selection"
          v-model="isColor"
          @change="handlebgModeChange"
        >
          <a-select-option :value="0">图案背景</a-select-option>
          <a-select-option :value="1">纯色背景</a-select-option>
        </a-select>
      </div>

      <table width="160px" align="center">
        <tr>
          <td width="120px">
          <img
            id="bg_Image"
            class="setting-image"
            :src="bgImageSrc"
          />
          </td>
          <td width="40px">
            <div>
              <a-button
                class="operation-spinbutton"
                type="primary"
                shape="circle"
                @click="selectImage(0)"
              >
              <a-icon type="arrow-up" />
            </div>
            <div>
              <a-button
                class="operation-spinbutton"
                type="primary"
                shape="circle"
                @click="selectImage(1)"
              >
              <a-icon type="arrow-down" />
            </div>
          </td>
        </tr>
      </table>

      <!-- 自定义抽签项目组件 -->
      <custom-lucky-draw-drawer ref="custom-lucky-draw-drawer" @close="onCloseCustom"></custom-lucky-draw-drawer>

      <div class="setting-row-style"><span class="font-label">进入抽签界面</span></div>
        <!-- 进入抽签界面 -->
        <div class="setting-row-style">
        <a-button
          class="setting-button"
          :type="isImportUsers ? 'danger' : 'default'"
          :disabled="!(modeType == 0 && isImportUsers) && !((modeType == 1 && isImportMode) && isImportUsers)"
          @click="touchLuckyDrawPage"
        >
          进入抽取界面
          <a-icon type="crown"/>
        </a-button>
        </div>
      </div>

  `,
  data () {
    return {
      // 0 默认抽签模式，1 自定义抽签模式
      modeType: 0,
      // 0 允许重复抽签，1 不允许重复抽签
      modeDuplicate: 0,
      // 上传文件列表
      fileList: [],
      // 上传状态
      isLoading: false,
      // 用户列表
      users: [],
      // 是否导入了用户列表
      isImportUsers: false,
      // 是否有自定义奖项配置
      isImportMode: false,
      // 自定义标题
      isTitle: undefined,
      // 背景图片
      bgImageSrc: undefined,
      bgImageNumber: 9,
      bgImageDir: ["image/background/picture/BG-", "image/background/color/BG-"],
      bgImageFile: ["random", "01", "02", "03", "04", "05", "06", "07", "08", "09"],
      bgImageIndex: 0,
      isColor: 0,
    }
  },
  created () {
    // 获取抽签模式
    const modeType = localStorage.getItem('modeType')
    if (modeType) {
      this.modeType = Number(modeType)
    } else {
      this.modeType = 0
    }
    // 获取抽签模式
    const modeDuplicate = localStorage.getItem('modeDuplicate')
    if (modeDuplicate) {
      this.modeDuplicate = Number(modeDuplicate)
    } else {
      this.modeDuplicate = 0
    }

    // 获取标题
    const isTitle = localStorage.getItem('isTitle')
    if (isTitle) {
      this.isTitle = isTitle
    } else {
      this.isTitle = undefined
    }

    // 获取背景图片
    const isColor = localStorage.getItem('isColor')
    if (isColor) {
        this.isColor = Number(isColor)
    } else {
      this.isColor = 0
    }

    const isbgImage = localStorage.getItem('isbgImage')
    if (isbgImage) {
      if(isbgImage < 0 || isbgImage > this.bgImageNumber) {
        this.bgImageIndex = 0
        localStorage.setItem('isbgImage', this.bgImageIndex)
      } else {
        this.bgImageIndex = isbgImage
        localStorage.setItem('isbgImage', this.bgImageIndex)
      }
    } else {
      this.bgImageIndex = 0
    }
    this.bgImageSrc = this.bgImageDir[this.isColor] + this.bgImageFile[this.bgImageIndex] + ".png"

    // 获取抽签用户
    const users = localStorage.getItem('users')
    this.isImportUsers = users ? JSON.parse(users).length : false
    // 获取自定义抽签项
    this.onCloseCustom()
  },
  methods: {
    // 更改选择背景图片
    selectImage (e) {
      var bgPhoto = document.getElementById("bg_Image");
      if (e == 0 && this.bgImageIndex < (this.bgImageNumber)) {
        this.bgImageIndex = parseInt(this.bgImageIndex) + 1
        this.bgImageSrc = this.bgImageDir[this.isColor] + this.bgImageFile[this.bgImageIndex] + ".png"
        bgPhoto.src = this.bgImageSrc
        localStorage.setItem('isbgImage', this.bgImageIndex)
      }
      if (e == 1 && this.bgImageIndex > 0) {
        this.bgImageIndex = parseInt(this.bgImageIndex) - 1
        this.bgImageSrc = this.bgImageDir[this.isColor] + this.bgImageFile[this.bgImageIndex] + ".png"
        bgPhoto.src = this.bgImageSrc
        localStorage.setItem('isbgImage', this.bgImageIndex)
      }
    },
    // 跳转
    touchLuckyDrawPage () {
      window.location.href = './lucky-draw.html'
    },
    // 抽签模式切换
    handleImportModeChange (e) {
      // 存储到 localStorage
      localStorage.setItem('modeType', e)
    },
    // 重复模式切换
    handleDuplicateModeChange (e) {
      // 存储到 localStorage
      localStorage.setItem('modeDuplicate', e)
    },
    // 背景模式切换
    handlebgModeChange (e) {
      // 存储到 localStorage
      localStorage.setItem('isColor', this.isColor)
      this.bgImageSrc = this.bgImageDir[this.isColor] + this.bgImageFile[0] + ".png"
      this.bgImageIndex = 0
      localStorage.setItem('isbgImage', this.bgImageIndex)
    },
    // 保存标题
    handleTitleChange () {
      // 存储到 localStorage
      localStorage.setItem('isTitle', this.isTitle)
    },
    // 自定义抽签组件
    touchCustom () {
      this.$refs["custom-lucky-draw-drawer"].showDrawer()
    },
    // 关闭自定义抽签窗口
    onCloseCustom () {
      const customs = localStorage.getItem('customs')
      this.isImportMode = customs ? JSON.parse(customs).length : false
    },
    // 清空数据
    clearData () {
      // 清空数据
      localStorage.clear()
      // 清空状态
      this.isImportUsers = false
      this.isImportMode = false
      this.modeType = 0
      this.modeDuplicate = 0
      this.isTitle = undefined
      this.bgImageIndex = 0
      this.bgImageSrc = "CSS/BG/BG-random.png"
      // 提示
      this.$message.success('清理成功')
    },
    // 上传之前检查
    beforeUpload (file, fileList) {
      return true
    },
    // 自定义上传清单
    customRequest (data) {
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
          // 清单是否为空
          if (this.users.length) {
            // 清单有值
            this.$message.success('上传清单成功')
          } else {
            // 清单为空
            this.$message.error('上传清单是空的，请检查！')
          }
          // 结束加载
          this.isLoading = false
        } else {
          // 结束加载
          this.isLoading = false
          this.$message.success('上传清单失败')
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
