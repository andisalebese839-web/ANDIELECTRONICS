const products=[
{id:1,name:"Machine Downtime Logger",category:"Business Monitoring",price:2599,install:750,icon:"🏭",image:"https://dummyimage.com/900x650/eaf5ff/1268e8.png&text=Machine+Downtime+Logger",desc:"Monitors a machine's operating light and records when the machine stops and how long the downtime lasts.",details:"The Machine Downtime Logger is designed for small factories, workshops and production businesses. It watches the machine's status light and automatically records operating and downtime periods, reducing reliance on handwritten logs or estimates.",benefits:["Shows the actual time a machine was stopped.","Helps owners identify repeated downtime patterns.","Creates clearer records for maintenance and production planning.","Reduces manual timekeeping by workers." ]},
{id:2,name:"Smart Energy Monitor",category:"Business Monitoring",price:1599,install:500,icon:"⚡",image:"https://dummyimage.com/900x650/f1f8ff/1268e8.png&text=Smart+Energy+Monitor",desc:"Tracks electricity usage so small businesses can understand where energy is being consumed.",details:"The Smart Energy Monitor helps shops, workshops, offices and small production spaces monitor electrical consumption and identify equipment or periods that may be driving costs.",benefits:["Makes energy usage easier to understand.","Helps identify equipment with high consumption.","Supports better energy-saving decisions.","Provides useful records for comparing usage over time."]},
{id:3,name:"Equipment Temperature Monitor",category:"Business Monitoring",price:1399,install:450,icon:"🌡️",image:"https://dummyimage.com/900x650/fff7ed/1268e8.png&text=Equipment+Temperature+Monitor",desc:"Monitors equipment temperature and provides an alert when a set limit is reached.",details:"The Equipment Temperature Monitor is suited to electrical panels, motors, pumps, refrigeration equipment and other assets where overheating can become a problem.",benefits:["Provides early warning of abnormal heat.","Helps reduce avoidable equipment damage.","Supports preventive maintenance.","Can be configured around the equipment's normal temperature range."]},
{id:4,name:"Water Leak & Tank Level Alert",category:"Business Safety",price:1099,install:400,icon:"💧",image:"https://dummyimage.com/900x650/e9fbff/1268e8.png&text=Water+Leak+%26+Tank+Level+Alert",desc:"Detects unwanted water leaks or monitors a tank level and alerts you before a small problem becomes expensive.",details:"This solution can be adapted for small businesses, workshops, properties and water-storage systems. It can detect a leak or provide an alert when a tank reaches a configured level.",benefits:["Helps catch leaks earlier.","Reduces the risk of water damage and waste.","Supports better tank-level awareness.","Can be adapted to the installation environment."]},
{id:5,name:"Power Failure & Recovery Monitor",category:"Business Safety",price:1299,install:400,icon:"🔌",image:"https://dummyimage.com/900x650/f5f3ff/1268e8.png&text=Power+Failure+%26+Recovery+Monitor",desc:"Records power interruptions and recovery events so small businesses can keep a clearer record of outages.",details:"The Power Failure & Recovery Monitor records when electrical power goes off and when it returns. It is useful for businesses that depend on computers, equipment, refrigeration or other electrical systems.",benefits:["Creates a record of power interruptions.","Helps identify repeated outage problems.","Supports troubleshooting after equipment resets.","Useful for businesses where outages affect operations or stock."]}
];
let cart=JSON.parse(localStorage.getItem("andiCart")||"[]"),active="All";
let customerProfile=JSON.parse(localStorage.getItem("andiCustomerProfile")||"null");
const WELCOME_RATE=0.10;
const SUPABASE_URL="https://qheysduwchwjfxquglxu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_folUp2DzQKjcMdhrobmhEQ_PWAE9wkn";
const SUPABASE_HEADERS={
  "apikey":SUPABASE_PUBLISHABLE_KEY,
  "Authorization":"Bearer "+SUPABASE_PUBLISHABLE_KEY,
  "Content-Type":"application/json",
  "Accept":"application/json"
};
const $=s=>document.querySelector(s),money=n=>"R"+Number(n).toFixed(2);

