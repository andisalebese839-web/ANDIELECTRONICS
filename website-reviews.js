
const SITE_REVIEW_SUPABASE_URL="https://qheysduwchwjfxquglxu.supabase.co";
const SITE_REVIEW_KEY="sb_publishable_folUp2DzQKjcMdhrobmhEQ_PWAE9wkn";
const SITE_REVIEW_HEADERS={apikey:SITE_REVIEW_KEY,Authorization:"Bearer "+SITE_REVIEW_KEY,Accept:"application/json"};
const SITE_REVIEW_SLUG="website";
let siteRating=0;
function siteStars(n){n=Number(n)||0;return Array.from({length:5},(_,i)=>i<n?"★":"☆").join("")}
function siteEsc(v){return String(v||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}
async function loadSiteReviews(){
  const list=document.getElementById("siteReviewList"),avg=document.getElementById("siteReviewAverage"),countEl=document.getElementById("siteReviewCount");
  try{
    const r=await fetch(SITE_REVIEW_SUPABASE_URL+"/rest/v1/product_reviews?product_slug=eq.website&approved=eq.true&select=customer_name,rating,review_text,created_at&order=created_at.desc",{headers:SITE_REVIEW_HEADERS});
    if(!r.ok)throw new Error();
    const reviews=await r.json(),count=reviews.length,average=count?reviews.reduce((s,x)=>s+Number(x.rating),0)/count:0;
    avg.textContent=count?average.toFixed(1):"—";document.getElementById("siteReviewStars").textContent=count?siteStars(Math.round(average)):"☆☆☆☆☆";
    countEl.textContent=count?count+" verified website review"+(count===1?"":"s"):"No approved reviews yet";
    list.innerHTML=count?reviews.map(x=>"<article class='site-review-card'><div class='site-review-head'><div><strong>"+siteEsc(x.customer_name)+"</strong><div class='site-stars'>"+siteStars(x.rating)+"</div></div><small>"+new Date(x.created_at).toLocaleDateString("en-ZA",{year:"numeric",month:"short",day:"numeric"})+"</small></div><p>"+siteEsc(x.review_text)+"</p></article>").join(""):"<div class='site-review-empty'>No approved reviews yet. Be one of our first verified customers to review Andi Electronics.</div>";
  }catch(e){countEl.textContent="Reviews temporarily unavailable";list.innerHTML="<div class='site-review-empty'>We could not load reviews right now. Please try again later.</div>"}
}
document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll(".site-rating-choice").forEach(b=>b.addEventListener("click",()=>{
    siteRating=Number(b.dataset.rating);document.getElementById("siteReviewRating").value=siteRating;
    document.querySelectorAll(".site-rating-choice").forEach(x=>x.classList.toggle("active",Number(x.dataset.rating)===siteRating));
  }));
  document.getElementById("siteReviewForm").addEventListener("submit",async e=>{
    e.preventDefault();const status=document.getElementById("siteReviewStatus"),name=document.getElementById("siteReviewName").value.trim(),order=document.getElementById("siteReviewOrder").value.trim(),phone=document.getElementById("siteReviewPhone").value.trim(),text=document.getElementById("siteReviewText").value.trim(),button=e.target.querySelector("button[type=submit]");
    if(!name||!order||!phone||!siteRating||text.length<5){status.className="site-review-status error";status.textContent="Please complete your name, order number, cellphone number, rating and review.";return}
    button.disabled=true;status.className="site-review-status";status.textContent="Checking your purchase…";
    try{
      const r=await fetch(SITE_REVIEW_SUPABASE_URL+"/rest/v1/rpc/submit_product_review",{method:"POST",headers:{...SITE_REVIEW_HEADERS,"Content-Type":"application/json"},body:JSON.stringify({product_slug_input:SITE_REVIEW_SLUG,order_number_input:order,customer_name_input:name,customer_phone_input:phone,rating_input:siteRating,review_text_input:text})});
      const data=await r.json().catch(()=>null);if(!r.ok)throw new Error((data&&data.message)||(data&&data.hint)||(data&&data.details)||"We could not verify this order.");
      status.className="site-review-status success";status.textContent="Thank you! Your verified website review was submitted and is waiting for approval.";
      e.target.reset();siteRating=0;document.querySelectorAll(".site-rating-choice").forEach(x=>x.classList.remove("active"));
    }catch(err){status.className="site-review-status error";status.textContent=err.message||"We could not submit your review."}
    finally{button.disabled=false}
  });
  loadSiteReviews();
});
