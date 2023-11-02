import React, { useMemo, useState } from "react";
import { Button, Col, Form, Modal, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-Select";
import { Tag } from "../App";
import NoteCard from "./NoteCard";

type NoteReview = {
    id: string;
    title: string;
    tags: Tag[];
};

type NoteFormProps = {
    updateTags: (id: string, label: string) => void;
    deleteTags: (id: string) => void;
    availableTags: Tag[];
    notes: NoteReview[];
};

export const NoteList: React.FC<NoteFormProps> = ({
    updateTags,
    deleteTags,
    availableTags,
    notes,
}) => {
    const [title, setTitle] = useState<string>("");
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);

    const filteredNotes = useMemo(() => {
        return notes.filter((note) => {
            return (
                (title === "" ||
                    note.title
                        .toLowerCase()
                        .includes(title.toLocaleLowerCase())) &&
                (selectedTags.length === 0 ||
                    selectedTags.every((tag) =>
                        note.tags.some((noteTag) => noteTag.id === tag.id)
                    ))
            );
        });
    }, [title, selectedTags, notes]);

    return (
        <>
            <Row className="align-items-center mb-4">
                <Col>
                    <h1>Notes</h1>
                </Col>
                <Col xs="auto">
                    <Stack direction="horizontal" gap={2}>
                        <Link to="/new">
                            <Button variant="primary">Create</Button>
                        </Link>
                        <Button
                            onClick={() => setOpenModal(true)}
                            variant="outline-secondary"
                        >
                            Edit tags
                        </Button>
                    </Stack>
                </Col>
            </Row>
            <Form>
                <Row className="mb-4">
                    <Col>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            <ReactSelect
                                isMulti
                                value={selectedTags.map((tag) => ({
                                    label: tag.label,
                                    value: tag.id,
                                }))}
                                options={availableTags.map((tag) => {
                                    return { label: tag.label, value: tag.id };
                                })}
                                onChange={(tags) => {
                                    setSelectedTags(
                                        tags.map((tag) => ({
                                            label: tag.label,
                                            id: tag.value,
                                        }))
                                    );
                                }}
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
                {filteredNotes.map((note) => (
                    <Col key={note.id}>
                        <NoteCard
                            id={note.id}
                            title={note.title}
                            tags={note.tags}
                        />
                    </Col>
                ))}
            </Row>
            <EditTextModal
                availableTags={availableTags}
                show={openModal}
                handleClose={() => setOpenModal(!openModal)}
                deleteTags={deleteTags}
                updateTags={updateTags}
            />
        </>
    );
};

type EditTextModalProps = {
    availableTags: Tag[];
    show: boolean;
    handleClose: () => void;
    updateTags: (id: string, label: string) => void;
    deleteTags: (id: string) => void;
};

const EditTextModal: React.FC<EditTextModalProps> = ({
    availableTags,
    show,
    handleClose,
    deleteTags,
    updateTags,
}) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Tags</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Stack gap={2}>
                        {availableTags.map((tag) => (
                            <Row key={tag.id}>
                                <Col>
                                    <Form.Control
                                        value={tag.label}
                                        type="text"
                                        onChange={(e) =>
                                            updateTags(tag.id, e.target.value)
                                        }
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button
                                        variant="outline-danger"
                                        onClick={() => deleteTags(tag.id)}
                                    >
                                        &times;
                                    </Button>
                                </Col>
                            </Row>
                        ))}
                    </Stack>
                </Form>
            </Modal.Body>
        </Modal>
    );
};
