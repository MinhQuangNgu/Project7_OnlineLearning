import React, { useEffect, useState } from "react";
import "./style.scss";
import Card from "../card/Card";
import Pagination from "../paginating/Pagination";
import Select from "react-select";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { isFailing, isLoading, isSuccess } from "../redux/slice/auth";
import { useLocation, useNavigate } from "react-router-dom";
const Searching = () => {
	const [courses, setCourses] = useState([]);
	const [types, setTypes] = useState([]);

	const [optionsKind, setOptionKind] = useState({});

	const [updatePagePart, setUpdatePagePart] = useState(false);

	const options = [
		{ value: null, label: "All" },
		{ value: "free", label: "Free" },
		{ value: "no-free", label: "Not Free" },
	];

	const optionsSort = [
		{ value: null, label: "All" },
		{ value: "astar", label: "Stars Increased" },
		{ value: "dstar", label: "Stars Decreased" },
		{ value: "dcreatedAt", label: "Newest" },
		{ value: "acreatedAt", label: "Oldest" },
	];

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		let here = true;
		const url = "/api/type_course";
		dispatch(isLoading());
		axios
			.get(url)
			.then((res) => {
				if (!here) {
					return;
				}
				setTypes(res?.data?.types);
				dispatch(isSuccess());
			})
			.catch((err) => {
				dispatch(isFailing());
			});
		return () => {
			here = false;
		};
	}, []);

	const dispatch = useDispatch();
	const { search } = useLocation();

	useEffect(() => {
		let here = false;
		const sort = new URLSearchParams(search).get("sort") || null;
		const type = new URLSearchParams(search).get("type") || null;
		const kind = new URLSearchParams(search).get("kind") || null;
		const page = new URLSearchParams(search).get("page") || 1;
		const searching = new URLSearchParams(search).get("search") || null;
		const sortSearch = {
			sort: sort,
			type: type,
			kind: kind,
			page: page,
			limit: 20,
			search: searching,
		};
		if (sort || type || kind) {
			sortSearch.search = null;
		}
		if (sortSearch?.kind === "free") {
			sortSearch.kind = true;
		} else if (sortSearch.kind === "no-free") {
			sortSearch.kind = false;
		}

		const sortSearching = new URLSearchParams(sortSearch).toString();
		const url = `/api/common/course/getAllCourse?${sortSearching}`;
		dispatch(isLoading());
		axios
			.get(url)
			.then((res) => {
				dispatch(isSuccess());
				setCourses(res?.data);
			})
			.catch((err) => {
				dispatch(isFailing());
				toast.error(err?.response?.data?.msg);
			});
		return () => {
			here = false;
		};
	}, [search]);

	useEffect(() => {
		if (types) {
			const arr = types?.map((item) => {
				return {
					value: item?.courseTypeID,
					label: item?.courseTypeName,
				};
			});
			arr.unshift({
				value: null,
				label: "No sort",
			});
			setOptionKind([...arr]);
		}
	}, [types]);

	const navigate = useNavigate();

	const handleSearching = () => {
		const searching = {
			kind: selectedOptionKind?.value || null,
			type: selectedOptionType?.value || null,
			sort: selectedOptionSort?.value || null,
			search: null,
		};
		if (searching?.kind === "free") {
			searching.kind = true;
		} else if (searching.kind === "no-free") {
			searching.kind = false;
		}
		searching.page = 1;
		const searchingUrl = new URLSearchParams(searching).toString();
		navigate("?" + searchingUrl);
		setUpdatePagePart(!updatePagePart);
	};

	const [selectedOptionKind, setSelectedOptionKind] = useState(null);
	const [selectedOptionType, setSelectedOptionType] = useState(null);
	const [selectedOptionSort, setSelectedOptionSort] = useState(null);
	return (
		<div className="searching">
			<div className="searching_title">
				<h1>Course Search</h1>
			</div>
			<div className="searching_head">
				<Select
					className="search_wrap_select"
					defaultValue={selectedOptionKind}
					onChange={setSelectedOptionKind}
					options={options}
					placeholder="Kind"
				/>
				<Select
					className="search_wrap_select"
					defaultValue={selectedOptionType}
					onChange={setSelectedOptionType}
					options={optionsKind}
					placeholder="Type"
				/>
				<Select
					className="search_wrap_select"
					defaultValue={selectedOptionSort}
					onChange={setSelectedOptionSort}
					options={optionsSort}
					placeholder="Sort"
				/>
				<div className="button_container_searching">
					<button onClick={handleSearching}>Search</button>
				</div>
			</div>
			<div className="searching_card">
				<div className="row">
					{courses?.courses?.map((item) => (
						<div
							key={item?.courseID + "searching"}
							className="col c-12 m-6 l-3"
						>
							<Card item={item} />
						</div>
					))}

					{courses?.courses?.length === 0 && (
						<i className="no_course_found">No Courses Found</i>
					)}
				</div>
			</div>
			<div className="searching_paginating">
				<Pagination count={courses?.numPage} updatePagePart={updatePagePart} />
			</div>
		</div>
	);
};

export default Searching;
