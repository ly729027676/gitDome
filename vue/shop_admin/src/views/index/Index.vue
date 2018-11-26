<template>
	<div>
		我是首页
		<ul>
			<li><router-link to="/goods">商品管理</router-link></li>
			<li><router-link to="/serviceDeclare">服务说明</router-link></li>
			<li><router-link to="/order">订单管理</router-link></li>
		</ul>
	</div>
</template>
<script>
	export default {
		name: "Index"
	}
</script>
<style lang="stylus" scoped></style>