import Vue from 'vue'
import Clipboard from 'clipboard'

function clipboardSuccess(text) {
  Vue.prototype.$message({
    message: text || 'Copy successfully',
    type: 'success',
    duration: 1500
  })
}

function clipboardError(text) {
  Vue.prototype.$message({
    message: text || 'Copy failed',
    type: 'error'
  })
}

export default function handleClipboard(text, event, successMsg, errorMsg) {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  })
  clipboard.on('success', () => {
    clipboardSuccess(successMsg)
    clipboard.off('error')
    clipboard.off('success')
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError(errorMsg)
    clipboard.off('error')
    clipboard.off('success')
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
