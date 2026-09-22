const products=[
{id:1,name:"Automatic Night Light",category:"Smart Lighting",price:349,install:250,icon:"🌙",image:"https://lumiliving.co.za/cdn/shop/files/IMG01_674149aa-f71f-4dd1-acf3-7edeb9010c66.jpg?v=1770915819&width=1024",desc:"Automatic dusk-to-dawn light for bedrooms, passages and entrances."},
{id:2,name:"Motion-Sensor Light",category:"Smart Lighting",price:449,install:300,icon:"🚶",image:"https://www.futurelight.co.za/cdn/shop/files/PioLEDLighting-F356S30WOoberIP65LEDSensorFloodlight6000K_3000K.png?v=1761058896&width=1024",desc:"Motion-activated lighting for entrances, garages, passages and outdoor areas."},
{id:3,name:"Water-Level Alarm",category:"Safety & Alerts",price:349,install:250,icon:"💧",image:"https://leobot.net/productimages/259.webp",desc:"Water detection alarm that sounds when the sensor reaches the set level."},
{id:4,name:"Door & Window Alarm",category:"Security",price:349,install:200,icon:"🚪",image:"https://dummyimage.com/900x650/111827/ffffff.png&text=DOOR+%26+WINDOW+ALARM",desc:"Magnetic entry alarm for doors and windows."},
{id:5,name:"Automatic Entry Light & Alarm",category:"Security",price:499,install:300,icon:"🚨",image:"https://www.futurelight.co.za/cdn/shop/files/PioLEDLighting-PioLEDLighting-F356S30WOoberIP65LEDSensorFloodlight6000K_3000K.png?v=1761058896&width=1024",desc:"Motion-triggered entrance lighting with an optional alarm."}
];
let cart=JSON.parse(localStorage.getItem("andiCart")||"[]"),active="All";
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
function installationTotal(){return cart.reduce((a,x)=>a+x.install*x.qty,0)}
function selectedInstallationTotal(){return $("#serviceOption")&&$("#serviceOption").value==="products_installation"?installationTotal():0}
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
  updateCheckout();
}
function closeCheckout(){$("#checkoutModal").classList.remove("open");$("#checkoutModal").setAttribute("aria-hidden","true")}
function updateCheckout(){
  const product=productTotal(),install=selectedInstallationTotal(),grand=product+install;
  $("#checkoutSummary").innerHTML=cart.map(x=>`<div><span>${x.name} × ${x.qty}</span><strong>${money(x.price*x.qty)}</strong></div>`).join("")+
    `<div class="summary-line"><span>Products</span><strong>${money(product)}</strong></div>`+
    `<div class="summary-line"><span>Installation</span><strong>${install?money(install):"Not selected"}</strong></div>`;
  $("#checkoutGrandTotal").textContent=money(grand);
  $("#orderItemsField").value=cart.map(x=>`${x.name} × ${x.qty} = ${money(x.price*x.qty)}`).join(" | ");
  $("#productTotalField").value=money(product);
  $("#installationTotalField").value=money(install);
  $("#orderTotalField").value=money(grand);
}
function buildWhatsAppMessage(){
  const lines=cart.map(x=>`• ${x.name} × ${x.qty} — ${money(x.price*x.qty)}`);
  return "Hello Andi Electronics, I would like to order:%0A%0A"+encodeURIComponent(lines.join("\n"))+
    encodeURIComponent("\n\nProducts: "+money(productTotal())+"\nInstallation: To be confirmed\n\nPlease contact me to confirm the order.");
}
function showCheckoutStatus(message,type){
  $("#checkoutStatus").textContent=message;
  $("#checkoutStatus").className="checkout-status "+type;
}
async function submitOrder(event){
  event.preventDefault();
  if(!cart.length){showCheckoutStatus("Your cart is empty.","error");return}
  updateCheckout();
  const form=$("#checkoutForm"),button=$("#submitOrderBtn");
  button.disabled=true;button.textContent="Sending order...";
  showCheckoutStatus("Sending your order request...","loading");
  try{
    const response=await fetch("https://formspree.io/f/mnpndglk",{
      method:"POST",
      headers:{"Accept":"application/json"},
      body:new FormData(form)
    });
    if(!response.ok)throw new Error("Submission failed");
    form.reset();
    cart=[];
    saveCart();
    $("#checkoutSummary").innerHTML="<div class='order-success'><strong>Order request sent ✓</strong><span>Thank you! Andi Electronics will contact you to confirm the order and installation details.</span></div>";
    $("#checkoutGrandTotal").textContent="R0.00";
    showCheckoutStatus("Order request sent successfully. Check your email for confirmation from Formspree.","success");
  }catch(error){
    showCheckoutStatus("We could not send the order right now. Please try again or order through WhatsApp.","error");
  }finally{
    button.disabled=false;button.textContent="Send order request";
  }
}
$("#cartBtn").onclick=openCart;
$("#closeCart").onclick=closeCart;
$("#overlay").onclick=()=>{closeCart();closeCheckout()};
$("#search").oninput=renderProducts;
$("#menuBtn").onclick=()=>$("#navLinks").classList.toggle("show");
$("#checkoutBtn").onclick=openCheckout;
$("#closeCheckout").onclick=closeCheckout;
$("#serviceOption").onchange=updateCheckout;
$("#checkoutForm").addEventListener("submit",submitOrder);
$("#year").textContent=new Date().getFullYear();
renderCategories();renderProducts();renderCart();