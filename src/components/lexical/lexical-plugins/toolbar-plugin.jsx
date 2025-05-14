import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND } from "lexical"
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text"
import { $setBlocksType } from "@lexical/selection"
import { $createParagraphNode } from "lexical"
import { ListNode } from "@lexical/list"
import { $getNearestNodeOfType } from "@lexical/utils"
import {
  Bold,
  Italic,
  Underline,
  ListIcon,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  LinkIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCallback, useEffect, useState } from "react"
import { mergeRegister } from "@lexical/utils"
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from "@lexical/list"
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link"

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isLink, setIsLink] = useState(false)
  const [isHeading1, setIsHeading1] = useState(false)
  const [isHeading2, setIsHeading2] = useState(false)
  const [isBulletList, setIsBulletList] = useState(false)
  const [isOrderedList, setIsOrderedList] = useState(false)

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"))
      setIsItalic(selection.hasFormat("italic"))
      setIsUnderline(selection.hasFormat("underline"))

      const anchorNode = selection.anchor.getNode()
      const focusNode = selection.focus.getNode()
      const anchorNodeParent = anchorNode.getParent()

      // Check for links
      setIsLink($isLinkNode(anchorNode) || $isLinkNode(focusNode) || $isLinkNode(anchorNodeParent))

      // Check for headings
      const anchorNodeGrandparent = anchorNodeParent?.getParent()
      setIsHeading1(
        ($isHeadingNode(anchorNode) && anchorNode.getTag() === "h1") ||
          ($isHeadingNode(anchorNodeParent) && anchorNodeParent.getTag() === "h1") ||
          ($isHeadingNode(anchorNodeGrandparent) && anchorNodeGrandparent.getTag() === "h1"),
      )
      setIsHeading2(
        ($isHeadingNode(anchorNode) && anchorNode.getTag() === "h2") ||
          ($isHeadingNode(anchorNodeParent) && anchorNodeParent.getTag() === "h2") ||
          ($isHeadingNode(anchorNodeGrandparent) && anchorNodeGrandparent.getTag() === "h2"),
      )

      // Check for lists
      const listNode = $getNearestNodeOfType(anchorNode, ListNode)
      const listType = listNode?.getListType()
      setIsBulletList(listType === "bullet")
      setIsOrderedList(listType === "number")
    }
  }, [])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar()
        })
      }),
    )
  }, [editor, updateToolbar])

  const formatHeading = (headingSize) => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize))
      }
    })
  }

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode())
      }
    })
  }

  const formatBulletList = () => {
    if (isBulletList) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    }
  }

  const formatOrderedList = () => {
    if (isOrderedList) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
    }
  }

  const insertLink = () => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
        url: "https://",
        target: "_blank",
        rel: "noopener noreferrer",
      })
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    }
  }

  return (
    <div className="toolbar border-b p-1 bg-muted/30 flex justify-center flex-wrap gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className={isBold ? "bg-muted" : ""}
        type="button"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className={isItalic ? "bg-muted" : ""}
        type="button"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        className={isUnderline ? "bg-muted" : ""}
        type="button"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => formatHeading("h1")}
        className={isHeading1 ? "bg-muted" : ""}
        type="button"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => formatHeading("h2")}
        className={isHeading2 ? "bg-muted" : ""}
        type="button"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={formatBulletList}
        className={isBulletList ? "bg-muted" : ""}
        type="button"
      >
        <ListIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={formatOrderedList}
        className={isOrderedList ? "bg-muted" : ""}
        type="button"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
        type="button"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
        type="button"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
        type="button"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
