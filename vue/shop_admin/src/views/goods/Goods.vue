<template>
	<div class="goods-wrap">
		<el-tabs v-model="editableTabsValue2" type="card" closable @tab-remove="removeTab">
			<el-tab-pane v-for="(item, index) in editableTabs2" :key="item.name" :label="item.title" :name="item.name">
				<div v-if="item.content == 'goods'">
					<goods @addTab="addTab()"></goods>
				</div>
				<div v-else-if="item.content == 'addGoods'">
					<addGoods></addGoods>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script type="text/javascript">
	import Goods from '../template/goods/Goods'
	import addGoods from '../template/goods/addGoods'
	export default {
		name: 'Goods',
		components: {
			goods: Goods,
			addGoods: addGoods
		},
		data() {
			return {
				editableTabsValue2: '1',
				editableTabs2: [{
					title: '商品管理',
					name: '1',
					content: 'goods'
				}],
				tabIndex: 1
			}
		},
		methods: {
			addTab(targetName) {
				let newTabName = ++this.tabIndex + '';
				this.editableTabs2.push({
					title: '添加商品',
					name: newTabName,
					content: 'addGoods'
				});
				this.editableTabsValue2 = newTabName;
			},
			removeTab(targetName) {
				if (targetName == 1) return;
				let tabs = this.editableTabs2;
				let activeName = this.editableTabsValue2;
				if(activeName === targetName) {
					tabs.forEach((tab, index) => {
						if(tab.name === targetName) {
							let nextTab = tabs[index + 1] || tabs[index - 1];
							if(nextTab) {
								activeName = nextTab.name;
							}
						}
					});
				}

				this.editableTabsValue2 = activeName;
				this.editableTabs2 = tabs.filter(tab => tab.name !== targetName);
			}
		}
	}
</script>

<style lang="stylus" scoped>
.goods-wrap
	margin-top: 20px
</style>