function renderCategories(){
  const cats=["All",...new Set(products.map(p=>p.category))];
  $("#categories").innerHTML=cats.map(c=>`<button class="chip ${c===active?"active":""}" onclick="setCategory('${c}')">${c}</button>`).join("");
}
function openProductDetails(id){
  const p=products.find(x=>x.id===id);
  if(!p)return;
  const modal=$("#productDetailsModal");
  $("#productDetailsContent").innerHTML=`
    <div class="product-detail-top">
      <div class="product-detail-image"><img src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='https://dummyimage.com/900x650/0b1220/ffffff.png&text='+encodeURIComponent(p.name)"></div>
      <div>
        <p class="eyebrow">${p.category}</p>
        <h2>${p.icon} ${p.name}</h2>
        <p class="product-detail-price">${money(p.price)}</p>
        <p class="product-detail-install">Installation from ${money(p.install)}</p>
      </div>
    </div>
    <h3>What it does</h3><p>${p.details}</p>
    <h3>How it helps a small business</h3>
    <ul class="product-benefits">${p.benefits.map(b=>`<li>✓ ${b}</li>`).join("")}</ul>
    <div class="product-detail-actions">
      <button class="btn primary" type="button" onclick="addToCart(${p.id});closeProductDetails()">Add to cart</button>
      <a class="btn ghost" target="_blank" rel="noopener" href="https://wa.me/27793234998?text=${encodeURIComponent("Hello Andi Electronics. I would like to enquire about the "+p.name+" priced at "+money(p.price)+".")}" >Make an inquiry</a>
    </div>`;
  modal.classList.add("open");modal.setAttribute("aria-hidden","false");
}
function closeProductDetails(){
  const modal=$("#productDetailsModal");
  if(modal){modal.classList.remove("open");modal.setAttribute("aria-hidden","true")}
}
function renderProducts(){
  const q=$("#search").value.toLowerCase();
  const list=products.filter(p=>(active==="All"||p.category===active)&&(p.name+p.desc+p.category+p.details).toLowerCase().includes(q));
  $("#productGrid").innerHTML=list.length?list.map(p=>`
  <article class="product">
    <div class="pic"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='https://dummyimage.com/900x650/0b1220/ffffff.png&text='+encodeURIComponent(p.name)"></div>
    <p class="eyebrow">${p.category}</p>
    <h3>${p.name}</h3>
    <p>${p.desc}</p>
    <div class="product-meta"><span class="price">${money(p.price)}</span><span class="install">Installation from ${money(p.install)}</span></div>
    <div class="product-row">
      <button class="small-btn" onclick="addToCart(${p.id})">Add to cart</button>
      <button class="small-btn product-view-link" type="button" onclick="openProductDetails(${p.id})">Read more</button>
      <a class="quote-link" target="_blank" rel="noopener" href="https://wa.me/27793234998?text=${encodeURIComponent("Hello Andi Electronics. I would like to enquire about the "+p.name+" priced at "+money(p.price)+".")}">Make an inquiry</a>
    </div>
  </article>`).join(""):'<p class="empty">No products found.</p>';
}
function setCategory(c){active=c;renderCategories();renderProducts()}
function addToCart(id){
  const p=products.find(x=>x.id===id),item=cart.find(x=>x.id===id);
  item?item.qty++:cart.push({...p,qty:1});
  saveCart();openCart();
}
function changeQty(id,delta){
  const item=cart.find(x=>x.id===id);
  if(!item)return;
  item.qty=Math.max(1,item.qty+delta);
  saveCart();
}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);saveCart()}
function saveCart(){localStorage.setItem("andiCart",JSON.stringify(cart));renderCart()}
function productTotal(){return cart.reduce((a,x)=>a+x.price*x.qty,0)}
function welcomeEligible(){return !!customerProfile&&!customerProfile.discountUsed}
function welcomeDiscount(product,install,delivery){return welcomeEligible()?(product+install+delivery)*WELCOME_RATE:0}
function saveCustomerProfile(){localStorage.setItem("andiCustomerProfile",JSON.stringify(customerProfile))}
function openAccount(){$("#accountModal").classList.add("open");$("#accountModal").setAttribute("aria-hidden","false");$("#accountStatus").textContent="";if(customerProfile){$("#accountTitle").textContent="Your account";$("#accountName").value=customerProfile.name||"";$("#accountPhone").value=customerProfile.phone||"";$("#accountName").readOnly=true;$("#accountPhone").readOnly=true;$("#accountForm button").textContent="Account registered ✓";$("#accountForm button").disabled=true;$("#accountStatus").textContent=customerProfile.discountUsed?"Your first-order discount has already been used.":"Your 10% first-order discount is ready to use."}else{$("#accountTitle").textContent="Create your account";$("#accountName").readOnly=false;$("#accountPhone").readOnly=false;$("#accountForm button").disabled=false;$("#accountForm button").textContent="Create account & unlock 10%"}}
function closeAccount(){$("#accountModal").classList.remove("open");$("#accountModal").setAttribute("aria-hidden","true")}
function registerCustomer(e){e.preventDefault();const name=$("#accountName").value.trim(),phone=$("#accountPhone").value.trim();if(!name||!phone)return;customerProfile={name,phone,discountUsed:false,registeredAt:new Date().toISOString()};saveCustomerProfile();$("#accountStatus").textContent="Account created. Your 10% first-order discount is unlocked!";$("#accountStatus").className="account-status success";$("#accountForm button").disabled=true;$("#accountForm button").textContent="10% discount unlocked ✓";syncCustomerToCheckout();updateCheckout()}
function syncCustomerToCheckout(){if(!customerProfile)return;$("#checkoutCustomerName").value=customerProfile.name;$("#checkoutCustomerPhone").value=customerProfile.phone;$("#checkoutCustomerName").readOnly=true;$("#checkoutCustomerPhone").readOnly=true;$("#accountCheckoutNote").textContent=welcomeEligible()?"Welcome back, "+customerProfile.name+" — your 10% first-order discount is active.":"Your first-order 10% discount has already been used."}
function installationTotal(){return cart.reduce((a,x)=>a+x.install*x.qty,0)}
function selectedInstallationTotal(){return $("#serviceOption")&&$("#serviceOption").value==="products_installation"?installationTotal():0}
const deliveryLocations={
  "Eastern Cape":["Gqeberha","East London","Mthatha","Bhisho","Kariega","Komani"],
  "Free State":["Bloemfontein","Welkom","Bethlehem","Sasolburg","Phuthaditjhaba"],
  "Gauteng":["Johannesburg","Pretoria","Centurion","Midrand","Soweto","Vanderbijlpark","Benoni","Boksburg","Germiston"],
  "KwaZulu-Natal":["Durban","Pietermaritzburg","Richards Bay","Newcastle","Ladysmith","Ballito"],
  "Limpopo":["Polokwane","Thohoyandou","Tzaneen","Mokopane","Giyani"],
  "Mpumalanga":["Mbombela","Emalahleni","Secunda","Middelburg","Nkomazi"],
  "North West":["Rustenburg","Mahikeng","Klerksdorp","Potchefstroom","Brits"],
  "Northern Cape":["Kimberley","Upington","Kuruman","De Aar"],
  "Western Cape":["Cape Town","Stellenbosch","George","Paarl","Worcester","Mossel Bay"]
};
function selectedDeliveryFee(){
  const option=$("#fulfilmentOption");
  return option&&option.value==="delivery"?210:0;
}
function deliveryChargeBreakdown(){
  return '<div class="summary-line"><span>Delivery fee</span><strong>R90.00</strong></div><div class="summary-line"><span>Shipping fee</span><strong>R120.00</strong></div>';
}
function updateDeliveryLocations(){
  const province=$("#deliveryProvince"),city=$("#deliveryCity"),suburb=$("#deliverySuburb"),area=$("#deliveryArea");
  if(!province||!city||!suburb)return;
  const cities=deliveryLocations[province.value]||[];
  city.innerHTML=cities.length?'<option value="">Select city / town</option>'+cities.map(x=>`<option>${x}</option>`).join(""):'<option value="">Select province first</option>';
  city.disabled=!cities.length;
  suburb.innerHTML='<option value="">Select suburb</option>';
  suburb.disabled=true;
  if(area)area.value="";
}
function updateDeliverySuburbs(){
  const city=$("#deliveryCity"),suburb=$("#deliverySuburb"),area=$("#deliveryArea");
  if(!city||!suburb)return;
  suburb.disabled=!city.value;
  suburb.innerHTML=city.value?'<option value="">Select suburb</option><option>Other suburb</option>':'<option value="">Select city first</option>';
  if(area)area.value=city.value;
}

