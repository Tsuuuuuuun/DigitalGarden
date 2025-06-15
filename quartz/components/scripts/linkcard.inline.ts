// Handle link card image failures
function handleLinkCardImages() {
  const linkCardImages = document.querySelectorAll('.rlc-image')
  
  linkCardImages.forEach((img: Element) => {
    const imgElement = img as HTMLImageElement
    const container = imgElement.closest('.rlc-image-container')
    
    if (!container) return
    
    // 画像が既に読み込みエラーの場合（complete=true かつ naturalWidth=0）
    if (imgElement.complete && imgElement.naturalWidth === 0) {
      container.classList.add('image-failed')
      return
    }
    
    // 画像読み込みエラー時のイベントリスナー
    const handleError = () => {
      container.classList.add('image-failed')
    }
    
    imgElement.addEventListener('error', handleError)
    window.addCleanup(() => imgElement.removeEventListener('error', handleError))
  })
}

// ページ読み込み時とナビゲーション時に実行
document.addEventListener('nav', handleLinkCardImages)
document.addEventListener('DOMContentLoaded', handleLinkCardImages)