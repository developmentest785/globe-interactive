import { Editor } from "@tinymce/tinymce-react";
import { useState } from "react";

export default function App() {
  const [data, setData] = useState("");

  const log = () => {
    console.log("Editor content:", data);
  };

  return (
    <>
      <Editor
        initialValue="<p>This is the initial content of the editor.</p>"
        outputFormat="html"
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          // content_style:
          //   "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
        onEditorChange={(content, editor) => {
          console.log("Content was updated:", content);
        }}
        onChange={(e: {
          target: any;
          type: string;
          preventDefault: () => void;
          isDefaultPrevented: () => boolean;
          stopPropagation: () => void;
          isPropagationStopped: () => boolean;
          stopImmediatePropagation: () => void;
          isImmediatePropagationStopped: () => boolean;
        }) => {
          console.log(
            "Content was updated (handleOnChange):",
            e.target.getContent()
          );
          setData(e.target.getContent());
        }}
      />
      <button onClick={log}>Log editor content</button>
    </>
  );
}
