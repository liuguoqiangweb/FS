import { Message } from 'element-ui'
import Clipboard from 'clipboard'

function clipboardSuccess() {
  Message({
    message: '复制成功',
    type: 'success',
    duration: 1000
  })
}

function clipboardError() {
  Message({
    message: '复制失败',
    type: 'error'
  })
}

export default function handleClipboard(text, event) {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  })
  clipboard.on('success', () => {
    clipboardSuccess()
    clipboard.off('error')
    clipboard.off('success')
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError()
    clipboard.off('error')
    clipboard.off('success')
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
