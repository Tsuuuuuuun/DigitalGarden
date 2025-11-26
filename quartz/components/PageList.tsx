import { FullSlug, isFolderPath, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { Date as DateComponent, formatDate, getDate } from "./Date"
import { QuartzComponent, QuartzComponentProps } from "./types"
import { GlobalConfiguration } from "../cfg"

export type SortFn = (f1: QuartzPluginData, f2: QuartzPluginData) => number

export function byDateAndAlphabetical(cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    // Sort by date/alphabetical
    if (f1.dates && f2.dates) {
      // sort descending
      return getDate(cfg, f2)!.getTime() - getDate(cfg, f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      // prioritize files with dates
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

export function byDateAndAlphabeticalFolderFirst(cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    // Sort folders first
    const f1IsFolder = isFolderPath(f1.slug ?? "")
    const f2IsFolder = isFolderPath(f2.slug ?? "")
    if (f1IsFolder && !f2IsFolder) return -1
    if (!f1IsFolder && f2IsFolder) return 1

    // If both are folders or both are files, sort by date/alphabetical
    if (f1.dates && f2.dates) {
      // sort descending
      return getDate(cfg, f2)!.getTime() - getDate(cfg, f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      // prioritize files with dates
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

type Props = {
  limit?: number
  sort?: SortFn
} & QuartzComponentProps

export const PageList: QuartzComponent = ({ cfg, fileData, allFiles, limit, sort }: Props) => {
  const sorter = sort ?? byDateAndAlphabeticalFolderFirst(cfg)
  const sortedList = [...allFiles].sort(sorter)
  const list = limit ? sortedList.slice(0, limit) : sortedList

  const monthGroups: {
    key: string
    label: string
    dateGroups: {
      key: string
      label?: string
      date?: Date
      pages: QuartzPluginData[]
    }[]
  }[] = []

  const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
  const dayKey = (d: Date) => `${monthKey(d)}-${String(d.getDate()).padStart(2, "0")}`

  for (const page of list) {
    const date = page.dates ? getDate(cfg, page) : undefined
    const currentMonthKey = date ? monthKey(date) : "undated"
    const currentDayKey = date ? dayKey(date) : "undated"

    let monthGroup = monthGroups.find((group) => group.key === currentMonthKey)
    if (!monthGroup) {
      monthGroup = {
        key: currentMonthKey,
        label: date ? currentMonthKey : "No date",
        dateGroups: [],
      }
      monthGroups.push(monthGroup)
    }

    let dateGroup = monthGroup.dateGroups.find((group) => group.key === currentDayKey)
    if (!dateGroup) {
      dateGroup = {
        key: currentDayKey,
        label: date ? formatDate(date, cfg.locale) : undefined,
        date,
        pages: [],
      }
      monthGroup.dateGroups.push(dateGroup)
    }

    dateGroup.pages.push(page)
  }

  return (
    <div class="page-list">
      {monthGroups.map((month) => (
        <section class="month-group" key={month.key}>
          <h2 class="month-heading">{month.label}</h2>
          {month.dateGroups.map((dateGroup) => (
            <div class="date-block" key={dateGroup.key}>
              <p class="date-label">
                {dateGroup.date ? (
                  <DateComponent date={dateGroup.date} locale={cfg.locale} />
                ) : (
                  "No date"
                )}
              </p>
              <ul class="section-ul date-items">
                {dateGroup.pages.map((page) => {
                  const title = page.frontmatter?.title
                  const tags = page.frontmatter?.tags ?? []

                  return (
                    <li class="section-li" key={page.slug}>
                      <div class="section">
                        <div class="desc">
                          <h3>
                            <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                              {title}
                            </a>
                          </h3>
                        </div>
                        <ul class="tags">
                          {tags.map((tag) => (
                            <li>
                              <a
                                class="internal tag-link"
                                href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                              >
                                {tag}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}

PageList.css = `
.page-list .section h3 {
  margin: 0;
}

.page-list .section > .tags {
  margin: 0;
}

.page-list .month-group + .month-group {
  margin-top: 2rem;
}

.page-list .month-heading {
  margin: 1.5rem 0 0.5rem;
}

.page-list .date-block {
  margin: 1rem 0 0.5rem;
}

.page-list .date-label {
  margin: 0.25rem 0 0.25rem;
  opacity: 0.6;
}

.page-list .date-items.section-ul {
  position: relative;
  margin-top: 0.25rem;
  padding-left: 0;
}

.page-list .date-items.section-ul::before {
  content: "";
  position: absolute;
  left: 0.4rem;
  top: 0.1rem;
  bottom: 0.1rem;
  border-left: 1px solid var(--secondary);
  opacity: 0.6;
}

.page-list .date-items.section-ul > .section-li {
  padding-left: 1.5rem;
}

.page-list .date-items.section-ul > .section-li > .section {
  grid-template-columns: 3fr 1fr;
}
`
