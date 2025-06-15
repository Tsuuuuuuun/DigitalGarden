// @ts-ignore
import remarkLinkCard from "remark-link-card"
import { QuartzTransformerPlugin } from "../types"

export interface Options {
  cache?: boolean
  shortenUrl?: boolean
  showDescription?: boolean
}

const defaultOptions: Options = {
  cache: false,
  shortenUrl: false,
  showDescription: false,
}

export const LinkCard: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "LinkCard",
    markdownPlugins() {
      return [
        [
          remarkLinkCard,
          {
            cache: opts.cache,
            shortenUrl: opts.shortenUrl,
            showDescription: opts.showDescription,
          },
        ],
      ]
    },
  }
}