# lis-tree

适用于 uniapp 的 tree 组件

## 注意
**该组件使用递归定义方式，因此一定要在pages.json里声明该组件**

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


**App Plus 和 小程序可以直接使用, H5 需要在 main.js 里全局注册组件. 详情可见示例项目**
```
import LisTree from './components/lis-tree/lis-tree.vue'
Vue.component('lis-tree', LisTree)
```


**组件采用条件编译,可根据自己使用的平台,自行删掉不必要的代码.**

## props

```
root: {  // 根数据 (required)
	type: Object,
},
showCheckbox: { // 是否显示复选框，默认不显示
	type: Boolean,
	default: false,
},
showRadio: {  //  是否显示单选框, 默认不显示
	type: Boolean,
	default: false,
},
leafOnly: {  //  checkbox 或 radio 是否只显示叶子节点
	type: Boolean,
	default: false, 
},
checked: {   // 多选时,初始化选中节点数组
	type: Array,
	default: [],
},
selected: {  // 单选时,初始化选中的节点
	type: Object,
},
expand: {    // 初始化展开节点
	type: Array,
	default: [],
},
autoExpand: { // 展开tree使得传入的 checked 可见，此配置会让 expand 失效
	type: Boolean,
	default: false
},
changeHandler: {  // 选中状态发生变化时执行的函数, 多选时 checked 为选中的节点数组, 单选时 checked 为只包含一个选中节点的数组
	type: Function,
	default: (checked) => {},
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
```


## methods
```
getChecked()  // 返回选中的节点数组, 单选时返回只包含一个选中节点的数组
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

