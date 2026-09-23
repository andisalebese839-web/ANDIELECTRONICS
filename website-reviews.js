
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


/* AE TECHNOLOGIES PRODUCT CATALOG V2 */
(function(){
  "use strict";

  const AE_PRODUCTS = [
    {
      id:101,
      name:"Machine Downtime Logger",
      category:"Industrial Monitoring",
      price:2499,
      install:750,
      icon:"⚙",
      desc:"A compact monitoring device that detects when a machine stops, records downtime and helps a small business understand exactly how much production time is being lost.",
      detail:"Machine Downtime Logger is designed for factories, workshops and small production businesses. It monitors the machine's operating indicator and records when the machine changes from running to stopped. This gives the owner a clearer record of downtime instead of relying on workers to remember or estimate times.",
      benefits:["Records machine stop and restart events","Helps calculate lost production time","Creates a clearer downtime history","Can be adapted to different machines and indicator systems"],
      priceNote:"Starting from R2,499. Custom installations may vary."
    },
    {
      id:102,
      name:"Smart Energy Monitor",
      category:"Business Efficiency",
      price:1499,
      install:500,
      icon:"⚡",
      desc:"A practical monitoring device that helps small businesses understand electricity usage and identify equipment that may be consuming more power than expected.",
      detail:"Smart Energy Monitor is intended for shops, offices, workshops and small businesses that want better visibility of their electrical usage. The device can be configured around the equipment or circuit being monitored.",
      benefits:["Monitor selected equipment or circuits","Identify unusual consumption patterns","Support energy-saving decisions","Useful for workshops, shops and offices"],
      priceNote:"Starting from R1,499. Final price depends on the monitoring configuration."
    },
    {
      id:103,
      name:"Equipment Temperature Monitor",
      category:"Equipment Protection",
      price:1299,
      install:450,
      icon:"🌡",
      desc:"A temperature-monitoring device that can warn a business when equipment becomes hotter than its configured safe range.",
      detail:"Equipment Temperature Monitor can be used around electrical panels, refrigeration equipment, motors, enclosures and other equipment where excessive heat may be an early warning sign of a problem.",
      benefits:["Continuous temperature monitoring","Configurable warning threshold","Early warning of overheating","Suitable for equipment rooms and enclosures"],
      priceNote:"Starting from R1,299. Custom sensors and enclosures may change the price."
    },
    {
      id:104,
      name:"Water Leak & Tank Level Alert",
      category:"Water & Safety",
      price:999,
      install:350,
      icon:"💧",
      desc:"A water monitoring device that can alert a business when a leak is detected or when a tank reaches a configured level.",
      detail:"Water Leak & Tank Level Alert is useful for shops, workshops, small factories, offices and properties where an unnoticed leak or overflowing tank can cause damage, waste water or interrupt operations.",
      benefits:["Detect water leaks","Monitor tank or reservoir level","Provide an audible or visual alert","Can be customized for different tank sizes and sensor positions"],
      priceNote:"Starting from R999. Sensor type and installation requirements may affect the final price."
    },
    {
      id:105,
      name:"Power Failure & Recovery Monitor",
      category:"Business Continuity",
      price:1199,
      install:400,
      icon:"🔌",
      desc:"A compact device that records power interruptions and restoration events so a business can understand when equipment lost power.",
      detail:"Power Failure & Recovery Monitor helps small businesses keep a record of electrical interruptions. It can be configured to record the start and return of power and provide an alert when an interruption occurs.",
      benefits:["Detect power interruptions","Record power restoration","Help identify repeated supply problems","Useful for computers, networking equipment and business machines"],
      priceNote:"Starting from R1,199. Final configuration depends on the equipment and monitoring method."
    }
  ];

  function aeEsc(value){
    return String(value==null?"":value).replace(/[&<>"']/g,function(ch){
      return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[ch];
    });
  }

  function aeMoney(value){ return "R"+Number(value||0).toFixed(2); }

  function addAEProductToCart(id){
    const product=AE_PRODUCTS.find(function(p){return p.id===id;});
    if(!product) return;
    const item=cart.find(function(x){return x.id===id;});
    if(item) item.qty++;
    else cart.push(Object.assign({},product,{qty:1}));
    saveCart();
    openCart();
  }

  window.addAEProductToCart=addAEProductToCart;

  function openCustomize(product){
    let modal=document.getElementById("aeCustomizeModal");
    if(!modal){
      modal=document.createElement("div");
      modal.id="aeCustomizeModal";
      modal.className="ae-customize-modal";
      modal.innerHTML=
        '<div class="ae-customize-card">'+
          '<div class="ae-customize-head"><div><p class="eyebrow">CUSTOM PRODUCT REQUEST</p><h2 id="aeCustomizeTitle">Customize a solution</h2></div><button type="button" id="aeCustomizeClose" aria-label="Close customization">×</button></div>'+
          '<p class="ae-customize-intro">Tell AE Technologies what you want changed, added or designed. You do not need to know the technical terms — describe the problem and we will help shape the solution.</p>'+
          '<form id="aeCustomizeForm" class="ae-customize-form" action="https://formspree.io/f/mnpndglk" method="POST">'+
            '<input type="hidden" name="_subject" value="Custom Gadget Enquiry - AE Technologies">'+
            '<input type="hidden" name="gadget" id="aeCustomizeGadget">'+
            '<label>Your name<input name="name" required placeholder="Your full name"></label>'+
            '<label>Email address<input name="email" type="email" required placeholder="you@example.com"></label>'+
            '<label>Cellphone number<input name="phone" required placeholder="079 123 4567"></label>'+
            '<label>What would you like to customize?<textarea name="customization" id="aeCustomizeText" required rows="6" placeholder="Tell us what you want the gadget to do, where it will be used, the size, sensors, alerts, power source or any other requirements."></textarea></label>'+
            '<div id="aeCustomizeStatus" class="ae-customize-status">We will review your request and contact you about the design and final price.</div>'+
            '<button class="btn primary" id="aeCustomizeSubmit" type="submit">Send Customization Request</button>'+
          '</form>'+
        '</div>';
      document.body.appendChild(modal);
      document.getElementById("aeCustomizeClose").onclick=function(){modal.classList.remove("open")};
      modal.addEventListener("click",function(e){if(e.target===modal)modal.classList.remove("open")});
      document.addEventListener("keydown",function(e){if(e.key==="Escape")modal.classList.remove("open")});
      document.getElementById("aeCustomizeForm").addEventListener("submit",async function(e){
        e.preventDefault();
        const form=e.target,button=document.getElementById("aeCustomizeSubmit"),status=document.getElementById("aeCustomizeStatus");
        button.disabled=true;button.textContent="Sending request...";
        try{
          const response=await fetch(form.action,{method:"POST",body:new FormData(form),headers:{Accept:"application/json"}});
          if(!response.ok) throw new Error("The request could not be submitted right now.");
          status.className="ae-customize-status success";
          status.textContent="Customization request sent successfully! 🎉 We will review your idea and contact you with the next steps.";
          form.reset();
        }catch(error){
          status.className="ae-customize-status error";
          status.textContent=(error.message||"Something went wrong.")+" Please try again or contact us on WhatsApp.";
        }finally{
          button.disabled=false;button.textContent="Send Customization Request";
        }
      });
    }
    document.getElementById("aeCustomizeTitle").textContent="Customize "+product.name;
    document.getElementById("aeCustomizeGadget").value=product.name;
    document.getElementById("aeCustomizeText").value="I am interested in the "+product.name+". I would like to customize it as follows: ";
    document.getElementById("aeCustomizeStatus").className="ae-customize-status";
    document.getElementById("aeCustomizeStatus").textContent="We will review your request and contact you about the design and final price.";
    modal.classList.add("open");
    setTimeout(function(){document.getElementById("aeCustomizeForm").querySelector("input[name='name']").focus()},80);
  }

  function openProductDetails(product){
    let modal=document.getElementById("aeProductModal");
    if(!modal){
      modal=document.createElement("div");
      modal.id="aeProductModal";
      modal.className="ae-product-modal";
      modal.innerHTML=
        '<div class="ae-product-card">'+
          '<div class="ae-product-head"><div><p class="eyebrow" id="aeProductCategory"></p><h2 id="aeProductTitle"></h2></div><button type="button" id="aeProductClose" aria-label="Close product details">×</button></div>'+
          '<div class="ae-product-icon" id="aeProductIcon"></div>'+
          '<p class="ae-product-detail" id="aeProductDetail"></p>'+
          '<h3>How it helps</h3><ul id="aeProductBenefits"></ul>'+
          '<div class="ae-product-price"><span>Price</span><strong id="aeProductPrice"></strong><small id="aeProductPriceNote"></small></div>'+
          '<div class="ae-product-actions"><button class="btn primary" id="aeProductAdd" type="button">Add to Cart</button><button class="btn outline" id="aeProductCustomize" type="button">Add Customize</button></div>'+
        '</div>';
      document.body.appendChild(modal);
      document.getElementById("aeProductClose").onclick=function(){modal.classList.remove("open")};
      modal.addEventListener("click",function(e){if(e.target===modal)modal.classList.remove("open")});
      document.addEventListener("keydown",function(e){if(e.key==="Escape")modal.classList.remove("open")});
    }
    document.getElementById("aeProductCategory").textContent=product.category;
    document.getElementById("aeProductTitle").textContent=product.name;
    document.getElementById("aeProductIcon").textContent=product.icon;
    document.getElementById("aeProductDetail").textContent=product.detail;
    document.getElementById("aeProductBenefits").innerHTML=product.benefits.map(function(x){return "<li>"+aeEsc(x)+"</li>"}).join("");
    document.getElementById("aeProductPrice").textContent=aeMoney(product.price);
    document.getElementById("aeProductPriceNote").textContent=product.priceNote;
    document.getElementById("aeProductAdd").onclick=function(){addAEProductToCart(product.id);modal.classList.remove("open")};
    document.getElementById("aeProductCustomize").onclick=function(){modal.classList.remove("open");openCustomize(product)};
    modal.classList.add("open");
  }

  function renderAEProducts(){
    const grid=document.getElementById("productGrid");
    if(!grid) return;
    grid.innerHTML=AE_PRODUCTS.map(function(product){
      return '<article class="ae-product-tile">'+
        '<div class="ae-product-tile-top"><span class="ae-product-icon">'+product.icon+'</span><span class="ae-category">'+aeEsc(product.category)+'</span></div>'+
        '<h3>'+aeEsc(product.name)+'</h3>'+
        '<p>'+aeEsc(product.desc)+'</p>'+
        '<div class="ae-tile-price">'+aeMoney(product.price)+' <small>starting price</small></div>'+
        '<div class="ae-tile-actions">'+
          '<button class="small-btn ae-see-more" type="button" data-id="'+product.id+'">See More</button>'+
          '<button class="small-btn ae-add-cart" type="button" data-id="'+product.id+'">Add to Cart</button>'+
          '<button class="small-btn ae-customize" type="button" data-id="'+product.id+'">Add Customize</button>'+
        '</div>'+
      '</article>';
    }).join("");
    grid.querySelectorAll(".ae-see-more").forEach(function(btn){btn.onclick=function(){openProductDetails(AE_PRODUCTS.find(function(p){return p.id===Number(btn.dataset.id)}))}});
    grid.querySelectorAll(".ae-add-cart").forEach(function(btn){btn.onclick=function(){addAEProductToCart(Number(btn.dataset.id))}});
    grid.querySelectorAll(".ae-customize").forEach(function(btn){btn.onclick=function(){openCustomize(AE_PRODUCTS.find(function(p){return p.id===Number(btn.dataset.id)}))}});
  }

  function replaceBranding(){
    document.title="AE Technologies | Electronics, Automation & Smart Solutions";
    const meta=document.querySelector('meta[name="description"]');
    if(meta) meta.content="AE Technologies designs practical electronics, automation and monitoring solutions for homes, workshops, factories and small businesses in South Africa.";
    document.querySelectorAll(".brand-name").forEach(function(el){el.innerHTML="AE <span>TECHNOLOGIES</span>"});
    document.querySelectorAll(".brand").forEach(function(el){
      if(!el.querySelector(".brand-logo")) el.textContent="AE TECHNOLOGIES";
    });
    const about=document.getElementById("about");
    if(about){
      about.innerHTML='<div class="container about-grid">'+
        '<div><p class="eyebrow">ABOUT AE TECHNOLOGIES</p><h2>Practical technology for real business problems.</h2><p>AE Technologies is an electronics and automation business focused on designing useful, affordable and customizable devices. We identify a real problem, design a practical electronic solution, build and test the device, and help the customer use it in the real world.</p><p>Our work can support small businesses, workshops, homes and industrial environments through monitoring, alerts, automation and custom electronics.</p></div>'+
        '<div class="stats"><div><strong>01</strong><span>Understand the problem</span></div><div><strong>02</strong><span>Design the solution</span></div><div><strong>03</strong><span>Build & test</span></div><div><strong>04</strong><span>Customize & improve</span></div></div>'+
      '</div>';
    }
    document.querySelectorAll("footer").forEach(function(footer){
      footer.querySelectorAll("p").forEach(function(p){p.innerHTML=p.innerHTML.replace(/Andi Electronics/g,"AE Technologies")});
    });
    const reviewText=document.getElementById("siteReviewText");
    if(reviewText) reviewText.placeholder="Tell us about your experience with AE Technologies…";
  }

  function replaceShopSection(){
    const shop=document.getElementById("shop");
    if(!shop) return;
    shop.innerHTML=
      '<div class="container ae-shop-container">'+
        '<div class="section-head"><div><p class="eyebrow">AE TECHNOLOGIES PRODUCTS</p><h2>Useful gadgets built for real problems</h2><p class="ae-shop-intro">Explore practical electronics for small businesses, workshops, homes and industrial environments. Select <strong>See More</strong> to learn what each gadget does, how it can help and the starting price.</p></div></div>'+
        '<div class="ae-product-grid" id="productGrid"></div>'+
        '<div class="ae-shop-custom"><strong>Need something different?</strong><span>Tell us what you want the device to do and we can discuss a custom version.</span><a class="btn ghost" href="#contact">Make a general enquiry</a></div>'+
      '</div>';
    renderAEProducts();
  }

  document.addEventListener("DOMContentLoaded",function(){
    replaceBranding();
    replaceShopSection();
  });
})();

