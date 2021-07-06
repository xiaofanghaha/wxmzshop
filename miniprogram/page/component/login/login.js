const app = getApp();
Page({
  data: {
    flag: false,
    phone: '',
    password: '',
    currentTab: 1,
    //register: [],
    openid: '',
    //member: [],
    registerNum: '',
    registerPassword: '',
    registerName: '',
    codename: '获取验证码',
    disabled: false,
    code: '',
    code1: '',
    time_stamp: ''
  },
  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  }, // 获取输入密码 
  passwordInput: function(e) {
    this.setData({
      password: e.detail.value
    })
  },
  //登陆注册点击事件
  clickTab: function(e) {
    const click = e.target.dataset.current;
    this.setData({
      currentTab: click,
    })
    //在登陆时清除注册里面的缓存，以免出错
    if (this.data.currentTab == 0) {
      this.setData({
        registerNum: '',
        registerPassword: '',
        registerName: '',
        code: '',
        code: ''
      })
    }
  },
 
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '登陆注册' //修改title
    })
    var that = this;

    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        console.log('callFunction test result: ', res)
      },
      success(res) {
        that.setData({
          openid: res.result.openid
        })
      }
    })
  },
  //注册姓名
  name: function(e) {
    this.setData({
      registerName: e.detail.value
    })
  },
  //注册电话号码
  phoneNumber: function(e) {
    this.setData({
      registerNum: e.detail.value
    })
  },
  password: function(e) {
    this.setData({
      registerPassword: e.detail.value
    })
  },
  //注册获取验证码
  codeInput: function(e) {
    this.setData({
      code1: e.detail.value
    })
  },
  stratTime: function() {
    var that = this;
    const date = new Date();
    const week = date.getDay();
    var stratTime = 0;
    var stratHours = 0;
    var years = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (date.getHours() < 10) {
      stratHours = '0' + date.getHours();
    } else {
      stratHours = date.getHours();
    }
    if (date.getMinutes() < 10) {
      stratTime = stratHours + ':' + '0' + date.getMinutes();
    } else {
      stratTime = stratHours + ':' + date.getMinutes();
    }
    that.setData({
      stratTime: stratTime,
      time_stamp: years + '/' + month + '/' + day + ' ' + stratTime
    })
  },
  //注册按钮
  mustRegister: function() {
    var that = this;
    that.stratTime();
    const db = wx.cloud.database();
    if (that.registerRequst()) {
      db.collection("register").where({
        _openid: that.data.openid
      }).get({
        success(res) {
          if (res.data.length != 0) {
            wx.showModal({
              content: '该微信号已经被注册',
              icon: 'loading',
              duration: 2000,
              showCancel: false,
              mask: true,
            })
          } else {
            db.collection("register").add({
              data: {
                "name": that.data.registerName,
                "telephone": that.data.registerNum,
                // "password": that.data.registerPassword,
                "birthday": '',
                "address": '',
                "mail": '',
                jifen_value: 0,
                password:that.data.registerPassword,
              }
            }).then((res) => {
              wx.showToast({
                title: '注册成功',
                icon: 'success',
                mask: true,
              })
              setTimeout(function() {
                wx.showLoading({
                  title: '正在跳转',
                })
                setTimeout(function() {
                  wx.hideLoading();
                  app.globalData.register=true;
                 wx.navigateBack({
                   
                 })
                }, 3000)
              }, 2000)
            })
          }
        },
        complete(res) {
          console.log(res)
        }
      })
    }
  },
  //注册要求,满足要求即可注册
  registerRequst: function() {
    var a = this.data.phone;
    var _this = this;
    var password = /^[0-9]{6}$/;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (_this.data.registerName == "") {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
      return false;
    }
    if (this.data.registerNum == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
      return false;
    } else if (!myreg.test(this.data.registerNum)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
      return false;
    }
    else if (!password .test(this.data.registerPassword)){
      console.log(this.data.registerPassword);
      wx.showToast({
        title: '请输入六位数字密码',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
      return false;
    }
    // }else if (_this.data.registerPassword == "") {
    //   wx.showToast({
    //     title: '密码不能为空',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return false;
    // } 
    else if (_this.data.code1 == "") {
      wx.showToast({
        title: "请输入验证码",
        icon: 'none',
        duration: 1000,
        mask: true,
      })
      return false;
    } else if (_this.data.code != _this.data.code1) {
      wx.showToast({
        title: "输入验证码错误",
        icon: 'none',
        duration: 1000,
        mask: true,
      })
      return false;
    } else {
      return true;
    }
  },
  //获取验证码
  gainCode: function() {
    var a = this.data.phone;
    var _this = this;
    var code = '';
    var password = /^[0-9]{6}$/;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (_this.data.registerName == "") {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
      return false;
    }
    if (this.data.registerNum == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
      return false;
    } else if (!myreg.test(this.data.registerNum)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
      return false;
    // } else if (_this.data.registerPassword == "") {
    //   wx.showToast({
    //     title: '密码不能为空',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return false;
    } else if (!password.test(this.data.registerPassword)) {
      wx.showToast({
        title: '请输入六位数字密码',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
      return false;
    } 
    else {
      for (var i = 0; i < 4; i++) {
        code += Math.floor(Math.random() * 10);
      }
      _this.setData({
        code: 123456
      })
          var num = 60;
          var timer = setInterval(function() {
            num--;
            if (num <= 0) {
              clearInterval(timer);
              _this.setData({
                codename: '重新发送',
                disabled: false,
              })
            } else {
              _this.setData({
                codename: num + "s",
                disabled: true
              })
            }
          }, 1000)
          return true;
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})
