

const addBtn = document.querySelector(".addParaghraf");

addBtn.addEventListener("click", addParagraf);


 
let sectionsCount = 0;

function addParagraf(){
	//remove submit btn 

const submitBtn = document.querySelector("[type='submit']").remove();
	
	
	const paragraf = document.createElement("div") 
	
	const i = document.querySelectorAll(".section").length > sectionsCount ? document.querySelectorAll(".section").length : sectionsCount;;
	paragraf.classList.add("section");
	
	paragraf.innerHTML = `
    <hr>
	<div class="title text-muted mb-3">  ${i } Paragraf  </div>
	
	<div class="input-group mb-3">
		 <input type="text" placeholder="Subtitle" class="form-control" name="blog[content][${ i }][subtitle]">
	</div>
	
   <div class="input-group mb-3">
  <span class="input-group-text">Paragraf</span>
  <textarea class="form-control" name="blog[content][${ i }][text]">Add some text here..</textarea>
</div>
	
	
	<div class="input-group mb-5">
		<span class="input-group-text">Image Alt / Img Path </span>
		<input type="text" placeholder="Alt / Descriptions" class="form-control" name="blog[content][${ i }][alt]">
		 <input type="text" placeholder="image Url" class="form-control" name="blog[content][${ i }][img]">
	</div>

  <input class="btn btn-success" type="submit" value="SAVE CHANGES">
`
	
	document.querySelector("form").append(paragraf);
	
}