<template>
	<view class="content">
		<lis-tree class="tree" :root="root" :checked="checked" :expand="expand" show-checkbox :change-handler="onChange"></lis-tree>
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
				root: {
					children: [
						{
							id: 'jiangsu',
							name: '江苏省',
							children: [
								{
									id: 'nanjing',
									name: '南京市',
									children: [
										{
											id: 'pukou',
											name: '浦口区',
										},
										{
											id: 'jiangning',
											name: '江宁区',
										}
									]
								},
							]
						},
						{
							id: 'zhejiang',
							name: '浙江省',
							children: [
								{
									id: 'hangzhou',
									name: '杭州市',
									children: [
										{
											id: 'yuhang',
											name: '余杭区',
										},
									]
								},
							]
						},
					]
				},
				checked: [{
						id: 'pukou',
					}],
				expand: [{
						id: 'jiangsu',
					},
					{
						id: 'nanjing',
					},
				],
			}
		},
		methods: {
			onChange(selected) {
				console.log(selected)
			}
		},
		onLoad() {
			setTimeout(() => {
				this.checked = [
					{
						id: 'jiangning',
					},
					{
						id: 'yuhang',
					}
				]
			}, 2000)
		},
		
	}
</script>

<style>
	
</style>
