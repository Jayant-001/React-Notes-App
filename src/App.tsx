import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import NewNote from "./components/NewNote";
import { useLocalStorage } from "./custom-hooks/useLocalStorage";
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { NoteList } from "./components/NoteList";
import NotePage from "./components/NotePage";
import Note from "./components/Note";
import EditNote from "./components/EditNote";

export type Note = {
    id: string;
} & NoteData;

export type NoteData = {
    title: string;
    body: string;
    tags: Tag[];
};

export type Tag = {
    id: string;
    label: string;
};

export type RawNote = {
    id: string;
} & RawNoteData;

export type RawNoteData = {
    title: string;
    body: string;
    tagIds: string[];
};

function App() {
    const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
    const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

    const notesWithTags = useMemo(() => {
        return notes.map((note) => ({
            ...note,
            tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
        }));
    }, [notes, tags]);

    const onCreateNote = ({ tags, ...data }: NoteData) => {
        setNotes((prevNotes) => {
            return [
                ...prevNotes,
                { ...data, id: uuidv4(), tagIds: tags.map((tag) => tag.id) },
            ];
        });
    };

    const onUpdateNote = (id: string, { tags, ...data }: NoteData) => {
        setNotes((prevNotes) => {
            return prevNotes.map((note) => {
                if (note.id == id) {
                    return {
                        ...note,
                        ...data,
                        tagIds: tags.map((tag) => tag.id),
                    };
                } else {
                    return note;
                }
            });
        });
    };

    const onDeleteNote = (id: string) => {
        setNotes((prevNotes) => {
            return prevNotes.filter((note) => note.id !== id);
        });
    };

    function addTag(tag: Tag) {
        setTags((prev) => [...prev, tag]);
    }

    function updateTags(id: string, label: string) {
        setTags((prevTags) => {
            return prevTags.map((tag) => {
                if (tag.id == id) return { ...tag, label };
                else return tag;
            });
        });
    }

    function deleteTags(id: string) {
        setTags((prevTags) => {
            return prevTags.filter((tag) => tag.id !== id);
        });
    }

    return (
        <Container className="my-4">
            <Routes>
                <Route
                    path="/"
                    element={
                        <NoteList updateTags={updateTags} deleteTags={deleteTags} availableTags={tags} notes={notesWithTags} />
                    }
                />
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/:id" element={<NotePage notes={notesWithTags} />}>
                    <Route index element={<Note onDelete={onDeleteNote} />} />
                    <Route
                        path="edit"
                        element={
                            <EditNote
                                onAddTag={addTag}
                                availableTags={tags}
                                onSubmit={onUpdateNote}
                            />
                        }
                    />
                </Route>
                <Route
                    path="/new"
                    element={
                        <NewNote
                            onAddTag={addTag}
                            availableTags={tags}
                            onSubmit={onCreateNote}
                        />
                    }
                />
            </Routes>
        </Container>
    );
}

export default App;