(function(){
  const css = `
    .ae-shop-container{padding-top:8px}
    .ae-shop-intro{max-width:760px;color:#526b88;line-height:1.7;margin:0}
    .ae-product-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;margin-top:28px}
    .ae-product-tile{background:#fff;border:1px solid #dcecff;border-radius:22px;padding:24px;box-shadow:0 12px 34px rgba(18,104,232,.07);display:flex;flex-direction:column;min-height:270px}
    .ae-product-tile-top{display:flex;align-items:center;justify-content:space-between;gap:12px}
    .ae-product-icon{width:52px;height:52px;border-radius:16px;display:grid;place-items:center;background:#eef7ff;font-size:1.7rem}
    .ae-category{font-size:.72rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#1268e8}
    .ae-product-tile h3{font-size:1.35rem;margin:18px 0 8px}
    .ae-product-tile p{color:#526b88;line-height:1.6;margin:0 0 16px}
    .ae-tile-price{font-weight:900;font-size:1.15rem;margin-top:auto}
    .ae-tile-price small{font-size:.72rem;color:#71839a;font-weight:600}
    .ae-tile-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
    .ae-tile-actions .small-btn{flex:1 1 130px;text-align:center}
    .ae-shop-custom{margin-top:28px;padding:22px;border:1px solid #cfe5ff;border-radius:18px;background:#f7fbff;display:flex;align-items:center;gap:14px;flex-wrap:wrap}
    .ae-shop-custom span{color:#526b88;flex:1 1 280px}
    .ae-product-modal,.ae-customize-modal{position:fixed;inset:0;background:rgba(7,13,25,.72);display:none;align-items:center;justify-content:center;padding:18px;z-index:1200}
    .ae-product-modal.open,.ae-customize-modal.open{display:flex}
    .ae-product-card,.ae-customize-card{width:min(760px,100%);max-height:92vh;overflow:auto;background:#fff;border-radius:24px;padding:28px;box-shadow:0 24px 80px rgba(0,0,0,.28)}
    .ae-product-head,.ae-customize-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start}
    .ae-product-head h2,.ae-customize-head h2{margin:4px 0 0;font-size:1.9rem}
    .ae-product-head button,.ae-customize-head button{border:0;background:transparent;font-size:2rem;line-height:1;cursor:pointer;color:#526b88}
    .ae-product-icon{margin-top:18px}
    .ae-product-detail{color:#526b88;line-height:1.75;font-size:1.02rem}
    .ae-product-card h3{margin-top:24px}
    .ae-product-card ul{padding-left:20px;color:#526b88;line-height:1.8}
    .ae-product-price{margin-top:22px;padding:18px;border-radius:16px;background:#f5faff;border:1px solid #e1efff;display:grid;gap:4px}
    .ae-product-price strong{font-size:1.6rem;color:#1268e8}
    .ae-product-price small{color:#617894}
    .ae-product-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px}
    .ae-product-actions .btn{flex:1 1 200px}
    .ae-customize-intro{color:#526b88;line-height:1.65}
    .ae-customize-form{display:grid;gap:13px}
    .ae-customize-form label{display:grid;gap:7px;font-weight:700}
    .ae-customize-form input,.ae-customize-form textarea{width:100%;box-sizing:border-box;padding:12px 13px;border:1px solid #cfe1f5;border-radius:12px;font:inherit}
    .ae-customize-form textarea{resize:vertical}
    .ae-customize-status{padding:12px 14px;border-radius:12px;background:#f5faff;color:#526b88}
    .ae-customize-status.success{background:#effcf5;color:#087443}
    .ae-customize-status.error{background:#fff2f0;color:#b42318}
    .btn.outline{background:#fff;border:1px solid #1268e8;color:#1268e8}
    @media(max-width:760px){.ae-product-grid{grid-template-columns:1fr}.ae-product-card,.ae-customize-card{padding:20px}.ae-product-actions{flex-direction:column}}
  `;
  const style=document.createElement("style");
  style.id="ae-catalog-v2-style";
  style.textContent=css;
  document.head.appendChild(style);
})();

