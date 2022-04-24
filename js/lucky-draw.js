new Vue({
  el: '#app',
  template: `

  <div class="lucky-draw-view">
  	<table heigh="100%">
  		<!-- 标题 -->
  		<tr>
  			<td colspan="3">
  				<div id="title_div" class="lucky-draw-title">
  				</div>
  			</td>
  		</tr>
  		<tr>
  			<td colspan="3">
  				<div class="lucky-draw-view">
  					<!-- 抽签显示页面 -->
  					<div :class="isLuckyDraw ? 'lucky-draw-content lucky-draw-start' : 'lucky-draw-content'">
  						<div :class="isLuckyDraw ? 'lucky-draw-users lucky-draw-users-start' : 'lucky-draw-users'">
  							<div class="lucky-draw-user" v-for="item in users" :key="index">
  								<div class="lucky-draw-user-name">
  									{{ item.name }}
  								</div>
  								<div class="lucky-draw-user-department">
  									{{ item.department }}
  								</div>
  							</div>
  							<div v-if="!users.length && !surplusUsers.length" class="lucky-draw-empty">
  								抽签完毕，已经全部抽中！
  							</div>
  						</div>
  					</div>
  			</td>
  		</tr>
  		<tr>
  			<td>
  			</td>
  			<td>
  				<!-- 设置抽签项目，数量，并开始抽签 -->
  				<div>
  					<table class="lucky-draw-table">
  						<!-- 设置抽签项目 -->
  						<tr height="32px">
  							<td width="80px">
  								<span v-if="modeType == 1" :disabled="isLuckyDraw">
  									本轮项目
  								</span>
  							</td>
  							<td width="160px">
  								<a-select v-if="modeType == 1" class="lucky-draw-custom" placeholder="抽签项目"
  								:disabled="isLuckyDraw" @change="handleModeTypeChange">
  									<a-select-option v-for="(item, index) in customs" :key="index" :value="index"
  									:item="item">
  										{{ item.name }}
  									</a-select-option>
  								</a-select>
  							</td>
  						</tr>
  						<tr height="32px">
  							<td width="80px">
  								本轮数量
  							</td>
  							<td width="160px" align="center">
  								<!-- 设置抽签数量 -->
  								<tr>
  									<td>
  										<div class="numberPeople-style" @click="numberPeopleChange(0)">
  											<a-button shape="circle" icon="arrow-down" :disabled="isLuckyDraw" />
  										</div>
  									</td>
  									<td>
  										<a-input :class="modeType == 1 ? 'lucky-draw-number-custom' : 'lucky-draw-number'"
  										:disabled="isLuckyDraw" readonly="true" v-model="numberPeople" placeholder="抽签数量"
  										/>
  									</td>
  									<td>
  										<div class="numberPeople-style" @click="numberPeopleChange(1)">
  											<a-button shape="circle" icon="arrow-up" :disabled="isLuckyDraw" />
  										</div>
  									</td>
  								</tr>
  							</td>
  						</tr>
  						<tr height="50px">
  							<td colspan="2">
  								<!-- 抽签按钮 -->
  								<a-button @click="luckyDraw">
  									{{ isLuckyDraw ? luckyDrawTime ? '停止抽签' : '结束本轮' : '开始抽签' }}
  								</a-button>
  							</td>
  						</tr>
  					</table>
  				</div>
  			</td>
  			<td>
  				<div>
  					<!-- 右边工具栏 -->
  					<table>
  						<tr>
  							<td>
                <div>
                    <form action="">
                        <div class="lucky-draw-tool-bgimage" @click="document.getElementById('bgImageFile').click()">
                          <a-button shape="circle" icon="picture" :disabled="isLuckyDraw">
                            <input type="file" id="bgImageFile" style="display:none" accept="image/x-png,image/jpeg" @change="loadImageFile">
                          </a-button>
                        </div>
                    </form>
                </div>
  							</td>
  							<td>
  								<div class="lucky-draw-tool-download" @click="downloadWinningUsers">
  									<a-button shape="circle" icon="download" :disabled="isLuckyDraw" />
  								</div>
  							</td>
  							<td>
  								<div class="lucky-draw-tool-setting" @click="linkHomepage">
  									<a-button shape="circle" icon="setting" :disabled="isLuckyDraw" />
  								</div>
  							</td>
  						</tr>
  					</table>
            <div>
  			</td>
  		</tr>
  	</table>
  </div>
  `,

  data () {
    return {
      // 当前第几轮抽签
      number: 1,
      tempNumber: 0,
      // 抽签数量
      numberPeople: 1,
      // 抽签状态
      isLuckyDraw: false,
      // 滚动名单
      users: [],
      lastUsers: [],
      // 0 默认抽签模式，1 自定义抽签模式
      modeType: 0,
      // 0 允许重复，1 不允许重复
      modeDuplicate: 0,
      // 最大抽签数量 电脑 10 手机 5
      maxDrawNumber: 10,
      // 自定义奖项列表
      customs: [],
      // 当前选中奖项
      custom: undefined,
      // 中奖人员
      winningUsers: [],
      // 剩余未中奖人数
      surplusUsers: [],
      // 滚动定时器
      luckyDrawTime: undefined,
      // 标题
      isTitle: undefined,
      // 背景图片
      bgImageNumber: 9,
      bgImageDir: ["image/background/picture/BG-", "image/background/color/BG-"],
      bgImageFile: ["01", "02", "03", "04", "05", "06", "07", "08", "09"],
      bgImageIndex: 0,
      isColor: 0,
    }
  },

  beforeDestroy(){
    // 离开页面的时候清除
      this.clearBodyBackGround()
},

  mounted () {

    document.body.style.backgroundColor = "#888888";

    //手机还是PC界面
    this.isPhoneView()

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

    // 进入页面时，动态添加body图片
    this.setBodyBackGround()

    // 获取标题
    const isTitle = localStorage.getItem('isTitle')
    if (isTitle) {
      this.isTitle = isTitle
    } else {
      this.isTitle = "Lucky Draw"
    }

    obj_div = document.getElementById("title_div");
    obj_div.innerHTML = this.isTitle;

    // 获取模式
    const modeType = localStorage.getItem('modeType')
    if (modeType) {
      this.modeType = Number(modeType)
    } else {
      this.modeType = 0
    }

    // 获取重复模式
    const modeDuplicate = localStorage.getItem('modeDuplicate')
    if (modeDuplicate) {
      this.modeDuplicate = Number(modeDuplicate)
    } else {
      this.modeDuplicate = 0
    }

    // 获取自定义列表
    this.customs = JSON.parse(localStorage.getItem('customs')) || []
    // 剩余未中奖人数
    this.surplusUsers = [...users]
    // 获取中奖用户
    this.winningUsers = JSON.parse(localStorage.getItem('winning-users')) || []
    // 初始化轮数
    this.tempNumber = this.winningUsers.length
    this.number = this.tempNumber + 1

    // 清理中奖用户
    if (this.modeDuplicate == 1) {
      this.winningUsers.forEach(item => {
        // 解析ids
        const ids = item.ids.split('、').map(Number)
        // 移除中奖id
        ids.forEach(id => {
          // 定位中奖用户
          const index = this.surplusUsers.findIndex(user => user.id === id)
          // 从剩余用户清单中移除
          if (index !== -1) { this.surplusUsers.splice(index, 1) }
        })
      })
    }
  },

  methods: {
    //用本地图片做背景
    loadImageFile() {
      var url
      if (navigator.userAgent.indexOf("MSIE") >= 1) { // IE
        url = document.getElementById("bgImageFile").value
      } else if (navigator.userAgent.indexOf("Firefox") > 0) { // Firefox
        url = window.URL.createObjectURL(document.getElementById("bgImageFile").files.item(0))
      } else if (navigator.userAgent.indexOf("Chrome") > 0) { // Chrome
          url = window.URL.createObjectURL(document.getElementById("bgImageFile").files.item(0))
      }
      url = "url(" + url + ")"
      document.body.style.backgroundPosition="center";
      document.body.style.backgroundRepeat="no-repeat";
      document.body.style.backgroundAttachment="fixed";
      document.body.style.backgroundImage = url
    },

    //手机还是PC页面
    isPhoneView () {
      var userAgentInfo = navigator.userAgent
      var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"]
      var flag = true
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
           flag = false
           break
        }
      }
      if (flag) {
        this.maxDrawNumber = 10
      } else {
        this.maxDrawNumber = 5
      }
    },

    // 动态添加body图片
    setBodyBackGround (e) {
      var bgImageIndex = 0;
      if (this.bgImageIndex > 0) {
        this.bodyBgImage = "url(" + this.bgImageDir[this.isColor] + this.bgImageFile[this.bgImageIndex - 1] + ".png)"
      } else {
        bgImageIndex = ~~(Math.random() * this.bgImageNumber);
        this.bodyBgImage = "url(" + this.bgImageDir[this.isColor] + this.bgImageFile[bgImageIndex] + ".png)"
      }
      document.body.style.backgroundImage = this.bodyBgImage
    },

    // 清除body背景图
    clearBodyBackGround () {
        document.body.style.backgroundImage = ''
    },

    // 加减数量
    numberPeopleChange (e) {
      if (e == 0 && this.numberPeople > 1) {
        this.numberPeople = this.numberPeople - 1;
      } else if (e == 1 && this.numberPeople < this.maxDrawNumber) {
        this.numberPeople = this.numberPeople + 1;
      }
    },

    // 切换奖项
    handleModeTypeChange (value, e) {
      // 记录奖项
      this.custom = e.data.attrs.item
    },

    luckyDraw () {
      // 是否在抽签
      if (this.isLuckyDraw) {
        // 已经开始抽签，只能停止抽签
        // 停止抽签
        this.stopLuckyDraw()
      } else {
        // 准备开始抽签
        if (this.modeType == 1 && !this.custom) {
          this.$message.error('请选择抽签项目')
          return
        }
        if (!this.numberPeople) {
          this.$message.error('请设置抽签数量')
          return
        }
        if (!REG_IS_INTEGER(this.numberPeople)) {
          this.$message.error('抽签数量必须为整数')
          return
        }
        if (this.numberPeople <= 0) {
          this.$message.error('抽签数量必须大于0')
          return
        }
        if (this.numberPeople > users.length) {
          this.$message.error(`抽签清单共 ${users.length} 项，填写抽签数量必须小于或等于 ${users.length} `)
          return
        }
        if (this.numberPeople > this.maxDrawNumber) {
          this.$message.error(`抽签数量超出范围`)
          return
        }
        // 开始抽签
        this.startLuckyDraw()
      }
    },

    // 开始抽签
    startLuckyDraw () {
      if (this.tempNumber != this.number) {
        this.tempNumber = this.number
        stopAnimate('sphere')
        setTimeout(() => {
          this.isLuckyDraw = true
          this.infiniteCycle()
          this.GetUsers()
        }, 3000);
      }
    },

    // 停止抽签
    stopLuckyDraw () {
      if (this.tempNumber === this.number) {
        if (this.luckyDrawTime) {
          clearInterval(this.luckyDrawTime)
          this.luckyDrawTime = undefined
          this.users = this.lastUsers
          this.saveWinningUsers()
        } else {
          this.isLuckyDraw = false
          //this.numberPeople = 1
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

    // 更新抽签名单
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
          if (this.modeType == 0) { // 默认抽签模式
            if (user.number == this.number) {
              if (lastUsers.length < this.numberPeople) {
                lastUsers.push(user)
                const index = this.surplusUsers.indexOf(user)
                if (index !== -1) { this.surplusUsers.splice(index, 1) }
              }
            }
          } else if (this.modeType == 1) { // 自定义奖项模式
            if (user.number == this.custom.tag && this.custom.tag != 0) {
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
    },
    // 保存中奖名单
    saveWinningUsers () {
      // 处理名称
      var usernames = []
      var userids = []
      this.lastUsers.forEach(user => {
        // 名称
        if (user.department) {
          usernames.push(`${user.name}(${user.department})`)
        } else {
          usernames.push(user.name)
        }
        // id
        userids.push(user.id)
      })
      // 记录
      this.winningUsers.push({
        round: this.number,
        award: this.custom ? this.custom.name : '',
        names: usernames.join('、'),
        ids: userids.join('、')
      })
      // 保存
      localStorage.setItem('winning-users', JSON.stringify(this.winningUsers))
    },

//inwork
    //将本地图片设为页面背景
    setLoaclImage () {
      var url
      if (navigator.userAgent.indexOf("MSIE") >= 1) { // IE
            this.$message.error(1)

      } else if (navigator.userAgent.indexOf("Firefox") > 0) { // Firefox

        this.$message.error(2)
      } else if (navigator.userAgent.indexOf("Chrome") > 0) { // Chrome

        this.$message.error(url)
      } else {
        this.$message.error('浏览器不支持上传图片')
      }
      //this.$message.error(url)
      //document.body.style.backgroundImage = url
    },

    //返回首页
    linkHomepage () {
      window.location.href = 'index.html'
    },

    // 下载中奖名单
    downloadWinningUsers () {
      // 列名称
      const columns = [
        {
          name: '轮数',
          field: 'round',
          style: {
            color: '#000000',
            alignmentHor: 'Center',
            alignmentVer: 'Center'
          }
        },
        {
          name: '奖项',
          field: 'award',
          style: {
            color: '#000000',
            alignmentHor: 'Center',
            alignmentVer: 'Center'
          }
        },
        {
          name: '中奖用户',
          field: 'names',
          style: {
            colWidth: 888,
            color: '#000000',
            //borderColor: '#D5DBEA',
            //backgroundColor: '#00FFFF'
          }
        }
      ]
      // 将要保存的 sheets 数据源
      const sheets = [
        {
          // 单个 sheet 名字
          name: '中奖名单',
          // 单个 sheet 数据源
          data: this.winningUsers,
          // 单个 sheet 列名称与读取key
          columns: columns
        }
      ]
      // 下载
      EXDownloadManager(sheets, function (item, field, json, sheetIndex, row, col, columnCount, rowCount) {
        // 处理标题行
        if (row === 0) {
          // 内容横向排版：Left、Center、Right
          item.style.alignmentHor = 'Center'
          // 内容竖向排版：Top、Center、Bottom
          item.style.alignmentVer = 'Center'
          // 行高
          item.style.rowHeight = 32
        }
        // 返回
        return item
      })
    }
  }
})
