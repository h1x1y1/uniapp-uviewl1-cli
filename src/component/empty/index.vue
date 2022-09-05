<template>
  <view>
    <u-loadmore v-if="loadStatus"  height="100rpx" :status="loadStatus" />
    <view v-else class="pt30 pb30">
      <u-empty :text="tips" mode="list"></u-empty>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'cu-empty',
    props: {
      bgColor: {
        type: String,
        default: 'color-white'
      },
      pn: {
        type: Number,
        default: 1
      },
      ps: {
        type: Number,
        default: 10
      },
      total: {
        type: Number,
        default: -1
      },
      tips: {
        type: String,
        default: '暂无内容'
      }
    },
    computed: {
      loadStatus() {
        if (this.total < 0 || this.total > this.pn * this.ps) {
          return 'loading'
        } else if (this.total === 0) {
          return false
        } else {
          return 'nomore'
        }
      }
    }
  }
</script>

<style lang="scss"></style>
