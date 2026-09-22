
const REVIEW_SUPABASE_URL="https://qheysduwchwjfxquglxu.supabase.co";
const REVIEW_SUPABASE_KEY="sb_publishable_folUp2DzQKjcMdhrobmhEQ_PWAE9wkn";
const REVIEW_HEADERS={apikey:REVIEW_SUPABASE_KEY,Authorization:"Bearer "+REVIEW_SUPABASE_KEY,Accept:"application/json"};
const REVIEW_PRODUCT_SLUG="machinewatch-downtime-monitor";
let selectedRating=0;
function reviewStars(n){n=Number(n)||0;return Array.from({length:5},(_,i)=>i<n?"★":"☆").join("")}
function escapeReviewText(v){return String(v||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}
function renderReviewSummary(reviews){
  const count=reviews.length;
  const avg=count?reviews.reduce((s,r)=>s+Number(r.rating),0)/count:0;
  document.getElementById("reviewAverage").textContent=count?avg.toFixed(1):"—";
  document.getElementById("reviewAverageStars").textContent=count?reviewStars(Math.round(avg)):"☆☆☆☆☆";
  document.getElementById("reviewCount").textContent=count?count+" verified review"+(count===1?"":"s"):"No approved reviews yet";
}
async function loadReviews(){
  const list=document.getElementById("reviewList");
  try{
    const response=await fetch(REVIEW_SUPABASE_URL+"/rest/v1/product_reviews?product_slug=eq."+encodeURIComponent(REVIEW_PRODUCT_SLUG)+"&approved=eq.true&select=customer_name,rating,review_text,created_at&order=created_at.desc",{headers:REVIEW_HEADERS});
    if(!response.ok)throw new Error();
    const reviews=await response.json();
    renderReviewSummary(reviews);
    list.innerHTML=reviews.length?reviews.map(r=>"<article class='review-card'><div class='review-card-head'><div><div class='review-card-name'>"+escapeReviewText(r.customer_name)+"</div><div class='stars'>"+reviewStars(r.rating)+"</div></div><div class='review-date'>"+new Date(r.created_at).toLocaleDateString("en-ZA",{year:"numeric",month:"short",day:"numeric"})+"</div></div><p class='review-text'>"+escapeReviewText(r.review_text)+"</p></article>").join(""):"<div class='review-empty'>No approved customer reviews yet. Be the first verified customer to leave one.</div>";
  }catch(e){
    document.getElementById("reviewCount").textContent="Reviews are temporarily unavailable";
    list.innerHTML="<div class='review-empty'>We could not load reviews right now. Please try again later.</div>";
  }
}
document.querySelectorAll(".star-choice").forEach(button=>{
  button.addEventListener("click",()=>{
    selectedRating=Number(button.dataset.rating);
    document.getElementById("reviewRating").value=selectedRating;
    document.querySelectorAll(".star-choice").forEach(b=>b.classList.toggle("active",Number(b.dataset.rating)===selectedRating));
  });
});
document.getElementById("reviewForm").addEventListener("submit",async event=>{
  event.preventDefault();
  const status=document.getElementById("reviewStatus");
  const name=document.getElementById("reviewName").value.trim();
  const order=document.getElementById("reviewOrder").value.trim();
  const phone=document.getElementById("reviewPhone").value.trim();
  const text=document.getElementById("reviewText").value.trim();
  if(!name||!order||!phone||!selectedRating||text.length<5){
    status.className="review-status error";
    status.textContent="Please complete your name, order number, cellphone number, rating and review.";
    return;
  }
  status.className="review-status";
  status.textContent="Checking your purchase…";
  const submitButton=event.target.querySelector("button[type=submit]");
  submitButton.disabled=true;
  try{
    const response=await fetch(REVIEW_SUPABASE_URL+"/rest/v1/rpc/submit_product_review",{
      method:"POST",
      headers:{...REVIEW_HEADERS,"Content-Type":"application/json"},
      body:JSON.stringify({product_slug_input:REVIEW_PRODUCT_SLUG,order_number_input:order,customer_name_input:name,customer_phone_input:phone,rating_input:selectedRating,review_text_input:text})
    });
    const data=await response.json().catch(()=>null);
    if(!response.ok)throw new Error((data&&data.message)||(data&&data.hint)||(data&&data.details)||"We could not verify this order.");
    status.className="review-status success";
    status.textContent="Thank you! Your verified review was recorded and is waiting for approval before it appears publicly.";
    event.target.reset();
    selectedRating=0;
    document.querySelectorAll(".star-choice").forEach(b=>b.classList.remove("active"));
  }catch(error){
    status.className="review-status error";
    status.textContent=error.message||"We could not submit your review.";
  }finally{
    submitButton.disabled=false;
  }
});
loadReviews();
