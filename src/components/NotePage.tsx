import React from "react";
import { Note } from "../App";
import {
    Navigate,
    Outlet,
    useOutletContext,
    useParams,
} from "react-router-dom";

type NotePageProps = {
    notes: Note[];
};

const NotePage: React.FC<NotePageProps> = ({ notes }) => {
    const { id } = useParams();

    const note = notes.find((note) => note.id === id);

    if (note == null) return <Navigate to="/" replace />;

    return <Outlet context={note} />;
};

export function useNote() {
    return useOutletContext<Note>();
}

export default NotePage;
