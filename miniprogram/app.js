App({
  onLaunch: function() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser:true,
        env: "xiaofangzifun-07-0fr2gil60c02345",
        // database: "scond - 067da5",
        // storage:"scond-067da5",
        // functions:"scond-067da5"
      })
      this.openid();
      console.log("app.js");
    }
  },
  onShow: function() {
   
    
  },
  onHide: function() {
    
  },
  globalData: {
    crats_value: [],
    new_product:[],
    selected_crats: [],
    selected_crats1: [],
    hasLogin: false,
    openid:'',
    register:false,
  },
  
  openid() {
    var that=this;
    const db=wx.cloud.database();
    wx.cloud.callFunction({
      name: 'login',
      success:(res) =>{

        console.log(res);
       that.globalData.openid=res.result.openid
        // console.log(that.globalData.openid)
        db.collection("register").where({
          _openid: that.globalData.openid
        }).get({
          success(res){
            if(res.data.length!=0){
              that.globalData.register=true;
            }
          }
        })
      },
     
    })
  },
  _time() {
    var date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    var time = year + '/' + month + '/' + day + '/' + hour + '/' + minute + second;
    return time;
  },
  time() {
    var date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    var time = year + '-' + month + '-' + day + ' ' + hour + '时' + minute +'分'+ second+'秒';
    return time;
  },
  getWidth_height() {
    let windowHeight = wx.getSystemInfoSync().windowHeight; // 屏幕的高度  
    let windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕的宽度    
    return windowHeight * 750 / windowWidth;
  }
})