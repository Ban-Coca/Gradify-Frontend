import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import {LexicalErrorBoundary} from "@lexical/react/LexicalErrorBoundary"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { TRANSFORMERS } from "@lexical/markdown"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"
import { ListItemNode, ListNode } from "@lexical/list"
import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { ToolbarPlugin } from "./lexical-plugins/toolbar-plugin"
import { LinkToolbarPlugin } from "./lexical-plugins/link-toolbar-plugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { $getRoot, $getSelection } from "lexical"
import { $generateHtmlFromNodes } from "@lexical/html"
import { useRef } from "react"

export function LexicalEditor({ onChange, initialContent = "<p></p>" }) {
  const editorStateRef = useRef(null)

  const initialConfig = {
    namespace: "MyEditor",
    theme: {
      root: "p-0 relative min-h-[150px] outline-none",
      link: "cursor-pointer text-blue-500 underline",
      text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
        strikethrough: "line-through",
        underlineStrikethrough: "underline line-through",
      },
      heading: {
        h1: "text-2xl font-bold",
        h2: "text-xl font-bold",
        h3: "text-lg font-bold",
      },
    },
    onError(error) {
      console.error(error)
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
  }

  const handleEditorChange = (editorState, editor) => {
  editorStateRef.current = editorState
  try {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null)
      onChange(htmlString)
    })
  } catch (error) {
    console.error("Error generating HTML:", error)
    onChange("<p>Error generating content</p>")
  }
}

  return (
    <div className="lexical-editor border rounded-md overflow-hidden">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-container">
          <ToolbarPlugin />
          <div className="editor-inner p-3 relative">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input min-h-[150px] outline-none" />}
              placeholder={
                <div className="editor-placeholder absolute top-[12px] left-[12px] text-muted-foreground pointer-events-none">
                  Enter your feedback or notification message...
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={handleEditorChange} />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            <LinkPlugin />
            {/* <LinkToolbarPlugin /> */}
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          </div>
        </div>
      </LexicalComposer>
    </div>
  )
}
