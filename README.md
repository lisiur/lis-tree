# lis-tree

适用于 uniapp 的 tree 组件

**注意：** 该组件使用递归定义方式，因此一定要在pages.json里声明该组件

```
{
	"pages": [],
	"globalStyle": {
		"usingComponents": {
			"lis-tree": "/components/lis-tree/lis-tree"
		}
	}
}
```

## props

```
root: {  // 根数据 (required)
	type: Object,
},
showCheckbox: { // 是否显示复选框，默认不显示
	type: Boolean,
	default: false,
},
hasChildren: {  // 判断是否有子节点，默认判断节点数据的[children]属性是否是True值。注意如果children为[]也会判断为有子节点。可通过传递自定义判断函数满足不同需求
	type: Function,
	default: data => data.children
},
getChildren: { // 获取子节点，默认返回节点数据的[children]值
	type: Function,
	default: data => data.children
},
getId: {      // 获取节点唯一标识符，默认为id
	type: Function,
	default: data => data.id
},
getName: {   // 获取节点展示名称，默认为name
	type: Function,
	default: data => data.name
},
checked: {   // 初始化选中节点
	type: Array,
	default: [],
},
expand: {    // 初始化展开节点
	type: Array,
	default: [],
},
changeHandler: {  // 选中状态发生变化时执行的函数
	type: Function,
	default: (checked) => {},
},
```


## methods
```
getChecked()  // 获取选中的节点
```

## example
```
<template>
	<view class="content">
		<lis-tree show-checkbox :root="root" :checked="checked" :expand="expand" :change-handler="changeHandler"></lis-tree>
	</view>
</template>

<script>
	import LisTree from '@/components/lis-tree/lis-tree.vue'
	export default {
		components: {
			LisTree
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
				checked: [
					{
						id: 'jiangning',
					},
					{
						id: 'yuhang',
					}
				],
				expand: [
					{
						id: 'jiangsu',
					},
					{
						id: 'nanjing',
					},
				],
			}
		},
		methods: {
			changeHandler(selected) {
				console.log(selected)
			}
		}
		
	}
</script>
```