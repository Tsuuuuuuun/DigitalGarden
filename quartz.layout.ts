import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [Component.PageTitle(), Component.Search(), Component.Darkmode()],
  afterBody: [
    Component.ConditionalRender({
      component: Component.EditSuggestion(),
      condition: (page) => page.fileData.filePath?.startsWith("content/notes/") ?? false,
    }),
    Component.LinkCardHandler(),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/Tsuuuuuuun/DigitalGarden",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta({ showPageViews: true }),
    Component.TagList(),
  ],
  left: [],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta({ showPageViews: true }),
  ],
  left: [],
  right: [],
}
