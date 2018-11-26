<template>
	<div>
		<el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="150px" class="demo-ruleForm">
			<el-form-item label="商品名" prop="shop_name">
				<el-input v-model="ruleForm2.shop_name" value="" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="排序坐标" prop="item_index">
				<el-input type="number" v-model="ruleForm2.item_index" value="" auto-complete="off"></el-input>
			</el-form-item>
			<el-row :gutter="20">
			  <el-col :span="12">
			  	<div class="grid-content bg-purple">
			  		<el-form-item label="价格" prop="goods_price">
			  			<el-input type="number" value="" v-model.number="ruleForm2.goods_price"></el-input>
			  		</el-form-item>
			  	</div>
			  </el-col>
			  <el-col :span="12">
			  	<div class="grid-content bg-purple">
			  		<el-form-item label="数量" prop="goods_stock">
			  			<el-input value=""  v-model.number="ruleForm2.goods_stock"></el-input>
			  		</el-form-item>
			  	</div>
			  </el-col>
			</el-row>
			<el-form-item label="服务说明" prop="server">
				<el-select v-model="ruleForm2.server" placeholder="请选择">
				    <el-option
				      v-for="item in serviceOptions"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				 </el-select>
			    
			    <el-button class="service" v-if="service01">7天退还<i class="el-icon-close"  @click.prevent="removeDomain($event,1)"></i></el-button>
			    <el-button class="service" v-if="service02">48小时发货<i class="el-icon-close" @click.prevent="removeDomain($event,2)"></i></el-button>
			    <el-button class="service" v-if="service03">全场包邮<i class="el-icon-close"  @click.prevent="removeDomain($event,3)"></i></el-button>
			    <el-button class="service" v-if="service04">假一赔十<i class="el-icon-close"  @click.prevent="removeDomain($event,4)"></i></el-button>
			    
			 </el-form-item>
			 <el-form-item label="是否上架" prop="good_state">
			    <el-radio-group v-model="ruleForm2.good_state">
			      <el-radio label="是"></el-radio>
			      <el-radio label="否"></el-radio>
			    </el-radio-group>
			  </el-form-item>
			 
			<el-form-item label="商品列表图">
				<el-upload
				  class="upload-demo"
				  multiple
				  :action="admin_add_goods"
				  :on-success="handlePreview"
				  :on-remove="handleRemove"
				  list-type="picture">
				  <el-button size="small" type="primary">点击上传</el-button>
				  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
			</el-form-item>
			
			<el-form-item label="详情轮播图">
				<el-upload
				  class="upload-demo"
				  multiple
				  :action="admin_add_goods"
				  :on-success="handlePreview2"
				  :on-remove="handleRemove2"
				  list-type="picture">
				  <el-button size="small" type="primary">点击上传</el-button>
				</el-upload>
			</el-form-item>
			
			<el-form-item label="抽奖钻石挡位">
				<el-row :gutter="20">
				  <el-col :span="5">
				  	<div class="grid-content bg-purple">
				  		<el-input value="10"></el-input>
				  	</div>
				  </el-col>
				  <el-col :span="5">
				  	<div class="grid-content bg-purple">
				  		<el-input value="20"></el-input>
				  	</div>
				  </el-col>
				  <el-col :span="5">
				  	<div class="grid-content bg-purple">
				  		<el-input value="30"></el-input>
				  	</div>
				  </el-col>
				  <el-col :span="5">
				  	<div class="grid-content bg-purple">
				  		<el-input value="50"></el-input>
				  	</div>
				  </el-col>
				</el-row>
			</el-form-item>	
			
			<el-form-item label="单次抽奖消耗" prop="single">
				<el-input value="" v-model="ruleForm2.single"></el-input>
			</el-form-item>	
			
			<el-form-item label="详情介绍图">
				<el-upload
				  class="upload-demo"
				  multiple
				  :action="admin_add_goods"
				  :on-success="handlePreview3"
				  :on-remove="handleRemove3"
				  list-type="picture">
				  <el-button size="small" type="primary">点击上传</el-button>
				</el-upload>
			</el-form-item>	
			
			<el-form-item label="配送方式" prop="myMode">
				<el-select placeholder="全场包邮" v-model="ruleForm2.myMode">
			      <el-option label="包邮" value="包邮"></el-option>
			    </el-select>
			    
			    <el-button class="service" @click.prevent="removeDomain(domain)">包邮</el-button>
			</el-form-item>	
			
			<el-form-item label="订单存活时长" prop="time">
				<el-input class="orderTime" value="" v-model="ruleForm2.time"></el-input>
				<label>小时</label>
				
			</el-form-item>	
			<el-form-item>
				<el-button type="primary" @click="submitForm('ruleForm2')">添加</el-button>
				<el-button @click="resetForm('ruleForm2')">重置</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import { Constants } from '@/utils/config.js'

	export default {
    data() {
      return {
      	admin_add_goods: Constants.DOMAIN_URL+'/admin_add_goods',
      	service01: true,
      	service02: true,
      	service03: true,
      	service04: true,
      	serviceOptions: [{
          value: '选项1',
          label: '7天退还'
        }, {
          value: '选项2',
          label: '48小时发货'
        }, {
          value: '选项3',
          label: '全场包邮'
        }, {
          value: '选项4',
          label: '假一赔十'
        }],
        fileImg: [],
        fileImg2: [],
        fileImg3: [],
        ruleForm2: {
          shop_name: '',
          item_index: '',
          goods_price: '',
          goods_stock: '',
          good_state: '',
          single: '',
          time: '',
          server:'',
          myMode: '',
        },
        rules2: {
          shop_name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
            { min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur' }
          ],
          item_index: [
          	{required: true, message: '请输入排序坐标', trigger: 'blur'}
          ],
          goods_price: {
          	required: true, message: '请输入价格', trigger: 'blur'
          },
          goods_stock: {
          	required: true, message: '请输入数量', trigger: 'blur'
          },
          good_state: [
          	{required: true, message: '请选择一个', trigger: 'blur'}
          ],
          single: [
          	{required: true, message: '请输入单次抽奖消耗', trigger: 'blur'}
          ],
          time: [
          	{required: true, message: '请输入存活时长', trigger: 'blur'}
          ]
        }
      };
    },
    
    methods: {
      //商品列表图片上传
      handleRemove(file, fileList) {
        this.fileImg = []
        
        this.fileListBase(this.fileImg,fileList)
      },
      handlePreview(response, file, fileList) {
      	this.fileListBase(this.fileImg,fileList)
      },
      
      //商品详情轮播图片上传
      handleRemove2(file, fileList) {
        this.fileImg2 = []
        
        this.fileListBase(this.fileImg2,fileList)
      },
      handlePreview2(response, file, fileList) {
      	this.fileListBase(this.fileImg2,fileList)
      },
      
      //商品详情介绍图片上传
      handleRemove3(file, fileList) {
        this.fileImg3 = []
        
        this.fileListBase(this.fileImg3,fileList)
      },
      handlePreview3(response, file, fileList) {
      	this.fileListBase(this.fileImg3,fileList)
      },
      
      //图片上传公共方法
      fileListBase(fileImg, fileList) {
      	fileList.forEach((item, index) => {
        	fileImg.push(item)
        })
      },
      
      //服务说明删除
      removeDomain(data, index) {
  		if (index == 1) this.service01 = false
  		if (index == 2) this.service02 = false
  		if (index == 3) this.service03 = false
  		if (index == 4) this.service04 = false
      },
      submitForm(formName) {
      	const self = this
        self.$refs[formName].validate((valid) => {
          if (valid) {
//        	const config = {
//        		name: self.ruleForm2.shop_name
//        		price: self.ruleForm2.goods_price
//        		goods_type:
//        		flag:
//        		diamond_gear:
//        		single_draw_diamond:
//        		seven_days_change: 
//        		two_days_deliver:
//        		all_free_deliver:
//        		all_real:
//        		discount_times:
//        		good_id:
//        		goods_banner_list:
//        		home_img:
//        		img_info_list:
//        	}
//        	name  产品名
//			price 价格
//			stock 库存
//			goods_type  类型
//			flag  上下架
//			diamond_gear  砖石档位
//			single_draw_diamond  单次抽奖消耗
//			seven_days_change  7天包换
//			two_days_deliver  48小时发货
//			all_free_deliver  全场包邮
//			all_real  假一赔十
//			discount_times  折扣结束时间
//			good_id 修改   商品修改时传
//			goods_banner_list  商品轮播图图片
//			home_img 商品首页图
//			img_info_list  商品详情图片
//
//        	self.fileImg
//        	self.fileImg2
//        	self.fileImg3
//          
//		    self.ruleForm2.item_index
//		    
//		    self.ruleForm2.goods_stock
//		    self.ruleForm2.good_state
//		    self.ruleForm2.single
//		    self.ruleForm2.time
//		    self.ruleForm2.server
//		    self.ruleForm2.myMode
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
.demo-ruleForm
	width: 70%
	.service
		margin-left: 20px
	.orderTime
		width: 30%
		margin-right: 20px
	.el-icon-close
		padding-left: 10px
</style>