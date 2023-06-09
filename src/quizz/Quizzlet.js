import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import QuizzCard from "./QuizzCard";
import "./style.scss";
const Quizzlet = ({ item, updateLesson, setUpdateLesson }) => {
	const [quiz, setQuiz] = useState(false);

	const [times, setTimes] = useState(1800);
	const [percent, setPercent] = useState(86);

	const [result, setResult] = useState(false);

	const enrollTimeRef = useRef(0);

	useEffect(() => {
		if (item) {
			setTimes(item?.time);
			enrollTimeRef.current = new Date();
		}
	}, [item]);

	useEffect(() => {
		if (quiz) {
			if (times < 1) {
				handleSubmitButton();
				toast.warn("Time up");
				return;
			}
			if (result) {
				return;
			}
			const timesInterval = setInterval(() => {
				setTimes((prev) => {
					if (prev < 1) {
						return prev;
					}
					return prev - 1;
				});
			}, 1000);
			return () => {
				clearInterval(timesInterval);
			};
		}
	}, [times, quiz]);

	const [quizLearn, setQuizLearn] = useState([]);

	const { lessonid } = useParams();

	const auth = useSelector((state) => state.auth);

	useEffect(() => {
		if (item) {
			const arr = item?.value?.map((infor) => {
				return {
					questionID: infor.questionID,
					answer: null,
				};
			});
			setQuizLearn([...arr]);
		}
	}, [item]);

	const handleSubmitButton = async () => {
		const check = quizLearn?.some((item) => item?.answer === null);
		if (check && times > 1) {
			return toast.error("Please enter all answer.");
		}
		try {
			const data = await axios.post(
				"/api/lesson/quiz/submit",
				{
					quiz: quizLearn,
					lessonID: lessonid,
					finishTime: new Date(),
					enrollTime: enrollTimeRef.current,
				},
				{
					headers: {
						token: auth.user?.token,
					},
				}
			);
			setResult(data?.data);
			setPercent(data?.data?.percentCal * 1);
		} catch (err) {
			setResult({
				totalQuestion: 0,
				totalCorrectAnswer: 0,
				result: false,
			});
			setPercent(financial((0 / 1) * 100));
			return toast.error(err?.response?.data?.msg);
		}
	};
	function financial(x) {
		return Number.parseFloat(x).toFixed(2);
	}

	const style = {
		background: `conic-gradient(#F05123 ${percent * 3.6}deg,transparent 0deg)`,
	};
	return (
		<div className="quizz">
			{!quiz ? (
				<div className="quizz_form">
					<div className="quiz_all">
						<div className="quiz_title">
							<span>{item?.title}</span>
						</div>
						<div className="quiz_times">
							<span>
								<i>
									Quiz .{" "}
									{`${
										Math.floor(item?.time / 3600) < 10 ? "0" : ""
									}${Math.floor(item?.time / 3600)}h :
                                
                                ${
																	Math.floor(item?.time / 3600) > 0
																		? `${
																				Math.floor(item?.time / 60) -
																					Math.floor(item?.time / 3600) * 60 <
																				10
																					? "0"
																					: ""
																		  }${
																				Math.floor(item?.time / 60) -
																				Math.floor(item?.time / 3600) * 60
																		  }`
																		: `${
																				Math.floor(item?.time / 60) < 10
																					? "0"
																					: ""
																		  }${Math.floor(item?.time / 60)}`
																}m : ${
										Math.floor(item?.time) - Math.floor(item?.time / 60) * 60 <
										10
											? "0"
											: ""
									}${
										Math.floor(item?.time) - Math.floor(item?.time / 60) * 60
									}s`}
								</i>
							</span>
						</div>
						<div className="quiz_content">
							<div className="quiz_content_content">
								<i>{item?.description}</i>
							</div>
							<div className="quiz_content_button">
								<button
									onClick={() => {
										setQuiz(true);
									}}
									style={{
										height: "7rem",
										padding: "0 3rem",
										fontSize: "1.6rem",
									}}
									className="button"
								>
									Join to the Quizz
								</button>
							</div>
						</div>
						{item?.quizResultDTO && (
							<div className="quiz_old_result">
								<div className="quiz_old_nav_1">
									<div className="quiz_receive_grade">
										<div
											style={
												!item?.quizResultDTO?.quizStatus
													? {
															backgroundColor: "red",
													  }
													: {}
											}
											className="quiz_receive_checked"
										>
											<i className="fa-solid fa-check"></i>
										</div>
										<b>Receive grade</b>
									</div>
									<div className="quiz_receive_passGrade">
										<b className="quiz_receive_passGradeWord">To Pass</b> 80% or
										higher
									</div>
								</div>
								<div className="quiz_old_nav_2">
									<div>
										<b>Your grade</b>
									</div>
									<div
										style={
											!item?.quizResultDTO?.quizStatus
												? {
														color: "red",
												  }
												: {}
										}
										className="quiz_old_grade"
									>
										{item?.quizResultDTO?.result}%
									</div>
								</div>
								<div className="quiz_old_nav_3">
									<span>
										The result will be the score of the most recent test (We
										will not save based on your highest score).
									</span>
								</div>
							</div>
						)}
					</div>
				</div>
			) : (
				<div className="quiz_abs">
					<div className="quiz_abs_container">
						<div className="quizz_time">
							<span>Time remains </span>
							<i>
								{Math.floor(times / 60) < 10 && "0"}
								{Math.floor(times / 60)} :{" "}
								{times - Math.floor(times / 60) * 60 < 10 && "0"}
								{times - Math.floor(times / 60) * 60}
							</i>
						</div>
						<div className="quiz_abs_card_container">
							{item?.value?.map((infor, index) => (
								<QuizzCard
									setQuizLearn={setQuizLearn}
									quizLearn={quizLearn}
									index={index}
									item={infor}
									key={infor?.questionID}
								/>
							))}
							<div className="quiz_abs_card_button_save">
								<button
									onClick={handleSubmitButton}
									style={{
										padding: "0 9rem",
										height: "5rem",
										fontSize: "2rem",
										borderRadius: "3rem",
									}}
									className="button"
								>
									Submit
								</button>
							</div>
						</div>
					</div>
					{result && (
						<div className="quiz_result">
							<div className="quiz_result_form">
								<div className="expertCourse_close">
									<div
										onClick={() => {
											setResult(false);
											setQuiz(false);
											setTimes(item?.time);
											setUpdateLesson(!updateLesson);
										}}
										className="expertCourse_close_icons"
									>
										&times;
									</div>
								</div>
								<div className="quiz_result_item_container">
									<div className="quiz_result_item">
										<div style={style} className="circle_result">
											<div className="number">{result?.percentCal * 1}%</div>
										</div>
									</div>
									<div className="quiz_result_result">
										<div className="quiz_result_item_card">
											<span>
												<i>Total Questions</i>: <b>{quizLearn?.length}</b>
											</span>
										</div>
										<div className="quiz_result_item_card">
											<span>
												<i>Correct Answers</i>:{" "}
												<b>{result?.totalCorrectAnswer}</b>
											</span>
										</div>
										<div className="quiz_result_item_card">
											<span>
												<i>Result</i>:{" "}
												<b
													style={!result.result ? { color: "red" } : {}}
													className="result_color"
												>
													{result.result ? "Passed" : "Not Passed"}
												</b>
											</span>
										</div>
									</div>
								</div>
								<div className="resultButton">
									<button
										onClick={() => {
											setResult(false);
											setQuiz(false);
											setTimes(item?.time);
											setUpdateLesson(!updateLesson);
										}}
										style={{
											height: "4rem",
											padding: "0 4rem",
										}}
										className="button button_update"
									>
										Ok
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default Quizzlet;
