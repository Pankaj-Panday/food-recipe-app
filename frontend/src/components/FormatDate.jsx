import React from "react";
import { toDate, intlFormat } from "date-fns";

const FormatDate = ({ timestamp }) => {
	let newFormattedDate = "";
	if (timestamp) {
		const date = toDate(timestamp);
		// date and time can be formatted in single intlFormat also but
		// AM/PM wasn't uppercase when we use "en-IN" locale for time also
		const formattedDate = intlFormat(
			date,
			{
				hour12: true,
				year: "numeric",
				month: "short",
				day: "numeric",
			},
			{ locale: "en-IN" }
		);
		const formattedTime = intlFormat(
			date,
			{ hour: "2-digit", minute: "2-digit" },
			{ locale: "en-US" }
		);
		newFormattedDate = `${formattedDate} at ${formattedTime}`;
	}
	return <span>{newFormattedDate}</span>;
};

export default FormatDate;
