document.addEventListener("DOMContentLoaded",(()=>{document.querySelector("#main-content");const t=document.querySelector("#rightBarBlocks"),e=document.querySelector("#rightBar-stickyBlock"),n=document.querySelector("#lazyLoadingBlock"),o=document.querySelector("#category").textContent;i(0,5,o).then((e=>r(t,e,"rel='nofollow'"))).catch((t=>console.log("Problem to load right bar content.. : "+t))).finally((()=>{!function(){const t=document.createElement("div");t.innerHTML="\n \n\n",t.style.cssText="\n    height: 600px;\n    width: 300px;;\n     background: #ffc10750;\n    margin-bottom: 50px;\n",e.append(t),e.style.position="sticky",e.style.top="20px"}()}));const c=["col-sm-6","col-lg-4","col-xl-3"];let l=!1,a=0;function r(t,e,n=" ",o=["col-sm-12"]){const c=document.getElementById("title").innerText;e.forEach(((e,l)=>{if(e.title!=c){const c=document.createElement("div");o.forEach((t=>c.classList.add(t)));const l=e.modifiedDate.length>1?e.modifiedDate.slice(0,10):e.createdDate.slice(0,10);c.innerHTML=`\n\t\t\t\t<a ${n} href="/articles/${e.urlExtention.replace(/ /g,"-")}/${e._id}" class="text-decoration-none col text-dark">\t\t \n\t\t\t\t\t<div class="card mb-3 h-100  border-0 " >\n\t\t\t\t\t\t      <img src="${e.prevImg.replace("/upload","/upload/w_600")}" class="card-img-top rounded-0" alt="${e.title}">\n\t\t\t\t\t\t        <div class="card-body p-0 pt-2">\n                                <div class="post-meta">\n\t\t\t\t\t\t\t\t\t<span class="post-category text-light">  ${e.category} </span>\n\t\t\t\t\t\t\t\t\t<span class="post-date text-muted"> ${l} </span>\t\n\t\t\t\t\t\t\t    </div>\n\n\t\t\t\t\t\t\t  <h5 class="card-title"> ${e.title}</h5> \n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\t\n\t\t\t\t</a>`,t.append(c)}}))}function i(t=0,e=5,n="All"){return fetch(`/articles/get/${t}/${n}/${e}`).then((t=>t.json())).then((t=>t)).catch((t=>console.log("Failed to fetch"+t)))}window.addEventListener("scroll",(()=>{document.body.offsetHeight-window.pageYOffset<=1200&&0==l&&(l=!0,i(a,10).then((t=>(t.length>0&&(t=t.reverse(),r(n,t,"rel='nofollow'",c)),t))).then((t=>{10==t.length?(a+=t.length,l=!1):console.log("No more data available for the request")})).catch((t=>console.log("SOMETHING WHENT WRONG!!! TRY AGAIN LATER:  "+t))))}));const s=document.querySelector("#similar-articles");i(a=0,quantity=20,"All").then((t=>async function(t){const e=await t.filter((t=>t.category==o));for(let t=0;t<5;t++){const n=document.createElement("li");n.innerHTML=` <a href='/articles/${e[t].urlExtention.replace(/ /g,"-")}/${e[t]._id}' >${e[t].title} </a>`,s.append(n)}}(t)))}));
//# sourceMappingURL=bundle.js.map