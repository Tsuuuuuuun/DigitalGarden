import { Date} from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"
// @ts-ignore
import script from "./scripts/contentMeta.inline"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
  /**
   * Whether to display page view count from GoatCounter
   */
  showPageViews: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
  showPageViews: false,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []

      if (fileData.dates) {
        segments.push(
          <span>
            Created on: <Date date={fileData.dates.created} />
          </span>
        )
        segments.push(
          <span>
            Last Updated: <Date date={fileData.dates.modified} />
          </span>
        )
      }

      // Display reading time if enabled
      // if (options.showReadingTime) {
      //   const { minutes, words: _words } = readingTime(text)
      //   const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
      //     minutes: Math.ceil(minutes),
      //   })
      //   segments.push(<span>{displayedTime}</span>)
      // }

      // Display page views if enabled
      if (options.showPageViews && cfg.analytics?.provider === "goatcounter") {
        const websiteId = cfg.analytics.websiteId
        const path = fileData.slug
        segments.push(
          <span class="page-views" data-goatcounter-id={websiteId} data-path={path}>
            Views: <span class="page-view-count">--</span>
          </span>
        )
      }

      return (
        <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segments}
        </p>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style
  ContentMetadata.afterDOMLoaded = script

  return ContentMetadata
}) satisfies QuartzComponentConstructor
