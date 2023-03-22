import React, {
	useRef,
	useState,
	useCallback,
	useEffect,
	useContext,
} from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import CoursePanelEdit from "../../coursePanel/CoursePanelEdit";
import "../style.scss";
import Listening from "./type/Listening";
import Quiz from "./type/Quiz";
import Reading from "./type/Reading";
import Select from "react-select";
import axios from "axios";
import { UserContext } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import { isFailing, isLoading, isSuccess } from "../../redux/slice/auth";
import { useParams } from "react-router-dom";
const CreateCourse = () => {
	const benefitRef = useRef();
	const [benefit, setBenefit] = useState([]);
	const [courseExpert, setCourseExpert] = useState("");
	const [expert, setExpert] = useState(false);
	const [image, setImage] = useState("");
	const [inputForm, setInputForm] = useState(false);
	const [previousLink, setPreviousLink] = useState(false);
	const [lesson, setLesson] = useState([]);
	const imageRef = useRef();
	const lessonRef = useRef();
	const [addLesson, setAddLesson] = useState(false);

	const contentRef = useRef();

	const { cache } = useContext(UserContext);

	const { slug } = useParams();

	const [selectedOption, setSelectedOption] = useState(null);

	const titleRef = useRef();
	const [newPrice, setNewPrice] = useState("");

	const dispatch = useDispatch();

	const [types, setTypes] = useState([]);

	const [optionsKind, setOptionKind] = useState({});

	useEffect(() => {
		if (types) {
			const arr = types?.map((item) => {
				return {
					value: item?.courseTypeID,
					label: item?.courseTypeName,
				};
			});
			setOptionKind([...arr]);
		}
	}, [types]);
	const [courseExperts, setCourseExperts] = useState([]);

	useEffect(() => {
		let here = true;
		const url = "/api/type_course";
		if (cache.current[url]) {
			return setTypes(cache.current[url]);
		}
		dispatch(isLoading());
		axios
			.get(url)
			.then((res) => {
				if (!here) {
					return;
				}
				setTypes(res?.data?.types);
				cache.current[url] = res?.data?.types;
				dispatch(isSuccess());
			})
			.catch((err) => {
				dispatch(isFailing());
			});
		return () => {
			here = false;
		};
	}, []);

	useEffect(() => {
		let here = true;
		if (slug === "create_course") {
			const url = "/api/account/course_expert?search=null";
			dispatch(isLoading());
			axios
				.get(url)
				.then((res) => {
					if (!here) {
						return dispatch(isSuccess());
					}
					setCourseExperts(res?.data?.users);
					cache.current[url] = res?.data?.users;
					dispatch(isSuccess());
				})
				.catch((err) => {
					dispatch(isFailing());
				});
		}
		return () => {
			here = false;
		};
	}, [slug]);

	const [urlArray, setUrlArray] = useState([]);

	const [numberOfLesson, setNumberOfLesson] = useState({
		num: 0,
		time: 0,
	});
	const urlArrayRef = useRef([]);

	const [type, setType] = useState("listening");

	const handleCreateBenefit = () => {
		if (!benefitRef.current.value) {
			return toast.error("Please, enter information.");
		}
		setBenefit([...benefit, benefitRef.current?.value]);
		benefitRef.current.value = "";
	};

	const handleChooseExpert = (item) => {
		const check = window.confirm(
			`Do you wanna choose ${item?.name} for this course?`
		);
		if (check) {
			setCourseExpert({
				...item,
			});
			setExpert(false);
		}
	};

	const handleCreateLesson = () => {
		setLesson([
			...lesson,
			{
				packageTitle: lessonRef.current.value,
				packageID: null,
				numLesson: [],
			},
		]);
		lessonRef.current.value = "";
	};

	const handleDeleteList = (e) => {
		benefit.splice(e, 1);
		setBenefit([...benefit]);
	};

	const onDrop = useCallback((acceptedFiles) => {
		const url = URL.createObjectURL(acceptedFiles[0]);
		if (image) {
			URL.revokeObjectURL(image);
		}
		imageRef.current = acceptedFiles[0];
		setImage(url);
	}, []);

	useEffect(() => {
		let coun = 0;
		let tim = 0;
		lesson?.forEach((item) => {
			coun += item?.numLesson?.length;
			item?.numLesson?.forEach((item) => {
				tim += item?.time * 1;
			});
		});
		setNumberOfLesson({
			num: coun,
			time: tim,
		});
	}, [lesson]);

	const auth = useSelector((state) => state.auth);

	const lessonLengthRef = useRef();
	const numOfLessonRef = useRef();
	const timeOfLessonRef = useRef();

	const [msg, setMsg] = useState({});

	const idRef = useRef(null);

	const handleCreateNewCourse = async () => {
		const title = titleRef.current.value;
		if (idRef.current) {
			toast.error("Please save pakage first");
			return setMsg({});
		}
		let m = {};
		if (!title) {
			m["courseName"] = "Please enter title of this course!";
		}
		if (!contentRef.current.value) {
			m["description"] = "Please enter description for this course!";
		}
		if (!newPrice) {
			m["price"] = "Please enter price for this course!";
		}
		if (!selectedOption) {
			m["kind"] = "Please choose kind for this course!";
		}
		if (isNaN(newPrice)) {
			m["price"] = "Price is a number!";
		} else {
			if (newPrice * 1 < 0) {
				m["price"] = "Price must be greater than 0!";
			}
		}
		if (!imageRef.current) {
			m["image"] = "Please enter image for this course!";
		}
		if (!courseExpert) {
			m["courseExpert"] = "Please choose course expert!";
		}
		if (
			!title ||
			!contentRef.current.value ||
			!newPrice ||
			!selectedOption?.value ||
			isNaN(newPrice) ||
			!courseExpert
		) {
			return setMsg({ ...m });
		}
		setMsg({});
		let contentArr = contentRef.current.value + "--?--";
		benefit.forEach((item, index) => {
			if (index !== benefit.length - 1) {
				contentArr += item + "--?--";
			} else {
				contentArr += item;
			}
		});

		let urlImage = "";
		if (imageRef.current) {
			const formData = new FormData();
			formData.append("file", imageRef.current);
			formData.append("upload_preset", "sttruyenxyz");
			try {
				const res = await axios.post(
					"https://api.cloudinary.com/v1_1/sttruyen/image/upload",
					formData
				);
				urlImage = "https:" + res.data.url.split(":")[1];
			} catch (err) {
				return;
			}
		} else {
			return;
		}

		dispatch(isLoading());
		try {
			const data = await axios.post(
				"/api/course/create",
				{
					courseID: null,
					courseName: title,
					description: contentArr,
					accountID: courseExpert?.accountID,
					courseTypeID: selectedOption?.value,
					price: newPrice * 1,
					image: urlImage,
				},
				{
					headers: {
						token: auth.user?.token,
					},
				}
			);
			dispatch(isSuccess());
			toast.success(data?.data?.msg);

			idRef.current = data?.data?.courseID;
			imageRef.current = "";
		} catch (err) {
			toast.error(err?.response?.data?.msg);
			let ms = {};
			err?.response?.data?.msgProgress?.forEach((item) => {
				ms[item?.errorName] = item?.message;
			});
			setMsg({ ...ms });
			dispatch(isFailing());
		}
	};

	const handleCreatePakageForACourse = async () => {
		if (idRef.current) {
			dispatch(isLoading());
			try {
				const data = await axios.post(
					`/api/course/update_pakage/id=${idRef.current}`,
					{
						lessonPakages: lesson,
						deletePackage: null,
						deleteLesson: null,
						deleteQuestion: null,
					},
					{
						headers: {
							token: auth.user?.token,
						},
					}
				);
				dispatch(isSuccess());
				toast.success(data?.data?.msg);
				idRef.current = "";
				imageRef.current = "";
				contentRef.current.value = "";
				titleRef.current.value = "";
				setBenefit([]);
				setImage("");
				setNewPrice("");
				document.getElementById("priceOfCourseCreate").innerHTML = "";
				setCourseExpert("");
				setSelectedOption("");
				setLesson([]);
			} catch (err) {
				toast.error(err?.response?.data?.msg);
				let ms = {};
				err?.response?.data?.msgProgress?.forEach((item) => {
					ms[item?.errorName] = item?.message;
				});
				setMsg({ ...ms });
				dispatch(isFailing());
			}
		} else {
			return toast.error("Please Save course first.");
		}
	};

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
	});

	return (
		<div className="managerCourse">
			<div className="row">
				<div className="col c-12 m-8 l-8">
					<div className="newPost_title">
						{msg["courseName"] && (
							<div style={{ top: "-3rem" }} className="errorManage">
								* <i>{msg["courseName"]}</i>
							</div>
						)}
						<textarea
							ref={titleRef}
							className="create_input_title"
							type="text"
							placeholder="Title"
						/>
					</div>
					<div className="newPost_title">
						{msg["description"] && (
							<div style={{ top: "-3.3rem" }} className="errorManage">
								* <i>{msg["description"]}</i>
							</div>
						)}
						<textarea
							ref={contentRef}
							className="create_input_Content"
							type="text"
							placeholder="Content"
						/>
					</div>
					<div className="course_detail_learn">
						<h3>The benefits of this course:</h3>
						<div className="create_course_input">
							<input ref={benefitRef} type="text" placeholder="Enter benefit" />
							<button onClick={handleCreateBenefit}>Send</button>
						</div>
					</div>
					<ul id="benefit" className="course_detail_learn_items">
						{benefit?.length === 0 ? (
							<li className="benefitList">Example of benefit of this course</li>
						) : (
							benefit?.map((item, index) => (
								<li className="benefitList" key={item + "benefit" + index}>
									{item}
									<div className="benefit_button">
										<button
											onClick={() => handleDeleteList(index)}
											className="delete_button"
										>
											Delete
										</button>
									</div>
								</li>
							))
						)}
					</ul>
					<div className="course_detail_learn">
						<h3>Content of this course</h3>
					</div>
					<div className="course_detail_timeLine">
						<ul>
							<li>
								<b ref={lessonLengthRef}>{lesson?.length}</b> Topics
							</li>
							<li>.</li>
							<li>
								<b ref={numOfLessonRef}>{numberOfLesson?.num}</b> Lessons
							</li>
							<li>.</li>
							<li>
								Times{" "}
								<b ref={timeOfLessonRef}>{`${
									Math.floor(numberOfLesson?.time / 3600) < 10 ? "0" : ""
								}${Math.floor(numberOfLesson?.time / 3600)} :
                                
                                ${
																	Math.floor(numberOfLesson?.time / 3600) > 0
																		? `${
																				Math.floor(numberOfLesson?.time / 60) -
																					Math.floor(
																						numberOfLesson?.time / 3600
																					) *
																						60 <
																				10
																					? "0"
																					: ""
																		  }${
																				Math.floor(numberOfLesson?.time / 60) -
																				Math.floor(
																					numberOfLesson?.time / 3600
																				) *
																					60
																		  }`
																		: `${
																				Math.floor(numberOfLesson?.time / 60) <
																				10
																					? "0"
																					: ""
																		  }${Math.floor(numberOfLesson?.time / 60)}`
																} : ${
									Math.floor(numberOfLesson?.time) -
										Math.floor(numberOfLesson?.time / 60) * 60 <
									10
										? "0"
										: ""
								}${
									Math.floor(numberOfLesson?.time) -
									Math.floor(numberOfLesson?.time / 60) * 60
								}`}</b>
							</li>
						</ul>
						<button
							style={{ height: "4rem" }}
							className="button button_update"
							onClick={handleCreatePakageForACourse}
						>
							Save Topics
						</button>
					</div>
					<div className="CoursePanel">
						{lesson?.map((item, index) => (
							<CoursePanelEdit
								setUrlArray={setUrlArray}
								urlArray={urlArray}
								urlArrayRef={urlArrayRef.current}
								setLesson={setLesson}
								setAddLesson={setAddLesson}
								lesson={lesson}
								key={index + "coursePanel"}
								item={item}
								index={index}
							/>
						))}
						{inputForm && (
							<div className="CoursePanel_wrap">
								<div className="CoursePanel_create_input">
									<input
										ref={lessonRef}
										type="text"
										placeholder="Enter title"
									/>
									<button onClick={handleCreateLesson}>Save</button>
								</div>
							</div>
						)}
						<div className="CoursePanel_wrap">
							<div className="CoursePanel_create_container">
								<div
									onClick={() => {
										setInputForm(!inputForm);
									}}
									title="Add more"
									className="plus"
								>
									+
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col c-12 m-4 l-4">
					<div
						style={{ position: "relative" }}
						className="course_create_detail_img"
					>
						{msg["image"] && (
							<div style={{ top: "-3.3rem" }} className="errorManage">
								* <i>{msg["image"]}</i>
							</div>
						)}
						<div className="movie_drop_zone">
							<div className="movie_drop_zone_wrap" {...getRootProps()}>
								<input {...getInputProps()} />
								<i className="fa-regular fa-image"></i>
								<div className="image_create_container">
									<img src={image} />
								</div>
							</div>
						</div>
					</div>
					<div style={{ marginLeft: "6rem" }} className="newPost_title">
						{msg["price"] && (
							<div
								style={{ top: "-3.3rem", wordBreak: "break-all" }}
								className="errorManage"
							>
								* <i>{msg["price"]}</i>
							</div>
						)}
						<div
							style={{
								color: "#F05123",
							}}
							className="newPost_title_edit"
							contentEditable={true}
							id="priceOfCourseCreate"
							onInput={(e) => {
								setNewPrice(e.target.innerHTML);
							}}
						></div>
						{!newPrice && (
							<div
								style={{
									color: "#F05123",
								}}
								className="newPost_title_content"
							>
								Enter Price
							</div>
						)}
					</div>
					<div className="course_detail_button">
						<button
							onClick={handleCreateNewCourse}
							title="Save this course"
							className="save_button"
						>
							Save
						</button>
					</div>
					<div style={{ position: "relative" }} className="type_select">
						{msg["kind"] && (
							<div
								style={{ top: "-5rem", right: "-8rem", left: "70%" }}
								className="errorManage"
							>
								* <i>{msg["kind"]}</i>
							</div>
						)}
						<Select
							className="search_wrap_select"
							defaultValue={selectedOption}
							onChange={setSelectedOption}
							options={optionsKind}
							placeholder="Kind"
						/>
					</div>
					<ul style={{ position: "relative" }} className="course_detail_list">
						{msg["courseExpert"] && (
							<div
								style={{ top: "-4rem", right: "-8rem", left: "80%" }}
								className="errorManage"
							>
								* <i>{msg["courseExpert"]}</i>
							</div>
						)}
						<li>
							<i>
								Course Expert:
								{courseExpert ? (
									<span
										onClick={() => {
											setExpert(true);
										}}
										className="choose_expert"
									>
										{courseExpert?.name}
									</span>
								) : (
									<span
										onClick={() => {
											setExpert(true);
										}}
										className="choose_expert"
									>
										Choose
									</span>
								)}
							</i>
						</li>
						<li>
							<i>Confident when studying</i>
						</li>
					</ul>
				</div>
			</div>
			{expert && (
				<div
					onClick={() => {
						setExpert(false);
					}}
					className="user_manager_information"
				></div>
			)}
			{expert && (
				<div className="expertCourse_container">
					<div className="expertCourse_close">
						<div
							onClick={() => {
								setExpert(false);
							}}
							className="expertCourse_close_icons"
						>
							&times;
						</div>
					</div>
					<div className="expertCourse_searching">
						<input type="text" placeholder="Searching by id, name or email" />
						<button className="button">Search</button>
					</div>
					<div className="expertCourse_form">
						<table className="ex_table">
							<thead className="ex_thead">
								<tr className="ex_thead_wrap">
									<th className="ex_thead_title">User</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{courseExperts?.map((item) => (
									<tr
										key={item?.accountID + "courseExperts"}
										className="ex_thead_wrap_items"
									>
										<th className="ex_thead_title">
											<div className="ex_thead_user">
												<div className="ex_thead_user_img">
													<img src={item?.image} alt="Ảnh" />
												</div>
												<div className="ex_thead_user_infor">
													<div className="ex_thead_user_infor_name">
														{item?.name}
													</div>
													<i className="ex_thead_user_infor_email">
														{item?.gmail}
													</i>
													<i className="ex_thead_user_infor_id">
														ID:{item?.accountID}
													</i>
												</div>
											</div>
										</th>
										<th className="ex_thead_button">
											<button onClick={() => handleChooseExpert(item)}>
												Choose
											</button>
										</th>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
			{addLesson && (
				<div className="lessonCreate">
					<div className="lessonCreate_wrap">
						<div className="expertCourse_close">
							<div
								onClick={() => {
									setAddLesson("");
									setType("listening");
								}}
								className="expertCourse_close_icons"
							>
								&times;
							</div>
						</div>
						<div className="lessonCreate_title">Create Lesson</div>
						<div className="lessonCreate_type">
							<div className="lessonCreate_type_form">
								{type === "listening" ? (
									<input
										onChange={(e) => {
											if (e.target.checked) {
												setType("listening");
											}
										}}
										id="listening"
										type="radio"
										name="lesson"
										defaultChecked
									/>
								) : (
									<input
										onChange={(e) => {
											if (e.target.checked) {
												setType("listening");
											}
										}}
										id="listening"
										type="radio"
										name="lesson"
									/>
								)}
								<label htmlFor="listening">Listening</label>
							</div>
							<div className="lessonCreate_type_form">
								{type === "reading" ? (
									<input
										id="reading"
										type="radio"
										name="lesson"
										onChange={(e) => {
											if (e.target.checked) {
												setType("reading");
											}
										}}
										defaultChecked
									/>
								) : (
									<input
										id="reading"
										type="radio"
										name="lesson"
										onChange={(e) => {
											if (e.target.checked) {
												setType("reading");
											}
										}}
									/>
								)}
								<label htmlFor="reading">Reading</label>
							</div>
							<div className="lessonCreate_type_form">
								{type === "quiz" ? (
									<input
										onChange={(e) => {
											if (e.target.checked) {
												setType("quiz");
											}
										}}
										id="quiz"
										type="radio"
										name="lesson"
										defaultChecked
									/>
								) : (
									<input
										onChange={(e) => {
											if (e.target.checked) {
												setType("quiz");
											}
										}}
										id="quiz"
										type="radio"
										name="lesson"
									/>
								)}
								<label htmlFor="quiz">Quiz</label>
							</div>
						</div>
						<div className="lessonCreate_form">
							{type === "listening" && (
								<Listening
									setLesson={setLesson}
									lesson={lesson}
									addLesson={addLesson}
									setAddLesson={setAddLesson}
									setType={setType}
								/>
							)}
							{type === "reading" && (
								<Reading
									setLesson={setLesson}
									lesson={lesson}
									addLesson={addLesson}
									setAddLesson={setAddLesson}
									setType={setType}
									urlArray={urlArray}
									setUrlArray={setUrlArray}
									urlArrayRef={urlArrayRef.current}
								/>
							)}
							{type === "quiz" && (
								<Quiz
									setLesson={setLesson}
									lesson={lesson}
									addLesson={addLesson}
									setAddLesson={setAddLesson}
									setType={setType}
								/>
							)}
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
										{urlArrayRef.current?.map((item, index) => (
											<li key={index + "listArray"}>
												<a href="#">{item}</a>
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default CreateCourse;