function updateFulfilmentFields(){
  const delivery=$("#fulfilmentOption")?.value==="delivery";
  const wrap=$("#deliveryAreaWrap"),area=$("#deliveryArea"),address=$("#customerAddress");
  if(wrap)wrap.style.display=delivery?"grid":"none";
  if(area)area.required=false;
  if(address){
    address.required=delivery;
    address.placeholder=delivery?"Street, house/unit number":"Collection location / area";
  }
  ["#deliveryProvince","#deliveryCity","#deliverySuburb"].forEach(selector=>{
    const field=$(selector);
    if(field)field.required=delivery;
  });
}

function createOrderNumber(){
  const now=new Date();
  const date=now.getFullYear().toString()+String(now.getMonth()+1).padStart(2,"0")+String(now.getDate()).padStart(2,"0");
  const unique=typeof crypto!=="undefined"&&crypto.randomUUID
    ?crypto.randomUUID().replace(/-/g,"").slice(0,8).toUpperCase()
    :Math.random().toString(36).slice(2,10).toUpperCase();
  return "AE-"+date+"-"+unique;
}

function renderCart(){
  const count=cart.reduce((a,x)=>a+x.qty,0);
  $("#cartCount").textContent=count;
  $("#cartTotal").textContent=money(productTotal());
  $("#cartItems").innerHTML=cart.length?cart.map(x=>`
    <div class="cart-item">
      <div class="cart-item-info"><strong>${x.name}</strong><small>${money(x.price)} each</small></div>
      <div class="qty-controls">
        <button onclick="changeQty(${x.id},-1)" aria-label="Decrease quantity">−</button>
        <span>${x.qty}</span>
        <button onclick="changeQty(${x.id},1)" aria-label="Increase quantity">+</button>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${x.id})">Remove</button>
    </div>`).join(""):'<p class="empty">Your cart is empty.</p>';
}
function openCart(){$("#cartDrawer").classList.add("open");$("#overlay").classList.add("show");$("#cartDrawer").setAttribute("aria-hidden","false")}
function closeCart(){$("#cartDrawer").classList.remove("open");$("#overlay").classList.remove("show");$("#cartDrawer").setAttribute("aria-hidden","true")}
function openCheckout(){
  if(!cart.length){alert("Your cart is empty.");return}
  closeCart();
  $("#checkoutModal").classList.add("open");
  $("#checkoutModal").setAttribute("aria-hidden","false");
  $("#orderConfirmation").hidden=true;
  updateCheckout();
}
function closeCheckout(){$("#checkoutModal").classList.remove("open");$("#checkoutModal").setAttribute("aria-hidden","true")}
function updateCheckout(){
  const product=productTotal(),install=selectedInstallationTotal(),delivery=selectedDeliveryFee(),subtotal=product+install+delivery,discount=welcomeDiscount(product,install,delivery),grand=subtotal-discount;
  const fulfilment=$("#fulfilmentOption")?.value==="delivery"?"Delivery":"Collection";
  $("#checkoutSummary").innerHTML=cart.map(x=>`<div><span>${x.name} × ${x.qty}</span><strong>${money(x.price*x.qty)}</strong></div>`).join("")+
    `<div class="summary-line"><span>Products</span><strong>${money(product)}</strong></div>`+
    `<div class="summary-line"><span>Installation</span><strong>${install?money(install):"Not selected"}</strong></div>`+
    `${fulfilment==="Delivery"?deliveryChargeBreakdown():`<div class="summary-line"><span>Collection</span><strong>R0.00</strong></div>`}`;
  $("#checkoutGrandTotal").textContent=money(grand);
  $("#checkoutDiscountLine").hidden=!discount;$("#checkoutDiscount").textContent="-"+money(discount);
  $("#discountTotalField").value=discount.toFixed(2);
  $("#orderItemsField").value=cart.map(x=>`${x.name} × ${x.qty} = ${money(x.price*x.qty)}`).join(" | ");
  $("#productTotalField").value=money(product);
  $("#installationTotalField").value=money(install);
  $("#orderTotalField").value=money(grand);
}
function statusSteps(status,fulfilment){
  const delivery=fulfilment==="Delivery";
  const steps=delivery
    ?["Order placed","Payment verification","Payment verified","Preparing order","Dispatched","Out for delivery","Completed"]
    :["Order placed","Payment verification","Payment verified","Preparing order","Ready for collection","Completed"];
  const aliases={"Order received":"Order placed","Order accepted":"Payment verification","Shipped":"Dispatched","Order delivered":"Completed","Delivered":"Completed"};
  const normalized=aliases[status]||status;
  const index=Math.max(0,steps.indexOf(normalized));
  return steps.map((x,i)=>`<div class="track-step ${i<index?"done":""} ${i===index?"current":""}"><span>${i<index?"✓":i+1}</span><strong>${x}</strong></div>`).join("")
}
async function trackOrder(number){
  const result=$("#trackResult");
  const clean=number.trim().toUpperCase();
  if(!clean){result.hidden=false;result.innerHTML="<div class='track-status'><strong>Please enter your order number.</strong></div>";return}
  result.hidden=false;
  result.innerHTML="<div class='track-status'><strong>Checking your order...</strong><span>Please wait.</span></div>";
  try{
    const response=await fetch(SUPABASE_URL+"/rest/v1/rpc/track_order",{
      method:"POST",headers:SUPABASE_HEADERS,
      body:JSON.stringify({order_number_input:clean})
    });
    if(!response.ok)throw new Error("Tracking request failed");
    const data=await response.json();
    const order=Array.isArray(data)?data[0]:data;
    if(!order){
      result.innerHTML=`<div class="track-number">${clean}</div><div class="track-status"><strong>Order not found</strong><span>Please check the order number and try again.</span></div>`;
      return;
    }
    result.innerHTML=`<div class="track-number">${order.order_number}</div><div class="track-status"><strong>Current status: ${({"Order received":"Order placed","Order accepted":"Payment verification","Shipped":"Dispatched","Order delivered":"Completed","Delivered":"Completed"}[order.status]||order.status)}</strong><span>Last updated: ${new Date(order.updated_at).toLocaleString()}</span></div><div class="track-timeline">${statusSteps(order.status,order.fulfilment)}</div>`;
  }catch(error){
    console.error(error);
    result.innerHTML="<div class='track-status'><strong>Tracking is temporarily unavailable.</strong><span>Please try again in a moment or contact us on WhatsApp.</span></div>";
  }
}
function openTrack(){$("#trackModal").classList.add("open");$("#trackModal").setAttribute("aria-hidden","false");$("#trackResult").hidden=true}
function closeTrack(){$("#trackModal").classList.remove("open");$("#trackModal").setAttribute("aria-hidden","true")}
function showCheckoutStatus(message,type){
  $("#checkoutStatus").textContent=message;
  $("#checkoutStatus").className="checkout-status "+type;
}
async function submitOrder(event){
  event.preventDefault();
  if(!customerProfile){showCheckoutStatus("Please register first to unlock your 10% first-order discount.","error");closeCheckout();openAccount();return}
  if(!cart.length){showCheckoutStatus("Your cart is empty.","error");return}
  const orderNumber=createOrderNumber();
  updateCheckout();
  $("#orderNumberField").value=orderNumber;
  $("#orderSubjectField").value="New Andi Electronics Order — "+orderNumber;
  const trackingUrl=window.location.origin+window.location.pathname+"?track="+encodeURIComponent(orderNumber)+"#track";
  if($("#trackingLinkField")) $("#trackingLinkField").value=trackingUrl;
  const form=$("#checkoutForm"),button=$("#submitOrderBtn");
  const proofFile=$("#proofOfPayment")?.files?.[0];
  if(!proofFile){
    showCheckoutStatus("Please upload your proof of payment before submitting the order.","error");
    return;
  }
  if(proofFile.size>25*1024*1024){
    showCheckoutStatus("Your proof of payment must be 25 MB or smaller.","error");
    return;
  }
  button.disabled=true;button.textContent="Sending order...";
  showCheckoutStatus("Creating your order...","loading");
  const product=productTotal(),install=selectedInstallationTotal(),delivery=selectedDeliveryFee(),subtotal=product+install+delivery,discount=welcomeDiscount(product,install,delivery),grand=subtotal-discount;
  const orderData={
    order_number:orderNumber,
    customer_name:form.elements.customer_name.value.trim(),
    customer_email:form.elements.email.value.trim(),
    customer_phone:form.elements.customer_phone.value.trim(),
    fulfilment:$("#fulfilmentOption").value==="delivery"?"Delivery":"Collection",
    delivery_area:[$("#deliveryProvince")?.value,$("#deliveryCity")?.value,$("#deliverySuburb")?.value].filter(Boolean).join(" / "),
    delivery_address:$("#customerAddress").value||"",
    products:cart.map(x=>({id:x.id,name:x.name,qty:x.qty,price:x.price,install:x.install})),
    product_total:product,
    installation_total:install,
    delivery_fee:delivery,
    discount_total:discount,
    order_total:grand,
    additional_instructions:form.elements.customer_notes?.value||"",
    payment_method:"EFT / Bank deposit",
    proof_of_payment_filename:proofFile.name
  };
  try{
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),15000);
    let dbResponse;
    try{
      dbResponse=await fetch(SUPABASE_URL+"/rest/v1/rpc/create_order",{
        method:"POST",
        headers:SUPABASE_HEADERS,
        body:JSON.stringify({order_data:orderData}),
        signal:controller.signal
      });
    }finally{
      clearTimeout(timeout);
    }
    if(!dbResponse.ok){
      const dbError=await dbResponse.text();
      throw new Error(dbError||"Database order creation failed");
    }

    try{
      await fetch("https://formspree.io/f/mnpndglk",{
        method:"POST",headers:{"Accept":"application/json"},body:new FormData(form)
      });
    }catch(notificationError){
      console.warn("Order was saved, but email notification could not be sent.",notificationError);
    }

    const customerPhone=form.elements.customer_phone.value;
    if(customerProfile){customerProfile.discountUsed=true;saveCustomerProfile()}
    form.reset();cart=[];saveCart();
    $("#checkoutSummary").innerHTML="<div class='order-success'><strong>Order request sent ✓</strong><span>Your order has been saved successfully.</span></div>";
    $("#checkoutGrandTotal").textContent="R0.00";
    $("#orderConfirmation").hidden=false;
    const fulfilmentMessage=orderData.fulfilment==="Collection"
      ?"📦 Collection: Your order will be ready for collection within 3–4 weeks."
      :"🚚 Delivery: Your order will be prepared within 3–4 weeks, after which it will be dispatched for delivery.";
    $("#orderConfirmation").innerHTML=`
      <span>Your unique order number</span><strong>${orderNumber}</strong>
      <p>Save this number. We will use it to identify your order.</p>
      <div class="order-preparation-note">
        <strong>${fulfilmentMessage}</strong>
        <span>Please note: The 3–4 week period is an estimated preparation time. We will notify you when your order is ready for collection or has been prepared for delivery.</span>
      </div>
      <div class="confirmation-actions">
        <button type="button" class="small-btn" onclick="copyOrderNumber('${orderNumber}')">Copy order number</button>
        <a class="small-btn primary" href="${trackingUrl}">Track my order</a>
        <a class="small-btn whatsapp-order" target="_blank" rel="noopener" href="https://wa.me/27793234998?text=${encodeURIComponent("Hello Andi Electronics. My order number is "+orderNumber+". My phone number is "+customerPhone+". Please confirm my order.")}">Message us on WhatsApp</a>
      </div>`;
    showCheckoutStatus("Order created successfully. Your order number is "+orderNumber+".","success");
  }catch(error){
    console.error(error);
    showCheckoutStatus("We could not save the order: "+(error?.message||"Unknown error").slice(0,180),"error");
  }finally{
    button.disabled=false;button.textContent="Send order request";
  }
}
async function copyOrderNumber(orderNumber){
  try{
    await navigator.clipboard.writeText(orderNumber);
    showCheckoutStatus("Order number copied: "+orderNumber,"success");
  }catch(error){
    showCheckoutStatus("Your order number is "+orderNumber+".","success");
  }
}

