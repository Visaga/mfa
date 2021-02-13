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
			
// 			if (ind % 2 == 0){
// 				const advert = document.createElement("div");
// 				advert.style.cssText = `
//                max-width: 100%;
//                min-width: 80%;
//                max-height: 700px;
//                min-height: 300px;
// `
// 				advert.innerHTML = `
// 						<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
// 						<!-- rightBar -->
// 						<ins class="adsbygoogle"
// 							 style="display:block"
// 							 data-ad-client="ca-pub-9771995363948446"
// 							 data-ad-slot="2816459747"
// 							 data-ad-format="auto"
// 							 data-full-width-responsive="true"></ins>
// 						<script>
// 							 (adsbygoogle = window.adsbygoogle || []).push({});
// 						</script>
// `
// 				parrent.append(advert);
// 			} 
			const relAt = `rel="${ rel }"`
			blogPreview.innerHTML = `
				<a ${ rel } href="/articles/${blog.urlExtention.replace(/ /g, "-") }/${ blog._id }" class="text-decoration-none text-dark">
					 <div>
							<div class="card mb-3 shadow-sm" >
							 <img src="${ blog.content[0].img.replace("/upload", "/upload/w_600") }" class="card-img-top" alt="${ blog.title }">
							<div class="card-body">
							<h5 class="card-title"> ${ blog.title.slice(0,35) }..</h5> 
							  <time class="text-muted " datetime>${ blog.createdDate.toLocaleString().slice(0,10) }.</time>
						 </div>

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
<img src="https://sun9-31.userapi.com/impf/c836122/v836122425/289e/4gzd6iCxgK8.jpg?size=429x1080&quality=96&proxy=1&sign=ed133ccebc8ac00865808190968a4daa&type=album" width="100%"> 

`
	advert.style.cssText =`
    min-height: 600px;
    width: 330px;
    max-width: 100%;
     background: #ffc10750;
    margin-bottom: 50px;
`;
	
	rightBarStickyBlock.append(advert);
	rightBarStickyBlock.style.position = "sticky";
	rightBarStickyBlock.style.top = "20px";
	}
	

});