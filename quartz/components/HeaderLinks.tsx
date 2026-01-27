import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { isAbsoluteURL, joinSegments, pathToRoot } from "../util/path"

type Options = {
  links: Record<string, string>
  ariaLabel?: string
}

export default ((opts?: Options) => {
  const HeaderLinks: QuartzComponent = ({
    fileData,
    displayClass,
  }: QuartzComponentProps) => {
    const entries = Object.entries(opts?.links ?? {})
    if (entries.length === 0) {
      return null
    }

    const baseDir = pathToRoot(fileData.slug!)
    const ariaLabel = opts?.ariaLabel ?? "primary"

    return (
      <nav class={classNames(displayClass, "header-links")} aria-label={ariaLabel}>
        <ul>
          {entries.map(([text, link]) => {
            const href = isAbsoluteURL(link) ? link : joinSegments(baseDir, link)
            return (
              <li>
                <a href={href}>{text}</a>
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }

  HeaderLinks.css = `
.header-links ul {
  align-items: center;
  display: flex;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
`

  return HeaderLinks
}) satisfies QuartzComponentConstructor<Options>
