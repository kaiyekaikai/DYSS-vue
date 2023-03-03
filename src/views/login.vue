<template>
    <div class="login">
        <div class="container">
            <div class="form-box">
                <!-- 注册表单 -->
                <div class="register-box hidden">
                    <h1>register</h1>
                  <div class="register_form">
                  <el-form :model="form" :rules="rules">
                    <el-form-item>
                      <input v-model="form.email" type="text" placeholder="邮箱">
                    </el-form-item>
                    <el-form-item>
                        <input v-model="form.code" type="text" placeholder="输入验证码" >
                      <el-button id="word1" type="primary" @click="send_code" v-loading="loading_send" v-if="show === 0">
                        发送验证码</el-button>
                      <el-button id="word1" v-if="show === 1" type="info" plain disabled>已发送{{ count }}秒</el-button>
                      <el-button id="word1" type="primary" @click="send_code" v-loading="loading_send" v-if="show === 2">
                        重新获取</el-button>
                    </el-form-item>
                    <el-form-item>
                        <input v-model="form.pwd1" type="password" placeholder="密码">
                    </el-form-item>
                    <el-form-item>
                        <input v-model="form.pwd2" type="password" placeholder="确认密码">
                    </el-form-item>
                    <el-form-item>
                      <el-button class="word1" @click="register()" v-loading="loading_re">注册</el-button>
                    </el-form-item>
                  </el-form>
                  </div>
                </div>
                <!-- 登录 -->
                <div class="login-box">
                    <h1>login</h1>
                    <el-form>
                      <el-form-item>
                        <input type="text" placeholder="用户名">
                      </el-form-item>
                      <el-form-item>
                        <input type="password" placeholder="密码">
                      </el-form-item>
                    <el-form-item>
                      <button>登录</button>
                    </el-form-item>
                  </el-form>
                </div>
            </div>
            <div class="con-box left">
                <h2>欢迎来到<span>Dynamic System</span></h2>
                <img src="../assets/logo.png" alt="">
                <p>已有账号</p>
                <button id="login" @click="goLo">去登录</button>
            </div>
            <div class="con-box right">
                <h2>欢迎来到<span>Dynamic System</span></h2>
                <img src="../assets/logo.png" alt="">
                <p>没有账号？</p>
                <button id="register" @click="goRe">去注册</button>
            </div>
        </div>
		<el-button @click="getKey">获取公钥</el-button>
    </div>
</template>

<script>
// @ is an alias to /src
import {RegisterApi, SendEmailCodeApi} from "@/request/api";
import { RsakeyApi } from "../request/api";
import { encrypt } from "../utlis/jsencrypt";

window.οnlοad = function () {

    // 要操作到的元素
    // let login = document.getElementById('login');
    // let register = document.getElementById('register');
    // let form_box = document.getElementsByClassName('form-box')[0];
    // let register_box = document.getElementsByClassName('register-box')[0];
    // let login_box = document.getElementsByClassName('login-box')[0];
     // 去注册按钮点击事件
     register.addEventListener('click', () => {
         form_box.style.transform = 'translateX(80%)';
         login_box.classList.add('hidden');
         register_box.classList.remove('hidden');
     })
     // 去登录按钮点击事件
    login.addEventListener('click', () => {
         form_box.style.transform = 'translateX(0%)';
         register_box.classList.add('hidden');
        login_box.classList.remove('hidden');
     })
}
export default {
    name: 'register',
    data() {
      //验证邮箱的规则
      const checkEmail = (rules, value, cb)=>{
            //验证邮箱的正则表达式
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if(regEmail.test(value))
                //合法的邮箱
              return cb()
            cb(new Error('请输入正确的邮箱'))
          }
        return {
            loading_send: false,
            loading_lo: false,
            loading_re: false,
            is_send: true,
            show: 0,
            timer: null,
            count: "",
			publicKey:"",
            form: {
                email: "2571091074@qq.com",
                code:"",
                pwd1: "1234",
                pwd2: "1234"
            },
            rules: {
                email: [
                  {
                    required:true ,message:'请输入邮箱', trigger:'blur'
                  },{
                  validator:checkEmail,trigger: 'blur'
                  }
                ],
                pwd1: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
            }
        }
    },
	created() {
		this.getKey()
	},
    methods: {
        goLo() {
            let login = document.getElementById('login');
            let register = document.getElementById('register');
            let form_box = document.getElementsByClassName('form-box')[0];
            let register_box = document.getElementsByClassName('register-box')[0];
            let login_box = document.getElementsByClassName('login-box')[0];
            form_box.style.transform = 'translateX(0%)';
            register_box.classList.add('hidden');
            login_box.classList.remove('hidden');
        },

        goRe() {
            let login = document.getElementById('login');
            let register = document.getElementById('register');
            let form_box = document.getElementsByClassName('form-box')[0];
            let register_box = document.getElementsByClassName('register-box')[0];
            let login_box = document.getElementsByClassName('login-box')[0];
            form_box.style.transform = 'translateX(80%)';
            login_box.classList.add('hidden');
            register_box.classList.remove('hidden');
        },
      send_code(){
          this.loading_send=true;
          SendEmailCodeApi({
            email:this.form.email
          }).then(res=>{
            console.log(res);
            if(res.code===200){
              const times = 60;
              if(!this.timer){
                this.count=times;
                this.show=1;
                this.timer=setInterval(()=>{
                  if(this.count>0&&this.count<=times){
                    this.count--;
                  }else{
                    this.show = 2;
                    clearInterval(this.timer);
                    this.timer=null;
                  }
                },1000)
              }
              this.$message({
                massage:'验证码发送成功，五分钟内有效',
                type:'success'
              });
            }
            this.loading_send=false;
          })
        },
		getKey(){
			RsakeyApi().then(res=>{
				this.publicKey=res.data;
				localStorage.setItem('publicKey',res.data);
				
				console.log("公钥是"+localStorage.getItem('publicKey'))
			})
		},
      register() {
      
        const jse = new this.$jsEncrypt();
        jse.setPublicKey(this.publicKey);
        let passWord = encrypt(this.form.pwd1);
        let okpassWord = jse.encrypt(this.form.pwd2);
				RegisterApi({
          email: this.form.email,
          code: this.form.code,
          password: passWord,
          okpassword: okpassWord
        }).then(res => {
          console.log(res)
        })
				  }
			  // })
		   // }
		},
}
</script>

