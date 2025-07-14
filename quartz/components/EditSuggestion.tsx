import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import style from "./styles/editSuggestion.scss"
import { i18n } from "../i18n"

interface EditSuggestionOptions {
  /**
   * GitHub repository URL
   */
  repoUrl: string
  /**
   * Branch name (default: main)
   */
  branch?: string
  /**
   * Custom text for the edit button
   */
  text?: string
}

const defaultOptions: EditSuggestionOptions = {
  repoUrl: "https://github.com/Tsuuuuuuun/DigitalGarden",
  branch: "main",
}

export default ((userOptions?: Partial<EditSuggestionOptions>) => {
  const opts = { ...defaultOptions, ...userOptions }
  
  const EditSuggestion: QuartzComponent = ({ fileData, displayClass, cfg }: QuartzComponentProps) => {
    const text = opts.text ?? i18n(cfg.locale).components.editSuggestion.text
    // Only show for notes, not for index or tag pages
    if (!fileData.filePath || !fileData.filePath.startsWith("content/")) {
      return null
    }

    // Convert the internal file path to GitHub edit URL
    const editUrl = `${opts.repoUrl}/edit/${opts.branch}/${fileData.filePath}`

    return (
      <div class={classNames(displayClass, "edit-suggestion")}>
        <a href={editUrl} target="_blank" rel="noopener noreferrer" class="edit-button">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="github-icon"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          <span>{text}</span>
        </a>
      </div>
    )
  }

  EditSuggestion.css = style
  return EditSuggestion
}) satisfies QuartzComponentConstructor<Partial<EditSuggestionOptions>>