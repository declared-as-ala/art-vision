"use client";

import { useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Underline as UnderlineIcon, Undo2, Redo2, List, ListOrdered,
  Quote, Link2, ImagePlus, Code2, Minus, Megaphone, MapPin, Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight,
} from "lucide-react";

export function RichTextEditor({
  value,
  onChange,
  label = "Contenu",
}: {
  value: string;
  onChange: (html: string) => void;
  label?: string;
}) {
  const [htmlMode, setHtmlMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-xl max-w-full h-auto" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Commencez à rédiger votre contenu..." }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "min-h-72 px-5 py-4 text-sm leading-7 text-white/85 outline-none",
      },
    },
  });

  const uploadImages = async (files: FileList | null) => {
    if (!files || !editor) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const data = new FormData();
      data.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: data });
      const result = await response.json();
      if (result.success) editor.chain().focus().setImage({ src: result.url, alt: file.name }).run();
    }
    setUploading(false);
  };

  const addLink = () => {
    if (!editor) return;
    const href = window.prompt("Adresse du lien");
    if (href) editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  };
  const addMap = () => {
    if (!editor) return;
    const address = window.prompt("Adresse à afficher sur la carte (ex: 5 Rue de Constantine, 72000 Le Mans)");
    if (!address) return;
    const q = encodeURIComponent(address);
    const html = `<div style="margin:1.5rem 0;border-radius:1rem;overflow:hidden;border:1px solid rgba(205,121,66,.3)"><iframe src="https://www.google.com/maps?q=${q}&output=embed" width="100%" height="350" style="border:0;display:block" allowfullscreen loading="lazy"></iframe></div>`;
    editor.chain().focus().insertContent(html).run();
  };
  const openFilePicker = () => fileInput.current?.click();

  const tool = (label: string, icon: React.ReactNode, action: () => void, active = false) => (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={action}
      className={`flex h-9 w-9 items-center justify-center rounded-md transition ${active ? "bg-brand-magenta text-white" : "text-white/65 hover:bg-white/10 hover:text-white"}`}
    >
      {icon}
    </button>
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-white/75">{label}</label>
        <button type="button" onClick={() => setHtmlMode(!htmlMode)} className="flex items-center gap-2 rounded-md px-3 py-2 text-[11px] font-semibold text-brand-orange hover:bg-brand-orange/10">
          <Code2 size={14} /> {htmlMode ? "Éditeur visuel" : "Mode HTML"}
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border border-brand-purple/30 bg-[#08051f] focus-within:border-brand-magenta">
        {!htmlMode && (
          <div className="flex flex-wrap gap-1 border-b border-brand-purple/20 bg-[#1a1238]/70 p-2">
            {tool("Titre 1", <Heading1 size={15} />, () => editor?.chain().focus().toggleHeading({ level: 1 }).run(), !!editor?.isActive("heading", { level: 1 }))}
            {tool("Titre 2", <Heading2 size={15} />, () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), !!editor?.isActive("heading", { level: 2 }))}
            {tool("Titre 3", <Heading3 size={15} />, () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), !!editor?.isActive("heading", { level: 3 }))}
            {tool("Gras", <Bold size={15} />, () => editor?.chain().focus().toggleBold().run(), !!editor?.isActive("bold"))}
            {tool("Italique", <Italic size={15} />, () => editor?.chain().focus().toggleItalic().run(), !!editor?.isActive("italic"))}
            {tool("Souligné", <UnderlineIcon size={15} />, () => editor?.chain().focus().toggleUnderline().run(), !!editor?.isActive("underline"))}
            {tool("Liste", <List size={15} />, () => editor?.chain().focus().toggleBulletList().run(), !!editor?.isActive("bulletList"))}
            {tool("Liste numérotée", <ListOrdered size={15} />, () => editor?.chain().focus().toggleOrderedList().run(), !!editor?.isActive("orderedList"))}
            {tool("Citation", <Quote size={15} />, () => editor?.chain().focus().toggleBlockquote().run(), !!editor?.isActive("blockquote"))}
            {tool("Lien", <Link2 size={15} />, addLink, !!editor?.isActive("link"))}
            {tool("Aligner à gauche", <AlignLeft size={15} />, () => editor?.chain().focus().setTextAlign("left").run())}
            {tool("Centrer", <AlignCenter size={15} />, () => editor?.chain().focus().setTextAlign("center").run())}
            {tool("Aligner à droite", <AlignRight size={15} />, () => editor?.chain().focus().setTextAlign("right").run())}
            {tool("Séparateur", <Minus size={15} />, () => editor?.chain().focus().setHorizontalRule().run())}
            {tool("CTA", <Megaphone size={15} />, () => editor?.chain().focus().insertContent('<div class="cms-cta"><h2>Prêt à démarrer votre projet ?</h2><p>Parlez-nous de votre besoin.</p><a href="/devis-sur-mesure">Demander un devis</a></div>').run())}
            {tool("Carte", <MapPin size={15} />, addMap)}
            {tool(uploading ? "Téléchargement..." : "Ajouter des images", <ImagePlus size={15} />, openFilePicker)}
            {tool("Annuler", <Undo2 size={15} />, () => editor?.chain().focus().undo().run())}
            {tool("Rétablir", <Redo2 size={15} />, () => editor?.chain().focus().redo().run())}
            <input ref={fileInput} type="file" accept="image/*" multiple className="hidden" onChange={(event) => uploadImages(event.target.files)} />
          </div>
        )}
        {htmlMode ? (
          <textarea value={value} onChange={(event) => onChange(event.target.value)} className="min-h-80 w-full resize-y border-0 bg-[#08051f] p-5 font-mono text-sm text-white outline-none" />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
      <p className="text-[10px] text-white/40">Glissez votre contenu dans une structure claire. Les images multiples sont insérées dans l&apos;ordre sélectionné.</p>
    </div>
  );
}
