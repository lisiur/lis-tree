<template>
	<div class="uni-tree">
		<template v-for="(item, index) in getChildren(parent || root)">
			<div class="uni-tree-item" :key="getId(item)">
				<div class="uni-tree-item-self">
					<div class="uni-tree-item-checkbox-wrapper" v-if="showCheckbox" @click="handleToggleCheck(currentLevelData[index])">
						<image class="uni-tree-item-checkbox-icon" :src="`/static/lis-tree/checked.png`" v-if="item._checked"></image>
						<image class="uni-tree-item-checkbox-icon" :src="`/static/lis-tree/indeterminate.png`" v-else-if="item._indeterminate"></image>
						<image class="uni-tree-item-checkbox-icon" :src="`/static/lis-tree/unchecked.png`" v-else></image>
					</div>
					<div class="uni-tree-item-name-wrapper" @click="handleToggleExpand(currentLevelData[index])">
						<span class="uni-tree-item-name">{{item.name}}</span>
						<image class="uni-tree-item-expand-icon" :src="`/static/lis-tree/expand_${item._expand ? 1 : 0}.png`" v-if="item._hasChildren"></image>
					</div>
				</div>
				<div class="uni-tree-item-children" v-if="hasChildren(item)">
					<lis-tree :root="root" :parent="item" :level="level+1" :has-children="hasChildren" :get-children="getChildren"
					 :get-id="getId" :get-name="getName" :show-checkbox="showCheckbox" @on-change="onChange" v-if="item._expand"></lis-tree>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
	export default {
		name: 'lisTree',
		props: {
			root: {
				type: Object,
			},
			parent: {
				type: Object,
			},
			showCheckbox: {
				type: Boolean,
				default: false,
			},
			hasChildren: {
				type: Function,
				default: () => data => data.children
			},
			getChildren: {
				type: Function,
				default: () => data => data.children
			},
			getId: {
				type: Function,
				default: () => data => data.id
			},
			getName: {
				type: Function,
				default: () => data => data.name
			},
			checked: {
				type: Array,
				default: () => [],
			},
			expand: {
				type: Array,
				default: () => [],
			},
			autoExpand: {
				type: Boolean,
				default: false
			},
			level: {
				type: Number,
				default: 0,
			},
			getRoot: {
				type: Function,
			},
			changeHandler: {
				type: Function,
				default: () => {},
			},

		},
		data() {
			return {
				currentLevelData: [],
				innerExpand: [],
			}
		},
		mounted() {
			this.init({expand: true, checked: true})
			this.$on('on-change', (item, handler) => {
				if (this.level === 0) {
					handler.call(this, item)
					this.$nextTick(() => {
						this.setCurrentLevelData()
						this.changeHandler(this.getChecked())
					})
				}
				// this.$forceUpdate.call(this)
			})
		},
		onUnload() {
			this.$off('on-change')
		},
		watch: {
			root() {
				this.init({checked: true})
			},
			checked() {
				this.init({checked: true})
			},
			expand() {
				this.init({checked: true, expand: true})
			}
		},
		methods: {
			init({expand, checked}) {
				if (this.level === 0) {
					this.syncState({checked, expand})
				}
				this.setCurrentLevelData()
			},
			setCurrentLevelData() {
				this.currentLevelData = this.getChildren(this.parent || this.root)
			},
			onChange({
				detail
			}) {
				const [item, handler] = detail.__args__
				if (this.level === 0) {
					const id = this.getId(item)
					const target = this.getItemById(id)

					handler.call(this, target)
					this.changeHandler(this.getChecked())
				} else {
					this.$emit('on-change', item, handler)
				}
			},
			syncState({expand, checked}) {
				if (checked) {
					this.syncStateChecked()
				}
				if (expand) {
					this.syncStateExpand()
				}
			},
			syncStateChecked() {
				const parent = this.root
				this.forEachTree(parent, (item, parent) => {
					this.$set(item, '_checked', this.isChecked(item))
					this.$set(item, '_expand', false)
					this.$set(item, '_indeterminate', false)
					this.$set(item, '_parent', this.getId(parent))
					this.$set(item, '_hasChildren', this.hasChildren(item))
				})
				this.forEachTree(parent, (item, parent) => {
					if (item._checked) {
						this.upStreamCheck(item)
						this.downStreamCheck(item)
						return true
					}
				})
				return parent
			},
			syncStateExpand() {
				this.setInnerExpand()
				this.forEachTree(this.root, (item, parent) => {
					this.$set(item, '_expand', this.isExpand(item))
				})
			},
			setInnerExpand() {
				if (this.autoExpand) {
					this.forEachTree(this.root, (item, parent) => {
						if (!this.hasChildren(item)) {
							return true
						}
						if (item._indeterminate) {
							this.innerExpand.push(item)
						}
					})
				} else {
					this.innerExpand = this.expand
				}
			},
			forEachTree(tree, handler) {
				if (!tree) {
					return
				}
				if (this.hasChildren(tree)) {
					const children = this.getChildren(tree)
					for (let item of children) {
						const stopForEach = handler(item, tree)
						if (!stopForEach) {
							this.forEachTree(item, handler)
						}
					}
				}
			},
			upStreamCheck(node) {
				if (node) {
					const parent = this.getItemById(node._parent)
					if (!parent) {
						return
					}
					const children = this.getChildren(parent)
					const checked = children.filter(it => it._checked)
					const indeterminated = children.filter(it => it._indeterminate)
					this.$set(parent, '_checked', checked.length === children.length)
					this.$set(parent, '_indeterminate', !parent._checked && (indeterminated.length > 0 || checked.length > 0))
					this.upStreamCheck(parent)
				}
			},
			downStreamCheck(node) {
				if (this.hasChildren(node)) {
					for (let item of this.getChildren(node)) {
						this.$set(item, '_checked', node._checked)
						this.$set(item, '_indeterminate', false)
						this.downStreamCheck(item)
					}
				}
			},
			isChecked(item) {
				return !!this.checked.find(it => this.isSame(item, it))
			},
			isExpand(item) {
				return !!this.innerExpand.find(it => this.isSame(item, it))
			},
			isChildrenAllCheck(item) {
				if (this.hasChildren(item)) {
					const children = this.getChildren(item)
					return children.every(it => it._checked)
				}
				return item._checked
			},
			isSame(itemA, itemB) {
				return this.getId(itemA) === this.getId(itemB)
			},
			getItemById(id) {
				let target = null
				this.forEachTree(this.root, (item) => {
					if (this.getId(item) === id) {
						target = item
						return true
					}
				})
				return target
			},
			handleToggleExpand(item) {
				const self = this
				this.$emit('on-change', item, (item) => {
					this.$set(item, '_expand', !item._expand)
					this.$nextTick(() => {
						this.setCurrentLevelData.call(self)
					})
				})
			},
			handleToggleCheck(item) {
				const self = this
				this.$emit('on-change', item, function(item) {
					this.$set(item, '_checked', !item._checked)
					this.$set(item, '_indeterminate', false)
					this.upStreamCheck(item)
					this.downStreamCheck(item)
					this.$nextTick(() => {
						this.setCurrentLevelData.call(self)
					})
				})
			},
			getChecked() {
				const checked = []
				this.forEachTree(this.root, function(item) {
					if (item._checked) {
						checked.push(item)
						return true
					}
				})
				return checked
			}
		}
	}
</script>

<style>
	.uni-tree {}
	
	.uni-tree-item {
		margin: 18upx 0;
	}

	.uni-tree-item-checkbox-icon {
		width: 52upx;
		height: 52upx;
	}

	.uni-tree-item-checkbox-wrapper {
		display: flex;
		align-items: center;
	}
	
	.uni-tree-item-name-wrapper {
		flex: 1;
		display: flex;
		align-items: center;
	}

	.uni-tree-item-expand-icon {
		width: 26upx;
		height: 26upx;
		margin-right: 8upx;
		opacity: .9;
	}

	.uni-tree-item-self {
		display: flex;
		align-items: center;
	}

	.uni-tree-item-checkbox {}

	.uni-tree-item-name {
		flex: 1;
		text-align: left;
	}

	.uni-tree-item-children {
		margin-left: 36upx;
	}
</style>
