import React, { useEffect, useState } from "react";
import "./style.scss";
import ListeningUpdate from "./updateType/ListeningUpdate";
import ReadingUpdate from "./updateType/ReadingUpdate";
import QuizUpdate from "./updateType/QuizUpdate";
const UpdateLesson = ({ setUpdateLesson, item }) => {
    const [previousLink, setPreviousLink] = useState(false);
    const [type, setType] = useState(item?.type || "listening");

    useEffect(() => {
        setType(item?.item?.type);
    }, [item]);

    return (
        <div className="lessonCreate">
            <div className="lessonCreate_wrap">
                <div className="expertCourse_close">
                    <div
                        onClick={() => {
                            setUpdateLesson(false);
                            setType("listening");
                        }}
                        className="expertCourse_close_icons"
                    >
                        &times;
                    </div>
                </div>
                <div className="lessonCreate_title">Update Lesson</div>
                <div className="lessonCreate_type">
                    {type === "listening" && (
                        <div className="lessonCreate_type_form">
                            {type === "listening" ? (
                                <input
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setType("listening");
                                        }
                                    }}
                                    id="listeningUpdate"
                                    type="radio"
                                    name="lessonUpdate"
                                    defaultChecked
                                />
                            ) : (
                                <input
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setType("listening");
                                        }
                                    }}
                                    id="listeningUpdate"
                                    type="radio"
                                    name="lessonUpdate"
                                />
                            )}
                            <label htmlFor="listeningUpdate">Listening</label>
                        </div>
                    )}
                    {type === "reading" && (
                        <div className="lessonCreate_type_form">
                            {type === "reading" ? (
                                <input
                                    id="readingupdate"
                                    type="radio"
                                    name="lessonUpdate"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setType("reading");
                                        }
                                    }}
                                    defaultChecked
                                />
                            ) : (
                                <input
                                    id="readingupdate"
                                    type="radio"
                                    name="lessonUpdate"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setType("reading");
                                        }
                                    }}
                                />
                            )}
                            <label htmlFor="readingupdate">Reading</label>
                        </div>
                    )}
                    {type === "quiz" && (
                        <div className="lessonCreate_type_form">
                            {type === "quiz" ? (
                                <input
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setType("quiz");
                                        }
                                    }}
                                    id="quizUpdate"
                                    type="radio"
                                    name="lessonUpdate"
                                    defaultChecked
                                />
                            ) : (
                                <input
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setType("quiz");
                                        }
                                    }}
                                    id="quizUpdate"
                                    type="radio"
                                    name="lessonUpdate"
                                />
                            )}
                            <label htmlFor="quizUpdate">Quiz</label>
                        </div>
                    )}
                </div>
                <div className="lessonCreate_form">
                    {type === "listening" && (
                        <ListeningUpdate data={item?.item} />
                    )}
                    {type === "reading" && <ReadingUpdate data={item?.item} />}
                    {type === "quiz" && <QuizUpdate data={item?.item} />}
                </div>
            </div>
            {type === "reading" && (
                <div
                    onClick={() => {
                        setPreviousLink(true);
                    }}
                    className="previousLink"
                >
                    Previous Upload File Link
                </div>
            )}
            {type === "reading" && previousLink && (
                <div className="lessonCreate previousLink_form">
                    <div className="previousLink_wrap">
                        <div className="expertCourse_close">
                            <div
                                onClick={() => {
                                    setPreviousLink(false);
                                }}
                                className="expertCourse_close_icons"
                            >
                                &times;
                            </div>
                        </div>
                        <div className="previousLink_list">
                            <ul>
                                <li>
                                    <a href="#">oki</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateLesson;
