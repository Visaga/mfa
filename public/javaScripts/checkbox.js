const checkBox = document.querySelector("#checkBox");

checkBox.addEventListener("input", () => {
	if ( checkBox.checked)	document.querySelector("#hiddenCheckBox").value = checkBox.checked;
	
});