(function(){
  document.addEventListener("DOMContentLoaded",function(){
    const shopLink=document.querySelector('nav a[href="#shop"]');
    if(shopLink) shopLink.textContent="Gadgets";
    const servicesLink=document.querySelector('nav a[href="#services"]');
    if(servicesLink) servicesLink.textContent="Services";
    const schema=document.querySelector('script[type="application/ld+json"]');
    if(schema){
      schema.textContent=JSON.stringify({
        "@context":"https://schema.org",
        "@type":"Store",
        "name":"AE Technologies",
        "url":"https://andisalebese839-web.github.io/ANDIELECTRONICS/",
        "email":"andisalebese839@gmail.com",
        "telephone":"+27793234998",
        "description":"AE Technologies designs practical electronics, automation and monitoring solutions for homes, workshops, factories and small businesses in South Africa.",
        "areaServed":"ZA",
        "hasOfferCatalog":{
          "@type":"OfferCatalog",
          "name":"AE Technologies Gadgets",
          "itemListElement":AE_PRODUCTS.map(function(p){
            return {"@type":"Offer","itemOffered":{"@type":"Product","name":p.name,"description":p.desc},"price":String(p.price),"priceCurrency":"ZAR","availability":"https://schema.org/InStock","url":"https://andisalebese839-web.github.io/ANDIELECTRONICS/#shop"};
          })
        }
      },null,2);
    }
  });
})();
