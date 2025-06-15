// @ts-ignore
import linkCardScript from "./scripts/linkcard.inline"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const LinkCardHandler: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
  return <></>
}

LinkCardHandler.beforeDOMLoaded = linkCardScript

export default (() => LinkCardHandler) satisfies QuartzComponentConstructor