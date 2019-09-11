<template>
	<view class="content">
		<div style="height: 100vh">
			<h1> 单选 </h1>
			<lis-tree class="tree" :root="root" :selected="selected" show-radio :change-handler="onChange" auto-expand></lis-tree>
		</div>

		<div style="height: 100vh">
			<h1> 单选, 只显示叶子节点 </h1>
			<lis-tree class="tree" :root="root" :selected="selected" show-radio :change-handler="onChange" leaf-only auto-expand></lis-tree>
		</div>
		
		<div style="height: 100vh">
			<h1> 多选 </h1>
			<lis-tree class="tree" :root="root" :checked="checked" show-checkbox :change-handler="onChange" auto-expand></lis-tree>
		</div>
		
		<div style="height: 100vh">
			<h1> 多选, 只显示叶子节点 </h1>
			<lis-tree class="tree" :root="root" :checked="checked" show-checkbox :change-handler="onChange" leaf-only
			 auto-expand></lis-tree>
		</div>
	</view>
</template>

<script>
	import CompTree from '@/components/lis-tree/lis-tree.vue'
	export default {
		components: {
			CompTree
		},
		data() {
			return {
				root: {},
				selected: null,
				checked: [],
			}
		},
		methods: {
			onChange(selected) {
				console.log(selected)
			}
		},
		onLoad() {
			setTimeout(() => {
				this.root = {
					children: [{
							id: 'jiangsu',
							name: '江苏省',
							children: [{
								id: 'nanjing',
								name: '南京市',
								children: [{
										id: 'pukou',
										name: '浦口区',
									},
									{
										id: 'jiangning',
										name: '江宁区',
									}
								]
							}, ]
						},
						{
							id: 'zhejiang',
							name: '浙江省',
							children: [{
								id: 'hangzhou',
								name: '杭州市',
								children: [{
									id: 'yuhang',
									name: '余杭区',
								}, ]
							}, ]
						},
					]
				}
				this.selected = {
					id: 'pukou',
				}
				this.checked = [{
					id: 'jiangning'
				}]
			}, 1000)
		},

	}
</script>

<style>
	h1 {
		color: red;
	}
</style>
