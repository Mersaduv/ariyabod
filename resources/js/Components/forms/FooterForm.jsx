import React from "react";
import { useForm } from "@inertiajs/react";
import useInertiaResponseHandler from "@/Hooks/useInertiaResponseHandler";
import { useTranslation } from "react-i18next";

// Tiptap imports
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { Button } from "../ui/Buttons";

export default function FooterForm({ footerData, message }) {
    const { t, i18n } = useTranslation();
    const {
        data,
        setData,
        post,
        processing,
        errors,
        wasSuccessful,
        recentlySuccessful,
    } = useForm({
        footer: footerData || "",
    });

    const isRtl = ["fa", "ps"].includes(i18n.language);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
        ],
        content: data.footer,
        onUpdate: ({ editor }) => {
            setData("footer", editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "min-h-[200px] border rounded p-2 focus:outline-none",
                dir: isRtl ? "rtl" : "ltr",
            },
        },
    });

    useInertiaResponseHandler({
        wasSuccessful,
        recentlySuccessful,
        errors,
        message,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.footer-design.save"));
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <h3 className="font-semibold text-lg">{t("edit_footer")}</h3>

            <div>{editor && <EditorContent editor={editor} />}</div>

            <Button type="submit" isLoading={processing} className="primary">
                {t("actions.save")}
            </Button>
        </form>
    );
}
