import hljs from 'highlight.js'
/**
 * 全局公共方法&指令操作类
 *
 * @param Vue
 * @param options
 */
export default {
  install (Vue) {
    /// //////////////////////////////////////////////////////////////////////////////////第一部分-实例方法////////////////////////////////////////////////////////////////////////////////
    /**
     * 方法作用:获取日期的差值（例:几天前，几月前）
     * @param uploadTime 当前日期
     * @returns {String}
     */
    Vue.prototype.timeDifference = function (uploadTime) {
      const oldtime = uploadTime
      const nowTime = new Date()
      const timeDifference = nowTime.getTime() - new Date(oldtime).getTime()
      // 计算出相差天数
      const days = Math.floor(timeDifference / (24 * 3600 * 1000))
      if (days >= 365) {
        const year = Math.floor(days / 365)
        return year + '年前'
      } else if (days >= 30) {
        const month = Math.floor(days / 30)
        return month + '月前'
      } else if (days > 0) {
        return days + '天前'
      } else {
        const leave1 = timeDifference % (24 * 3600 * 1000)
        const hours = Math.floor(leave1 / (3600 * 1000))
        if (hours > 0) {
          return hours + '小时前'
        } else {
          const leave2 = leave1 % (3600 * 1000)
          const minutes = Math.floor(leave2 / (60 * 1000))
          if (minutes > 0) {
            return minutes + '分钟前'
          } else {
            const leave3 = leave2 % (60 * 1000)
            let seconds = Math.round(leave3 / 1000)
            if (seconds === 0) {
              seconds = 1
            }
            return seconds + '秒前'
          }
        }
      }
    }

    /// //////////////////////////////////////////////////////////////////////////////////第二部分-指令////////////////////////////////////////////////////////////////////////////////

    /** 自定义指令
     bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
     inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
     update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。
     componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用。
     unbind：只调用一次，指令与元素解绑时调用。
     */

    /**
     * 解析mardown语法格式
     */
    Vue.directive('highlight', (el) => {
      let blocks = el.querySelectorAll('pre code')
      blocks.forEach((block) => {
        hljs.highlightBlock(block)
      })
    })
  }
}
