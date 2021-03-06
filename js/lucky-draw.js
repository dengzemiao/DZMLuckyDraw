new Vue({
  el: '#app',
  template: `
    <div class="lucky-draw-view">
      <!-- 抽奖显示页面 -->
      <div :class="isLuckyDraw ? 'lucky-draw-content lucky-draw-start' : 'lucky-draw-content'">
        <div :class="isLuckyDraw ? 'lucky-draw-users lucky-draw-users-start' : 'lucky-draw-users'">
          <div class="lucky-draw-user" v-for="item in users" :key="index">
            <div class="lucky-draw-user-name">{{ item.name }}</div>
            <div class="lucky-draw-user-department">{{ item.department }}</div>
          </div>
          <div v-if="!users.length && !surplusUsers.length" class="ucky-draw-empty">老板大气，已经人人中奖了！</div>
        </div>
      </div>
      <!-- 设置奖项，人数，并开始抽奖 -->
      <div class="lucky-draw-item">
        <!-- 设置奖项 -->
        <a-select
          v-if="modeType == 1"
          class="lucky-draw-custom"
          placeholder="请选择奖项"
          :disabled="isLuckyDraw"
          @change="handleModeTypeChange"
        >
          <a-select-option
            v-for="(item, index) in customs"
            :key="index"
            :value="item.tag"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
        <!-- 设置抽奖人数 -->
        <a-input
          :class="modeType == 1 ? 'lucky-draw-number-custom' : 'lucky-draw-number'"
          :disabled="isLuckyDraw"
          v-model="numberPeople"
          placeholder="本轮抽奖人数"
        />
        <!-- 抽奖按钮 -->
        <a-button @click="luckyDraw">
          {{ isLuckyDraw ?  luckyDrawTime ? '停止抽奖' : '结束本轮' : '开始抽奖' }}
        </a-button>
      </div>
    </div>
  `,
  data () {
    return {
      // 当前第几轮抽奖
      number: 1,
      tempNumber: 0,
      // 抽奖人数
      numberPeople: undefined,
      // 抽奖状态
      isLuckyDraw: false,
      // 滚动名单
      users: [],
      lastUsers: [],
      // 0 默认抽奖模式，1 自定义抽奖模式
      modeType: 0,
      // 自定义奖项列表
      customs: [],
      customTag: undefined,
      // 是否选择奖项
      isCustomTag: false,
      // 剩余未中奖人数
      surplusUsers: [],
      // 滚动定时器
      luckyDrawTime: undefined
    }
  },
  mounted () {
    // 获取模式
    const modeType = sessionStorage.getItem('modeType')
    if (modeType) {
      this.modeType = Number(modeType)
    } else {
      this.modeType = 0
    }
    // 获取自定义列表
    this.customs = JSON.parse(sessionStorage.getItem('customs')) || []
    // 剩余未中奖人数
    this.surplusUsers = [...users]
  },
  methods: {
    // 切换奖项
    handleModeTypeChange (e) {
      this.customTag = e
      this.isCustomTag = true
    },
    luckyDraw () {
      // 是否在抽奖
      if (this.isLuckyDraw) {
        // 已经开始抽奖，只能停止抽奖
        // 停止抽奖
        this.stopLuckyDraw()
      } else {
        // 准备开始抽奖
        if (this.modeType == 1 && !this.isCustomTag) {
          this.$message.error('请选择奖项')
          return
        }
        if (!this.numberPeople) {
          this.$message.error('请设置抽奖人数')
          return
        }
        if (!REG_IS_INTEGER(this.numberPeople)) {
          this.$message.error('抽奖人数必须为整数')
          return
        }
        if (this.numberPeople <= 0) {
          this.$message.error('抽奖人数必须大于0')
          return
        }
        if (this.numberPeople > users.length) {
          this.$message.error(`抽奖名单共 ${users.length} 人，填写抽奖人数必须小于或等于 ${users.length} 人`)
          return
        }
        // 开始抽奖
        this.startLuckyDraw()
      }
    },
    // 开始抽奖
    startLuckyDraw () {
      if (this.tempNumber != this.number) {
        this.tempNumber = this.number
        stopAnimate('sphere')
        setTimeout(() => {
          this.isLuckyDraw = true
          this.infiniteCycle()
          this.GetUsers()
        }, 2000);
      }
    },
    // 停止抽奖
    stopLuckyDraw () {
      if (this.tempNumber === this.number) {
        if (this.luckyDrawTime) {
          clearInterval(this.luckyDrawTime)
          this.luckyDrawTime = undefined
          this.users = this.lastUsers
        } else {
          this.isLuckyDraw = false
          this.numberPeople = undefined
          this.number += 1
          stopAnimate('grid')
        }
      }
    },
    // 循环名单
    infiniteCycle () {
      if (this.luckyDrawTime) {
        clearInterval(this.luckyDrawTime)
        this.luckyDrawTime = undefined
      }
      this.luckyDrawTime = setInterval(() => {
        this.updateNumberUsers()
      }, 10);
    },
    // 更新抽奖名单
    updateNumberUsers () {
      const tempUsers = []
      var number = 0;
      const total = users.length
      while (number < this.numberPeople) {
        const index = parseInt(Math.random()*total)
        const user = users[index]
        if (user) { tempUsers.push(user) }
        number++;
      }
      this.users = tempUsers
    },
    GetUsers () {
      // 剩余用户
      const surplusUsers = [...this.surplusUsers]
      const lastUsers = []
      // 标记用户
      surplusUsers.forEach(user => {
        // 编号有值
        if (user.number > 0) {
          if (this.modeType == 0) { // 默认抽奖模式
            if (user.number == this.number) {
              if (lastUsers.length < this.numberPeople) {
                lastUsers.push(user)
                const index = this.surplusUsers.indexOf(user)
                if (index !== -1) { this.surplusUsers.splice(index, 1) }
              }
            }
          } else if (this.modeType == 1) { // 自定义奖项模式
            if (user.number == this.customTag && this.customTag != 0) {
              if (lastUsers.length < this.numberPeople) {
                lastUsers.push(user)
                const index = this.surplusUsers.indexOf(user)
                if (index !== -1) { this.surplusUsers.splice(index, 1) }
              }
            }
          } else {}
        }
      })
      // 随机用户
      while (this.surplusUsers.length > 0 && lastUsers.length < this.numberPeople) {
        const index = parseInt(Math.random()*this.surplusUsers.length)
        const user = this.surplusUsers[index]
        if (user) {
          const index = this.surplusUsers.indexOf(user)
          if (index !== -1) {
            lastUsers.push(user)
            this.surplusUsers.splice(index, 1)
          }
        }
      }
      // 打乱顺序
      var length = lastUsers.length
      if (length > 1) {
        for (var i = 0; i < length - 1; i++) {
            var index = parseInt(Math.random() * (length - i));
            var temp = lastUsers[index];
            lastUsers[index] = lastUsers[length - i - 1];
            lastUsers[length - i - 1] = temp;
        }
      }
      // 记录数据
      this.lastUsers = lastUsers
    }
  }
})