import React, { useEffect, useState } from "react";

const CustomImageUpload = ({
	labelClass,
	imgPreview = true,
	info = true,
	previewClass,
	label = "Upload file",
	register = () => {}, // for working with react hook form
	onChange = () => {},
}) => {
	const [selectedFile, setSelectedFile] = useState(null);
	const [preview, setPreview] = useState(null);

	useEffect(() => {
		if (selectedFile) {
			const imgUrl = URL.createObjectURL(selectedFile);
			setPreview(imgUrl);
			return () => URL.revokeObjectURL(imgUrl);
		}
	}, [selectedFile]);

	const onSelectedFile = (e) => {
		if (!e.target.files || e.target.files.length === 0) {
			setSelectedFile(null);
			return;
		}
		setSelectedFile(e.target.files[0]);
	};

	return (
		<div>
			<label htmlFor="imageUpload" className={`cursor-pointer ${labelClass}`}>
				{label}
			</label>
			<input
				id="imageUpload"
				type="file"
				accept="image/*"
				// onChange={onSelectedFile}
				className="px-2 py-1.5 w-full border-2 rounded-md hidden"
				{...register("photo", {
					required: "Photo is required",
					onChange: (e) => {
						onSelectedFile(e);
						onChange(e);
					},
				})}
			/>
			{selectedFile && imgPreview && (
				<div className={`my-3 sm:h-48 h-32 aspect-video ${previewClass}`}>
					<img src={preview} className="object-cover w-full h-full " />
				</div>
			)}
			{selectedFile && info && (
				<p className="mt-3 text-sm text-gray-500">
					{selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
				</p>
			)}
		</div>
	);
};

export default CustomImageUpload;
