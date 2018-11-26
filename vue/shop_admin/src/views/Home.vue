<template>
  <div class="home-com">
  	<!-- 头部导航条 start -->
    <section class="top-nav clearfix">
    	<h1 class="title">乐呵呵商城后台管理系统</h1>
    	<div class="user-base-info">
    		<el-dropdown>
				  <span class="el-dropdown-link">
				    薛翀<i class="el-icon-arrow-down el-icon--right"></i>
				  </span>
				  <el-dropdown-menu slot="dropdown">
				    <el-dropdown-item>基本资料</el-dropdown-item>
				    <el-dropdown-item divided>退出</el-dropdown-item>
				  </el-dropdown-menu>
				</el-dropdown>
    	</div>
    </section>
    <!-- 头部导航条 end -->
    <section class="page-container">
    	<!-- 左侧菜单 start -->
    	<div class="side-menu">
    		<el-container>
    			<el-aside :width="menuWidth + 'px'">
				    <el-menu :default-active="getActivedMenu" :router="true" :unique-opened="true">
				    	<template v-for="(item,index) in menuData">
				    		<el-submenu v-if="item.children" :key="index" :index="item.name">
					        <template slot="title"><i class="" v-if="item.icon"></i>{{item.name}}</template>
					        <el-menu-item v-for="(item2,index2) in item.children" :key="index2" :index="item2.name" :route="item2.url" @click="changeActiveMenu(item2.activedMenu || item2.url)">
										<i class="" v-if="item2.icon"></i>{{item2.name}}
					        </el-menu-item>
					      </el-submenu>
					      <el-menu-item :key="index" :index="item.name" v-else :route="item.url" @click="changeActiveMenu(item.activedMenu || item.url)"><i class="" v-if="item.icon"></i>{{item.name}}</el-menu-item>
				    	</template>
				      
				    </el-menu>
				  </el-aside>
    		</el-container>
    	</div>
    	<!-- 左侧菜单 end -->
    	<!-- 右侧内容 start -->
    	<section class="main-content-area" :style="{'padding-left': menuWidth + 'px'}">
    		<transition name="fade">
    			<router-view/>
    		</transition>
    	</section>
    	<!-- 右侧内容 end -->
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  data(){
  	return {
  		// 左侧菜单宽度
  		menuWidth: 220,
  		// 左侧菜单数据
  		menuData: [
  			{
  				name: "首页",
  				icon: "",
  				url: "/index"
  			},
  			{
  				name: "商品相关管理",
  				icon: "",
  				children: [
  					{
  						name: "商品管理",
  						icon: "",
  						url: "/goods"
  					},
  					{
  						name: "服务说明管理",
  						icon: "",
  						url: "/serviceDeclare"
  					}
  				]
  			},
  			{
  				name: "订单相关管理",
  				icon: "",
  				children: [
  					{
  						name: "订单管理",
  						icon: "",
  						url: "/order"
  					},
  					{
  						name: "配送方式管理",
  						icon: "",
  						url: "/e"
  					},
  					{
  						name: "抽奖返利配置",
  						icon: "",
  						url: "/f"
  					}
  				]
  			},
  			{
  				name: "商城管理",
  				icon: "",
  				children: [
  					{
  						name: "商城界面管理",
  						icon: "",
  						url: "/g"
  					},
  					{
  						name: "分析活动配置管理",
  						icon: "",
  						url: "/h"
  					},
  					{
  						name: "中奖概率配置",
  						icon: "",
  						url: "/i"
  					}
  				]
  			},
  			{
  				name: "用户管理",
  				icon: "",
  				children: [
  					{
  						name: "用户管理",
  						icon: "",
  						url: "/j"
  					}
  				]
  			}
  		]
  	}
  },
  methods: {
  	changeActiveMenu(url){
  		this.activedMenu = url;
  	},
  	getCurrentMenu(){
  		let router = this.$route.path,
  				menuData = this.menuData,
  				menu;
  		for(let i = 0,len = menuData.length; i < len; i++){
  			let item = menuData[i],
  					children = item.children;
  			if(item.url === router){
  				menu = item;
  				break;
  			}
  			if(children){
  				for(let j = 0,len2 = children.length; j < len2; j++){
  					if(children[j].url === router){
  						menu = children[j];
  						break;
  					}
  				}
  			}
  		}
  		return menu;
  	}
  },
  computed: {
  	// 计算默认激活的菜单项
  	getActivedMenu(){
  		return this.getCurrentMenu().name;
  	}
  }
}
</script>
<style lang="stylus" scoped>
.top-nav
	height: 80px
	padding: 0 15px
	background-color: #fff
	border-bottom: 1px solid #e6e6e6
.title
	float: left
	height: 80px
	line-height: 80px
	color: #409eff
.user-base-info
	float: right
	.el-dropdown
		padding-top: 30px
		> .el-dropdown-link
			color: #409eff
			cursor: pointer
		.el-icon-arrow-down
			transition: transform .4s
		&:hover .el-icon-arrow-down
			transform: rotate(-180deg)
/*左侧菜单 start*/
.side-menu
	position: fixed
	top: 80px
	left: 0
	bottom: 0
	.el-container
		height: 100%
	.el-aside
		height: 100%
		> .el-menu
			height: 100%
			overflow-y: auto
/*左侧菜单 end*/
/*右侧内容 start*/
.fade-enter-active
	opacity: 1
	transition: all .4s
.fade-enter,
.fade-leave
	opacity: 0
/*右侧内容 end*/
</style>