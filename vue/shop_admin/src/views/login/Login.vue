<template>
	<div class="login-wrap">
		<div class="title box-c">
			<h1>乐呵呵商城后台管理系统</h1>
			<div class="login-top">
				<el-form :model="ruleForm2" size="medium" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
				   <el-form-item label="用户名" prop="users">
				     <el-input v-model="ruleForm2.users" auto-complete="off"></el-input>
				   </el-form-item>
				   <el-form-item label="密码" prop="pass">
				     <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
				   </el-form-item>
				   <el-form-item>
				  	 <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
				   </el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
export default {
	name: "Login",
	data(){
    var validatePass2 = (rules2, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
	return {
		ruleForm2: {
		  users: '',
          pass: '',
        },
        rules2: {
          users: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          pass: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ]
        }
	}
},
	methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            window.location = '/index.html'
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
}
</script>
<style lang="stylus" scoped>
.login-wrap
	width: 100%
	height: 100%
	display: flex
	flex-direction: row
	justify-content: center
	align-items: center
	overflow: hidden
	.title
		color: #409eff
		.login-top
			margin-top: 30px
			
</style>