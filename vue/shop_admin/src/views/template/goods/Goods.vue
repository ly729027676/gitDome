<template>
	<div>
		<el-row class="goods-bottom" :gutter="20">
		  <el-col :span="12">
		  	<div class="btn-left">
				<el-button type="primary" size="medium" icon="el-icon-delete" @click="deleteGoods">删除</el-button>
				<el-button type="primary" size="medium" icon="el-icon-edit-outline" @click="addTab">添加商品</el-button>
			</div>
		  </el-col>
		  <el-col :span="12" >
		  	<el-row type="flex" justify="end" :gutter="20">
		  		<el-col :span="6">
		  		<el-input v-model="goods_id" size="medium" placeholder="商品ID"></el-input>
		  		</el-col>
		  		<el-col :span="6">
		  		<el-input v-model="goods_name" size="medium" placeholder="商品名"></el-input>
		  		</el-col>
		  		<el-col :span="3" style="margin-right: 4px;padding:0">
		  		<el-button type="primary" size="medium" icon="el-icon-search" @click="search">搜索</el-button>
		  		</el-col>
		  	</el-row>
		  </el-col>	
		</el-row>

		<el-table :data="tableData" border style="width: 100%" @selection-change="selectionGoods">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column fixed prop="goods_id" label="商品ID" width="150">
				<template slot-scope="scope">{{ scope.row.goods_id }}</template>
			</el-table-column>
			<el-table-column prop="goods_name" label="商品名" width="300">
			</el-table-column>
			<el-table-column prop="item_index" label="排序坐标" width="150">
			</el-table-column>
			<el-table-column prop="goods_look" label="浏览" width="150">
			</el-table-column>
			<el-table-column prop="goods_price" label="价格" width="150">
			</el-table-column>
			<el-table-column prop="goods_stock" label="库存" width="150">
			</el-table-column>
			<el-table-column label="状态" width="150">
				<template slot-scope="scope">
					<span v-if="scope.row.goods_flag == 1">上架中</span>
					<span v-else>下架中</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="265">
				<template slot-scope="scope">
					<el-button @click="toStatu(scope.row.goods_id,scope.row.goods_flag)" type="text" size="small" v-if="scope.row.goods_flag == '1'">下架</el-button>
					<el-button @click="toStatu(scope.row.goods_id,scope.row.goods_flag)" type="text" size="small" v-else>上架</el-button>
					<el-button type="text" size="small">修改</el-button>
					<el-button type="text" size="small">管理评价</el-button>
					<el-button @click="delGoods(scope.row.goods_id)" type="text" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="block pagination">
		    <el-pagination
		      background
		      @current-change="pageChange"
		      @prev-text="pageChange"
		      @next-text="pageChange"
		      layout="total, prev, pager, next, jumper"
		      :total="all_data">
		    </el-pagination>
		</div>
		
	</div>
</template>

<script>
	export default {
		name: 'Goods',
		data() {
			return {
				goods_id: '',
				goods_name: '',
				tableData: [],
				all_data: 0,
				goods_id_list: []
			}
		},
		mounted: function () {
			this.getData()
		},
		methods: {
			getData (loading=true) {
				const self = this
				const url = 'admin_goods_info'
				let [...data] = [{}, loading]

				self.fetch(url, data,function (res) {
					self.tableData = res.data.goods_info_list
					self.all_data = res.data.all_data
				})
				
			},
			//上下架功能
			toStatu (goods_id, goods_flag) {
				const self = this
				
				let msg = '确定上架？'
				let message = '上架成功!'
				if (goods_flag == 1) {
					msg = '确定下架？'
					message = '下架成功!'
				}
				
				this.$messageBox(msg, '提示', message, function () {
					const url = 'admin_delete_goods'
				    const params = {
					  goods_id_list: JSON.stringify(self.goods_id_list)
				    }
				
				    let [...data] = [params, false]

				    self.fetch(url, data,function (res) {
				   	  self.updateFlag(goods_id, goods_flag)
				    })
				})
			},
			//上下架公共方法			
			updateFlag (goods_id, goods_flag) {
				const self = this
				const url = 'update_flag'
				const params = {
					goods_id: goods_id,
					flag: goods_flag
				}
				
				let [...data] = [params, false]

				self.fetch(url, data,function (res) {
					self.getData(false)
				})
			},
			//搜索功能
			search () {
				const self = this
				const url = 'admin_goods_info'
				const params = {
					goods_id: this.goods_id,
					goods_name: this.goods_name
				}

				let [...data] = [params, false]

				self.fetch(url, data,function (res) {
					self.tableData = res.data.goods_info_list
					self.all_data = res.data.all_data
				})
			},
			//添加商品功能
			addTab (index) {
				this.$emit('addTab',index);
			},
			//页数改变统一方法
			pageChange (val) {
				const self = this
				const url = 'admin_goods_info'
				const params = {
					page: val
				}
				
				let [...data] = [params, false]

				self.fetch(url, data,function (res) {
					self.tableData = res.data.goods_info_list
					self.all_data = res.data.all_data
				})
				
			},
			//批量删除数据
			selectionGoods (selection) {
				const goods_id_list = []
				
				selection.forEach((item, index) => {
					goods_id_list.push(item.goods_id)
				})
				this.goods_id_list = goods_id_list
			},
			//单个删除
			delGoods (index) {
				this.goods_id_list.push(index)
				
				this.deleteGoods()
			
			},
			//删除商品
			deleteGoods () {
				const self = this
				const [msg, title, message] = ['确定删除数据？', '提示', '删除成功']
				
				this.$messageBox(msg, title, message, function () {
				    const url = 'admin_delete_goods'
				    const params = {
					  goods_id_list: JSON.stringify(self.goods_id_list)
				    }
				
				    let [...data] = [params, false]

				    self.fetch(url, data,function (res) {
				   	  self.getData(false)
				   	  self.goods_id_list = []
				    })
				}, function () {
					self.goods_id_list = []
				})
			},
			//请求数据接口方法
			fetch (url, data, callback) {
				const self = this;
				
				self.$fetch(url, data[0], data[1]).then(function (res) {
					if (res.ret != 0) {
						self.$myMessage(self,true,res.errmsg,'warning')
						return;
					}
					
					callback && callback(res)
					
				},function (err) {
					console.log('失败'+JSON.stringify(err))
				})
			}
		}
	}
</script>

<style lang="stylus" sceped>
.goods-bottom
	margin-bottom: 10px
.btn-left
	width: 50%
	float: left
.btn-right
	width: 100%
	float: right
	text-align: right
.btn-selc
	margin-bottom: 10px
.el-tabs__content
	width: 90%
	margin: 0 auto
.pagination
	margin-top: 10px
</style>