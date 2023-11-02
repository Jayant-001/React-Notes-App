import React from "react";
import NoteForm from "./NoteForm";
import { NoteData, Tag } from "../App";

type NewNoteProps = {
    onSubmit: (noteData: NoteData) => void;
    onAddTag: (tag: Tag) => void;
    availableTags: Tag[];
};

const NewNote: React.FC<NewNoteProps> = ({
    onSubmit,
    onAddTag,
    availableTags,
}) => {
    return (
        <div>
            <h1>New Note</h1>
            <NoteForm
                onSubmit={onSubmit}
                onAddTag={onAddTag}
                availableTags={availableTags}
            />
        </div>
    );
};

export default NewNote;
