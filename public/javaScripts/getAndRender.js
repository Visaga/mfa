document.addEventListener("DOMContentLoaded", () => {
	
const mainContent = document.querySelector("#main-content");	
const rightBarBlocks = document.querySelector("#rightBarBlocks");
const rightBarStickyBlock = document.querySelector("#rightBar-stickyBlock");	
const lazyLoadingBlock = document.querySelector("#lazyLoadingBlock");


	
const category = document.querySelector("#category").textContent;
	
	
	//Render some blocks to Right Bar
	
	getBlogs(0,5,category)
	.then(data => renderBlogs(rightBarBlocks, data, "rel='nofollow'"))
	.catch(err => console.log("Problem to load right bar content.. : " + err))
	.finally(() => { renderStickyBlock() });
	
	

	
	
	// RENDER ON SCROLL  TO BOTTOM BLOCK 
	
	//------settings-----
	const blogsPerRequest = 10;
	const blogSize = ["col-sm-6", "col-lg-4","col-xl-3"];
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
					renderBlogs(lazyLoadingBlock, data, "rel='nofollow'",blogSize);
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
	
	function renderBlogs(parrent, data,rel = " ", blogSize = ["col-sm-12"], ){
		const currentBlogTitle = document.getElementById("title").innerText;
		
		data.forEach((blog, ind) => {
			if (blog.title != currentBlogTitle){
	
			const blogPreview = document.createElement("div");
			       
			blogSize.forEach(size => blogPreview.classList.add(size));
			
			const relAt = `rel="${ rel }"`
			const ifUpdatedDate = blog.modifiedDate.length > 1 ? blog.modifiedDate.slice(0,10): blog.createdDate.slice(0,10);
						
			blogPreview.innerHTML = `
				<a ${ rel } href="/articles/${blog.urlExtention.replace(/ /g, "-") }/${ blog._id }" class="text-decoration-none col text-dark">		 
					<div class="card mb-3 h-100  border-0 " >
						      <img src="${ blog.content[0].img.replace("/upload", "/upload/w_600") }" class="card-img-top rounded-0" alt="${ blog.title }">
						        <div class="card-body p-0 pt-2">
                                <div class="post-meta">
									<span class="post-category text-light">  ${ blog.category } </span>
									<span class="post-date text-muted"> ${ifUpdatedDate} </span>	
							    </div>

							  <h5 class="card-title"> ${ blog.title }</h5> 
						</div>
					</div>	
				</a>`
			
			parrent.append(blogPreview);
			}
		});
	}
	
	
	//SEND REQUEST

	function getBlogs(startFrom = 0, quantity = 5, category = "All"){

		return fetch(`/articles/get/${ startFrom }/${ category }/${ quantity }`)
		.then(respond => respond.json())
		.then(res => res)
		.catch(err => console.log("Failed to fetch" + err))	
	}
	
	
	
	
	// ========= RENDER STYCKY ADVERT BLOCK======================
	function renderStickyBlock(){
	const advert = document.createElement("div");
	
	advert.innerHTML = `
 

`
	advert.style.cssText =`
    height: 600px;
    width: 300px;;
     background: #ffc10750;
    margin-bottom: 50px;
`;
	
	rightBarStickyBlock.append(advert);
	rightBarStickyBlock.style.position = "sticky";
	rightBarStickyBlock.style.top = "20px";
	}
	

	
	
	
	
	// Render up to 5 similar content links
	
	const linkList = document.querySelector("#similar-articles");
	
	
	getBlogs(startFrom = 0, quantity = 20, "All")
	.then(data => renderSimilarContentLinks(data))
	
	
	
	async function renderSimilarContentLinks (data){
		const sameCategoryBlogs = await data.filter( blog => blog.category == category);
			
	    for(let i = 0; i < 5; i++){
			
			const link = document.createElement("li");
			link.innerHTML = ` <a href="${sameCategoryBlogs[i].urlExtention}" >${ sameCategoryBlogs[i].title} </a>`
			
			linkList.append(link)
		}
	}
	
	
	
});