/* OWNER ORDER DASHBOARD */
let ownerAccessToken=localStorage.getItem("andiOwnerAccessToken")||"";
function openOwner(){$("#ownerModal").classList.add("open");$("#ownerModal").setAttribute("aria-hidden","false");if(ownerAccessToken)showOwnerDashboard()}
function closeOwner(){$("#ownerModal").classList.remove("open");$("#ownerModal").setAttribute("aria-hidden","true")}
function ownerMessage(message,type="info"){$("#ownerLoginMessage").textContent=message;$("#ownerLoginMessage").className="owner-message "+type}
async function ownerLogin(){
 const email=$("#ownerEmail").value.trim(),password=$("#ownerPassword").value;
 if(!email||!password){ownerMessage("Enter your owner email and password.","error");return}
 $("#ownerLoginBtn").disabled=true;$("#ownerLoginBtn").textContent="Signing in...";ownerMessage("Checking your owner account...","info");
 try{
  const response=await fetch(SUPABASE_URL+"/auth/v1/token?grant_type=password",{method:"POST",headers:{"apikey":SUPABASE_PUBLISHABLE_KEY,"Content-Type":"application/json"},body:JSON.stringify({email,password})});
  const data=await response.json();if(!response.ok||!data.access_token)throw new Error(data.error_description||data.msg||"Owner sign-in failed.");
  ownerAccessToken=data.access_token;localStorage.setItem("andiOwnerAccessToken",ownerAccessToken);ownerMessage("Signed in successfully.","success");showOwnerDashboard();
 }catch(error){console.error(error);ownerAccessToken="";localStorage.removeItem("andiOwnerAccessToken");ownerMessage(error.message||"Could not sign in.","error")}
 finally{$("#ownerLoginBtn").disabled=false;$("#ownerLoginBtn").textContent="Sign in"}
}
function ownerHeaders(){return {"apikey":SUPABASE_PUBLISHABLE_KEY,"Authorization":"Bearer "+ownerAccessToken,"Content-Type":"application/json","Accept":"application/json"}}
function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]))}
async function loadOwnerOrders(){
 if(!ownerAccessToken)return;
 $("#ownerOrders").innerHTML="<div class='empty'>Loading customer orders...</div>";
 try{
  const response=await fetch(SUPABASE_URL+"/rest/v1/orders?select=*&order=created_at.desc",{headers:ownerHeaders()});
  if(response.status===401){ownerLogout();throw new Error("Your owner session has expired. Please sign in again.")}
  if(!response.ok){const message=await response.text();throw new Error(message||"Could not load orders.")}
  const orders=await response.json();$("#ownerOrderCount").textContent=" • "+orders.length+" order"+(orders.length===1?"":"s");
  if(!orders.length){$("#ownerOrders").innerHTML="<div class='empty'>No customer orders yet.</div>";return}
  $("#ownerOrders").innerHTML=orders.map(order=>{
   const items=Array.isArray(order.products)?order.products:[],itemText=items.map(item=>item.name+" × "+item.qty).join(" • ")||"Order details unavailable",status=order.status||"Order received";
   return `<article class="owner-order"><div class="owner-order-head"><div><strong>${escapeHtml(order.order_number||"Order")}</strong><small>${new Date(order.created_at||Date.now()).toLocaleString()}</small></div><strong>${money(order.order_total||0)}</strong></div>
   <div class="owner-grid"><div><small>Customer</small><strong>${escapeHtml(order.customer_name||"—")}</strong></div><div><small>Phone</small><strong>${escapeHtml(order.customer_phone||"—")}</strong></div><div><small>Fulfilment</small><strong>${escapeHtml(order.fulfilment||"—")}</strong></div><div><small>Email</small><strong>${escapeHtml(order.customer_email||"—")}</strong></div><div><small>Items</small><strong>${escapeHtml(itemText)}</strong></div><div><small>Area</small><strong>${escapeHtml(order.delivery_area||"Collection")}</strong></div></div>
   <div class="owner-status"><label><strong>Order status</strong></label><select data-order-number="${escapeHtml(order.order_number||"")}" class="owner-status-select">${["Order received","Payment verification","Payment verified","Preparing order","Ready for collection","Dispatched","Out for delivery","Order delivered"].map(x=>`<option ${x===status?"selected":""}>${x}</option>`).join("")}</select><button type="button" class="small-btn owner-save-status" data-order-number="${escapeHtml(order.order_number||"")}">Update status</button></div></article>`;
  }).join("");
  document.querySelectorAll(".owner-save-status").forEach(button=>button.onclick=()=>updateOwnerOrderStatus(button.dataset.orderNumber));
 }catch(error){console.error(error);$("#ownerOrders").innerHTML=`<div class="owner-message error">${escapeHtml(error.message||"Could not load orders.")}</div>`}
}
async function updateOwnerOrderStatus(orderNumber){
 const select=document.querySelector(".owner-status-select[data-order-number='"+CSS.escape(orderNumber)+"']");if(!select)return;
 try{
  const status=select.value,response=await fetch(SUPABASE_URL+"/rest/v1/orders?order_number=eq."+encodeURIComponent(orderNumber),{method:"PATCH",headers:{...ownerHeaders(),"Prefer":"return=minimal"},body:JSON.stringify({status,updated_at:new Date().toISOString()})});
  if(response.status===401){ownerLogout();throw new Error("Your owner session has expired. Please sign in again.")}
  if(!response.ok){const message=await response.text();throw new Error(message||"Could not update order status.")}
  $("#ownerMessage").textContent=orderNumber+" updated to "+status+".";$("#ownerMessage").className="owner-message success";
 }catch(error){console.error(error);$("#ownerMessage").textContent=error.message||"Could not update order status.";$("#ownerMessage").className="owner-message error"}
}
function showOwnerDashboard(){$("#ownerLogin").hidden=true;$("#ownerDashboard").hidden=false;loadOwnerOrders()}
function ownerLogout(){ownerAccessToken="";localStorage.removeItem("andiOwnerAccessToken");$("#ownerDashboard").hidden=true;$("#ownerLogin").hidden=false;$("#ownerPassword").value="";$("#ownerLoginMessage").textContent=""}

