const products=[
{id:1,name:"Automatic Night Light",category:"Smart Lighting",price:349,install:250,icon:"🌙",image:"https://lumiliving.co.za/cdn/shop/files/IMG01_674149aa-f71f-4dd1-acf3-7edeb9010c66.jpg?v=1770915819&width=1024",desc:"Automatic dusk-to-dawn light for bedrooms, passages and entrances."},
{id:2,name:"Motion-Sensor Light",category:"Smart Lighting",price:449,install:300,icon:"🚶",image:"https://www.futurelight.co.za/cdn/shop/files/PioLEDLighting-F356S30WOoberIP65LEDSensorFloodlight6000K_3000K.png?v=1761058896&width=1024",desc:"Motion-activated lighting for entrances, garages, passages and outdoor areas."},
{id:3,name:"Water-Level Alarm",category:"Safety & Alerts",price:349,install:250,icon:"💧",image:"https://leobot.net/productimages/259.webp",desc:"Water detection alarm that sounds when the sensor reaches the set level."},
{id:4,name:"Door & Window Alarm",category:"Security",price:349,install:200,icon:"🚪",image:"https://dummyimage.com/900x650/111827/ffffff.png&text=DOOR+%26+WINDOW+ALARM",desc:"Magnetic entry alarm for doors and windows."},
{id:5,name:"Automatic Entry Light & Alarm",category:"Security",price:499,install:300,icon:"🚨",image:"https://www.futurelight.co.za/cdn/shop/files/PioLEDLighting-PioLEDLighting-F356S30WOoberIP65LEDSensorFloodlight6000K_3000K.png?v=1761058896&width=1024",desc:"Motion-triggered entrance lighting with an optional alarm."}
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
function renderProducts(){
  const q=$("#search").value.toLowerCase();
  const list=products.filter(p=>(active==="All"||p.category===active)&&(p.name+p.desc+p.category).toLowerCase().includes(q));
  $("#productGrid").innerHTML=list.length?list.map(p=>`
  <article class="product">
    <div class="pic"><img src="${p.image}" alt="${p.name}" loading="eager" onerror="this.onerror=null;this.src='https://dummyimage.com/900x650/0b1220/ffffff.png&text=${encodeURIComponent(p.name)}'"></div>
    <p class="eyebrow">${p.category}</p>
    <h3>${p.name}</h3>
    <p>${p.desc}</p>
    <div class="product-meta"><span class="price">${money(p.price)}</span><span class="install">Installation from ${money(p.install)}</span></div>
    <div class="product-row"><button class="small-btn" onclick="addToCart(${p.id})">Add to cart</button><a class="quote-link" href="#contact">Ask about customization</a></div>
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
function statusSteps(status){
  const steps=["Order received","Order accepted","Preparing order","Shipped","Out for delivery","Order delivered"];
  const normalized=status==="Delivered"?"Order delivered":status;
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
    result.innerHTML=`<div class="track-number">${order.order_number}</div><div class="track-status"><strong>Current status: ${order.status}</strong><span>Last updated: ${new Date(order.updated_at).toLocaleString()}</span></div><div class="track-timeline">${statusSteps(order.status)}</div>`;
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
  const form=$("#checkoutForm"),button=$("#submitOrderBtn");
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
    additional_instructions:form.elements.customer_notes?.value||""
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
    $("#orderConfirmation").innerHTML=`
      <span>Your unique order number</span><strong>${orderNumber}</strong>
      <p>Save this number. We will use it to identify your order.</p>
      <div class="confirmation-actions">
        <button type="button" class="small-btn" onclick="copyOrderNumber('${orderNumber}')">Copy order number</button>
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
updateFulfilmentFields();
updateDeliveryLocations();
if(customerProfile){syncCustomerToCheckout()}
renderCategories();renderProducts();renderCart();