<style lang="less" scoped>
.login {
    /* 100%窗口高度 */
    height: 100vh;
    /* 弹性布局 水平+垂直居中 */
    display: flex;
    justify-content: center;
    align-items: center;
    /* 渐变背景 */
    background: linear-gradient(200deg, #a14c59, #4778c2);
     //容器的样式
    .container {
      background-color: #4871aa;
      width: 650px;
      height: 415px;
      border-radius: 5px;
      /* 阴影 */
      box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
      /* 相对定位 */
      position: relative;
        //注册和登录表单的样式
        .form-box {
          /* 绝对定位 */
          position: absolute;
          top: -20%;
          left: 5%;
          background-color: #9e66a8;
          width: 320px;
          height: 550px;
          border-radius: 5px;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          display: inline-flex;
          justify-content: center;
          align-items: center;
          z-index: 2;
          /* 动画过渡 加速后减速 */
          transition: 0.5s ease-in-out;
        }
      .el-form-item{
        margin-bottom: 0px;
      }

  }
}
//注册盒子和登录盒子的样式
.register-box,
.login-box {
    /* 弹性布局 垂直排列 */
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.hidden {
    display: none;
    transition: 0.5s;
}

h1 {
    text-align: center;
    margin-bottom: 25px;
    /* 大写 */
    text-transform: uppercase;
    color: #fff;
    /* 字间距 */
    letter-spacing: 5px;
}
//登陆盒子输入框的样式
.login-box input {
    background-color: transparent;
    width: 85%;
    color: #e0a5a5;
    border: none;
    /* 下边框样式 */
    border-bottom: 1px solid rgba(45, 18, 18, 0.4);
    padding: 10px 0;
    text-indent: 10px;
    margin: 8px 0;
    font-size: 14px;
    letter-spacing: 2px;
}

.register-box input {
  background-color: transparent;
  width: 55%;
  color: #e89292;
  border: none;
  /* 下边框样式 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  padding: 10px 0;
  text-indent: 10px;
  margin: 8px 0;
  font-size: 14px;
  letter-spacing: 2px;
}
input::placeholder {
    color: #fff;
}

input:focus {
    color: #dcb5e3;
    outline: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
    transition: 0.5s;
}

input:focus::placeholder {
    opacity: 0;
}

//盒子内按钮的样式
.form-box button {
    position: relative;
    width: 85%;
    margin-top: 35px;
    background-color: #c4b2b2;
    outline: none;
    border-radius: 8px;
    padding: 13px;
    color: #a262ad;
    letter-spacing: 2px;
    border: none;
    cursor: pointer;
}

#word1{
  position: relative;
  width: 45%;
  margin-top: 16px;
  background-color: #afc8d0;
  outline: none;
  border-radius: 8px;
  padding: 13px;
  color: #a262ad;
  letter-spacing: 2px;
  border: none;
  cursor: pointer;
}

.form-box button:hover {
    background-color: #a262ad;
    color: #f6f6f6;
    transition: background-color 0.5s ease;
}

.con-box {
    width: 50%;
    /* 弹性布局 垂直排列 居中 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* 绝对定位 居中 */
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}

.con-box.left {
    left: -2%;
}

.con-box.right {
    right: -2%;
}

.con-box h2 {
    color: #8e9aaf;
    font-size: 25px;
    font-weight: bold;
    letter-spacing: 3px;
    text-align: center;
    margin-bottom: 4px;
}

.con-box p {
    font-size: 12px;
    letter-spacing: 2px;
    color: #8e9aaf;
    text-align: center;
}

.con-box span {
    color: #d3b7d8;
}

.con-box img {
    width: 150px;
    height: 150px;
    opacity: 0.9;
    margin: 40px 0;
}

.con-box button {
    margin-top: 3%;
    background-color: #eea2a2;
    color: #a262ad;
    border: 1px solid #d3b7d8;
    padding: 6px 10px;
    border-radius: 5px;
    letter-spacing: 1px;
    outline: none;
    cursor: pointer;
}

.con-box button:hover {
    background-color: #d3b7d8;
    color: #fff;
}
.word{
  width: 70%;
  margin-top: 35px;
  background-color: #ffffff;
  outline: none;
  border-radius: 8px;
  padding: 13px;
  color: #a262ad;
  letter-spacing: 2px;
  border: none;
  cursor: pointer;
}
img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
</style>