$("#ownerLoginBtn").onclick=ownerLogin;
$("#closeOwner").onclick=closeOwner;
$("#ownerRefresh").onclick=loadOwnerOrders;
$("#ownerLogout").onclick=ownerLogout;
document.addEventListener("keydown",e=>{if(e.altKey&&e.shiftKey&&e.key.toLowerCase()==="a"){e.preventDefault();openOwner()}});
$("#cartBtn").onclick=openCart;
$("#trackBtn").onclick=openTrack;
$("#closeTrack").onclick=closeTrack;
$("#trackForm").addEventListener("submit",e=>{e.preventDefault();trackOrder($("#trackNumber").value)});
$("#closeCart").onclick=closeCart;
$("#overlay").onclick=()=>{closeCart();closeCheckout()};
$("#search").oninput=renderProducts;
$("#menuBtn").onclick=()=>$("#navLinks").classList.toggle("show");
$("#checkoutBtn").onclick=openCheckout;
$("#closeCheckout").onclick=closeCheckout;
$("#serviceOption").onchange=updateCheckout;
$("#fulfilmentOption").onchange=()=>{updateFulfilmentFields();updateCheckout()};
$("#deliveryProvince").onchange=()=>{updateDeliveryLocations();updateCheckout()};
$("#deliveryCity").onchange=()=>{updateDeliverySuburbs();updateCheckout()};
$("#deliverySuburb").onchange=updateCheckout;
$("#checkoutForm").addEventListener("submit",submitOrder);
$("#year").textContent=new Date().getFullYear();
const initialTrack=new URLSearchParams(window.location.search).get("track");
if(initialTrack){setTimeout(()=>{openTrack();$("#trackNumber").value=initialTrack;trackOrder(initialTrack)},250);}
updateFulfilmentFields();
updateDeliveryLocations();
if(customerProfile){syncCustomerToCheckout()}
renderCategories();renderProducts();renderCart();