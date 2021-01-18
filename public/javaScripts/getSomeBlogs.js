document.addEventListener("DOMContentLoaded", () => {
	
const rightBar = document.querySelector("#rightBar");
const lazyLoadingBlock = document.querySelector("#lazyLoadingBlock");
const category = document.querySelector("#category").textContent;
	
	

function getSomeBlogs( quantityOnPage, category , quantityRequired){

	return fetch(`/articles/get/${ quantityOnPage }/${ category }/${ quantityRequired }`)
	.then(respond => respond.json())
	.then(res => res)
	.catch(err => console.error(err))
	.finally(() => console.log("huk"))
}


function renderBlogsPreviews(parrent, data, size = "20rem"){
	
	
	
	data.forEach(blog => {
		
		parrent.insertAdjacentHTML("beforeend", `
            <a href="/articles/${blog.urlExtention.replace(/ /g, "-") }/${ blog._id }" class="text-decoration-none text-dark">
				<div>
                        <div class="card mb-3 " style="width: ${size};" >
 						 <img src="${ blog.content[0].img }" class="card-img-top" alt="${ blog.title }">
  						<div class="card-body">
    					<h5 class="card-title"> ${ blog.title }.</h5> 
                          <time class="text-muted " datetime>${ blog.date } </time>
  					 </div>

					</div>
				</div>
			</a>
        	
`);
	});
}



async function getAndRender(from, category, quantity, parent, size){
	const data = await getSomeBlogs(from, category, quantity); // can be random first start argument to get random  blogs on right bar
	renderBlogsPreviews(parent, data,size )
}

getAndRender(0, category, 5, rightBar);
	
	
	
	window.addEventListener("scroll", ()=> {
		console.log(document.body.offsetHeight - window.pageYOffset)
		if ( (document.body.offsetHeight - window.pageYOffset) <= 950){
		
			getAndRender(0, "All", 10, lazyLoadingBlock, "22");	
		}
	});
			
});



