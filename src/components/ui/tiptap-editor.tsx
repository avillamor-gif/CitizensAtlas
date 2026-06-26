'use client'

import { useMemo } from 'react'
import { Editor } from '@tinymce/tinymce-react'

interface TiptapEditorProps {
  value: string | undefined
  onChange: (value: string) => void
  placeholder?: string
  height?: string
  className?: string
}

export const TiptapEditor = ({
  value = '',
  onChange,
  placeholder = 'Enter content...',
  height = '500px',
  className = '',
}: TiptapEditorProps) => {
  const editorHeight = useMemo(() => {
    const parsed = Number.parseInt(height.replace('px', ''), 10)
    return Number.isFinite(parsed) ? parsed : 300
  }, [height])

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        value={value}
        onEditorChange={(content) => onChange(content)}
        init={{
          base_url: '/tinymce',
          suffix: '.min',
          height: editorHeight,
          menubar: false,
          branding: false,
          promotion: false,
          elementpath: true,
          browser_spellcheck: true,
          contextmenu: 'link image table lists',
          toolbar_mode: 'sliding',
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'wordcount',
            'help',
          ],
          toolbar:
            'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | removeformat code fullscreen',
          placeholder,
          // Preserve existing content structure as much as possible.
          verify_html: false,
          valid_elements: '*[*]',
          extended_valid_elements: '*[*]',
          paste_data_images: true,
          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:16px; line-height:1.6; }',
        }}
      />
      <div className="border-t bg-gray-50 px-3 py-1 text-xs text-gray-500">
        WordPress-style editor mode. Existing content is preserved in HTML.
      </div>
    </div>
  )
}
