'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useEffect } from 'react';

interface TiptapEditorProps {
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  className?: string;
}

export const TiptapEditor = ({
  value = '',
  onChange,
  placeholder = 'Enter content...',
  height = '300px',
  className = '',
}: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none p-4 ${className}`,
      },
    },
  });

  // Update editor content when prop changes (for edit mode)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-300">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded font-semibold ${
            editor.isActive('bold')
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 hover:bg-gray-100'
          }`}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded italic ${
            editor.isActive('italic')
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 hover:bg-gray-100'
          }`}
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`px-3 py-1 rounded line-through ${
            editor.isActive('strike')
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 hover:bg-gray-100'
          }`}
        >
          S
        </button>

        <div className="border-l border-gray-300 mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded font-bold ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 hover:bg-gray-100'
          }`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 rounded font-bold ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 hover:bg-gray-100'
          }`}
        >
          H3
        </button>

        <div className="border-l border-gray-300 mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('bulletList')
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 hover:bg-gray-100'
          }`}
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('orderedList')
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 hover:bg-gray-100'
          }`}
        >
          1. List
        </button>

        <div className="border-l border-gray-300 mx-1" />

        <button
          onClick={() => {
            const url = prompt('Enter URL:');
            if (url) {
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            }
          }}
          className={`px-3 py-1 rounded ${
            editor.isActive('link')
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 hover:bg-gray-100'
          }`}
        >
          🔗 Link
        </button>

        <button
          onClick={() => {
            const url = prompt('Enter image URL:');
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          className="px-3 py-1 rounded bg-white border border-gray-300 hover:bg-gray-100"
        >
          🖼️ Image
        </button>

        <div className="border-l border-gray-300 mx-1" />

        <button
          onClick={() => editor.chain().focus().clearNodes().run()}
          className="px-3 py-1 rounded bg-white border border-gray-300 hover:bg-gray-100"
        >
          Clear
        </button>
      </div>

      {/* Editor */}
      <div style={{ height }} className="overflow-y-auto bg-white p-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
