const products=[
{id:1,name:"Automatic Night Light",category:"Smart Lighting",price:349,icon:"🌙",image:"https://loremflickr.com/900/650/night-light,lamp",desc:"A compact light that automatically switches on when the surrounding area becomes dark and off when it becomes bright."},
{id:2,name:"Motion-Sensor Light",category:"Smart Lighting",price:449,icon:"🚶",image:"https://loremflickr.com/900/650/motion-sensor,light",desc:"A practical light that turns on when movement is detected, ideal for passages, entrances, bathrooms and garages."},
{id:3,name:"Water-Level Alarm",category:"Safety & Alerts",price:349,icon:"💧",image:"https://loremflickr.com/900/650/water,tank,level",desc:"A simple water-level warning device that sounds an alert when water reaches a set level."},
{id:4,name:"Door & Window Alarm",category:"Security",price:349,icon:"🚪",image:"https://loremflickr.com/900/650/door,security,alarm",desc:"A compact entry alarm that detects when a protected door or window is opened."},
{id:5,name:"Automatic Entry Light & Alarm",category:"Security",price:499,icon:"🚨",image:"https://loremflickr.com/900/650/entrance,security,light",desc:"A combined motion-detection solution that can activate an entrance light and optional alarm when movement is detected."}
];
let cart=JSON.parse(localStorage.getItem("andiCart")||"[]"), active="All";
const $=s=>document.querySelector(s);
const money=n=>"R"+n.toFixed(2);
function renderCategories(){const cats=["All",...new Set(products.map(p=>p.category))];$("#categories").innerHTML=cats.map(c=>`<button class="chip ${c===active?"active":""}" onclick="setCategory('${c}')">${c}</button>`).join("")}
function renderProducts(){const q=$("#search").value.toLowerCase();const list=products.filter(p=>(active==="All"||p.category===active)&&(p.name+p.desc+p.category).toLowerCase().includes(q));$("#productGrid").innerHTML=list.length?list.map(p=>`<article class="product"><div class="pic"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.parentElement.textContent='${p.icon}'"></div><p class="eyebrow">${p.category}</p><h3>${p.name}</h3><p>${p.desc}</p><div class="product-row"><span class="price">${money(p.price)}</span><button class="small-btn" onclick="addToCart(${p.id})">Add to cart</button></div></article>`).join(""):'<p class="empty">No products found.</p>'}
function setCategory(c){active=c;renderCategories();renderProducts()}
function addToCart(id){const p=products.find(x=>x.id===id);const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({...p,qty:1});saveCart();openCart()}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);saveCart()}
function saveCart(){localStorage.setItem("andiCart",JSON.stringify(cart));renderCart()}
function renderCart(){const count=cart.reduce((a,x)=>a+x.qty,0),total=cart.reduce((a,x)=>a+x.price*x.qty,0);$("#cartCount").textContent=count;$("#cartTotal").textContent=money(total);$("#cartItems").innerHTML=cart.length?cart.map(x=>`<div class="cart-item"><div><strong>${x.name}</strong><br><small>${x.qty} × ${money(x.price)}</small></div><button class="small-btn" onclick="removeFromCart(${x.id})">Remove</button></div>`).join(""):'<p class="empty">Your cart is empty.</p>'}
function openCart(){$("#cartDrawer").classList.add("open");$("#overlay").classList.add("show")}
function closeCart(){$("#cartDrawer").classList.remove("open");$("#overlay").classList.remove("show")}
$("#cartBtn").onclick=openCart;$("#closeCart").onclick=closeCart;$("#overlay").onclick=closeCart;$("#search").oninput=renderProducts;
$("#menuBtn").onclick=()=>$("#navLinks").classList.toggle("show");
$("#checkoutBtn").onclick=()=>{if(!cart.length){alert("Your cart is empty.");return}alert("Checkout is ready to connect to your payment provider. Your cart is saved in this browser.");};
$("#year").textContent=new Date().getFullYear();renderCategories();renderProducts();renderCart();