// @ts-ignore
import linkCardScript from "./scripts/linkcard.inline"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const LinkCardHandler: QuartzComponent = ({}: QuartzComponentProps) => {
  return <></>
}

LinkCardHandler.beforeDOMLoaded = linkCardScript

export default (() => LinkCardHandler) satisfies QuartzComponentConstructor
