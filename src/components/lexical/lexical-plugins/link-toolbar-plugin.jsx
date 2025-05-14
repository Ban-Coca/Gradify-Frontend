import { useState, useCallback, useEffect } from "react"
import { createPortal } from "react-dom"
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW } from "lexical"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link"
import { mergeRegister, $getNearestNodeOfType } from "@lexical/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function LinkToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [linkUrl, setLinkUrl] = useState("")
  const [isEditingLink, setIsEditingLink] = useState(false)
  const [lastSelection, setLastSelection] = useState(null)
  const [linkElement, setLinkElement] = useState(null)

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const node = $getNearestNodeOfType(selection.anchor.getNode(), $isLinkNode)
      if (node) {
        setLinkUrl(node.getURL())
      } else {
        setLinkUrl("")
      }
    }
    const nativeSelection = window.getSelection()
    if (nativeSelection && nativeSelection.rangeCount > 0) {
      const domRange = nativeSelection.getRangeAt(0)
      let rect
      if (nativeSelection.anchorNode === nativeSelection.focusNode) {
        rect = domRange.getBoundingClientRect()
      } else {
        rect = nativeSelection.getRangeAt(0).getBoundingClientRect()
      }

      if (rect) {
        const editorRoot = document.querySelector('.lexical-editor')
        setLinkElement(editorRoot)
        setIsEditingLink(true)
        setLastSelection(selection)
      }
    } else {
      setIsEditingLink(false)
      setLinkElement(null)
    }
  }, [])

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        TOGGLE_LINK_COMMAND,
        (payload) => {
          if (payload !== null) {
            setIsEditingLink(true)
            setLinkUrl(payload.url)
          }
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
    )
  }, [editor])

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateLinkEditor()
      })
    })
  }, [editor, updateLinkEditor])

  const handleLinkSubmit = (e) => {
    e.preventDefault()
    editor.focus()

    // If we have a last selection, restore it
    if (lastSelection !== null) {
      editor.update(() => {
        if (linkUrl.trim() !== "") {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
            url: linkUrl,
            target: "_blank",
            rel: "noopener noreferrer",
          })
        } else {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
        }
      })
    }

    setIsEditingLink(false)
  }

  return isEditingLink && linkElement
    ? createPortal(
        <div className="absolute top-12 left-3 z-10 flex items-center justify-center p-2 bg-background border rounded-md shadow-md">
          <form onSubmit={handleLinkSubmit} className="flex w-full items-center gap-2">
            <Input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter link URL..."
              className="flex-grow"
              autoFocus
            />
            <Button type="submit" size="sm">
              Save
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setIsEditingLink(false)}>
              <X className="h-4 w-4" />
            </Button>
          </form>
        </div>,
        linkElement,
      )
    : null
}
