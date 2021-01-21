document.addEventListener("DOMContentLoaded", () => {
	
	
const mainContent = document.querySelector("#main-content");	
const rightBarBlocks = document.querySelector("#rightBarBlocks");
const rightBarStickyBlock = document.querySelector("#rightBar-stickyBlock");	
const lazyLoadingBlock = document.querySelector("#lazyLoadingBlock");


	
const category = document.querySelector("#category").textContent;
	
	
	//Render some blocks to Right Bar
	
	getBlogs(0,5,category)
	.then(data => renderBlogs(rightBarBlocks, data))
	.catch(err => console.log("Problem to load right bar content.. : " + err))
	.finally(() => { renderStickyBlock() });
	
	
	


	
	
	// RENDER ON SCROLL  TO BOTTOM BLOCK 
	
	//------settings-----
	const blogsPerRequest = 10;
	const blogSize = ["col-sm-6", "col-md-4", "col-lg-3"];
	let inProgress = false;
	let startFrom = 0;
	//-------------------
	
	
	window.addEventListener("scroll", () => {
		if ( (document.body.offsetHeight - window.pageYOffset) <= 1200 && inProgress == false){
			inProgress = true;
			
			getBlogs(startFrom, blogsPerRequest)
			.then(data => {
				if (data.length > 0){
					data = data.reverse();
					renderBlogs(lazyLoadingBlock, data, blogSize);
				} 
				return data;
			})
			.then((data) => {
				if (data.length == blogsPerRequest){
					startFrom += data.length;
					inProgress = false;
				} else {console.log("No more data available for the request")}
			})
			.catch(err => console.log("SOMETHING WHENT WRONG!!! TRY AGAIN LATER:  " + err));
		}
	});
	
	
	//===========FUNCTIONS============================
	
	//RENDER RECEIVED BLOGS
	
	function renderBlogs(parrent, data, blogSize = ["col-sm-12"]){
		 
		data.forEach(blog => {
			const blogPreview = document.createElement("div");
			       
			blogSize.forEach(size => blogPreview.classList.add(size));
			
			blogPreview.innerHTML = `
				<a href="/articles/${blog.urlExtention.replace(/ /g, "-") }/${ blog._id }" class="text-decoration-none text-dark">
					 <div>
							<div class="card mb-3">
							 <img src="${ blog.content[0].img }" class="card-img-top" alt="${ blog.title }">
							<div class="card-body">
							<h5 class="card-title"> ${ blog.title }..</h5> 
							  <time class="text-muted " datetime>${ blog.date }.</time>
						 </div>

						</div>
					</div>
				</a>`
			parrent.append(blogPreview);
		});
	}
	
	
	//SEND REQUEST

	function getBlogs(startFrom = 0, quantity = 5, category = "All"){

		return fetch(`/articles/get/${ startFrom }/${ category }/${ quantity }`)
		.then(respond => respond.json())
		.then(res => res)
		.catch(err => console.log("Failed to fetch"))	
	}
	
	
	// ========= RENDER STYCKY ADVERT BLOCK======================
	function renderStickyBlock(){
	const advert = document.createElement("div");
	
	advert.innerHTML = `
     <div class="advert">
         <h3 class="text-center"> Hello google</h3>
         <p class="text-muted"> Some advert text will go here in the future.. </p>
     </div>
`
	advert.style.cssText =`
    height: 600px;
    width: 300px;
     background: #ffc10750;
    margin-bottom: 50px;
`;
	
	rightBarStickyBlock.append(advert);
	rightBarStickyBlock.style.position = "sticky";
	rightBarStickyBlock.style.top = "100px";
	}
	

});