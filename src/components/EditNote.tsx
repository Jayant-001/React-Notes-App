import React from "react";
import NoteForm from "./NoteForm";
import { NoteData, Tag } from "../App";
import { useNote } from "./NotePage";

type EditNoteProps = {
    onSubmit: (id: string, noteData: NoteData) => void;
    onAddTag: (tag: Tag) => void;
    availableTags: Tag[];
};

const EditNote: React.FC<EditNoteProps> = ({
    onSubmit,
    onAddTag,
    availableTags,
}) => {
    const note = useNote();

    return (
        <div>
            <h1>New Note</h1>
            <NoteForm
                title={note.title}
                body={note.body}
                tags={note.tags}
                onSubmit={(data) => onSubmit(note.id, data)}
                onAddTag={onAddTag}
                availableTags={availableTags}
            />
        </div>
    );
};

export default EditNote;
