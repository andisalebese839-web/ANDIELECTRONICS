const products=[
{id:1,name:"Arduino Starter Kit",category:"Microcontrollers",price:399,icon:"⌘",desc:"A practical starter kit for electronics and automation projects."},
{id:2,name:"Relay Module",category:"Automation",price:89,icon:"⚡",desc:"Switch higher-power loads from a low-voltage control signal."},
{id:3,name:"Ultrasonic Sensor",category:"Sensors",price:75,icon:"◉",desc:"Distance sensing module for smart and automated projects."},
{id:4,name:"12V Solenoid Valve",category:"Automation",price:249,icon:"◈",desc:"Compact valve for controlled water or air-flow projects."},
{id:5,name:"Push Button Module",category:"Components",price:35,icon:"●",desc:"Simple input control for prototypes and embedded systems."},
{id:6,name:"Jumper Wire Set",category:"Components",price:59,icon:"≋",desc:"Assorted jumper wires for breadboards and prototypes."}
];
let cart=JSON.parse(localStorage.getItem("andiCart")||"[]"), active="All";
const $=s=>document.querySelector(s);
const money=n=>"R"+n.toFixed(2);
function renderCategories(){const cats=["All",...new Set(products.map(p=>p.category))];$("#categories").innerHTML=cats.map(c=>`<button class="chip ${c===active?"active":""}" onclick="setCategory('${c}')">${c}</button>`).join("")}
function renderProducts(){const q=$("#search").value.toLowerCase();const list=products.filter(p=>(active==="All"||p.category===active)&&(p.name+p.desc+p.category).toLowerCase().includes(q));$("#productGrid").innerHTML=list.length?list.map(p=>`<article class="product"><div class="pic">${p.icon}</div><p class="eyebrow">${p.category}</p><h3>${p.name}</h3><p>${p.desc}</p><div class="product-row"><span class="price">${money(p.price)}</span><button class="small-btn" onclick="addToCart(${p.id})">Add to cart</button></div></article>`).join(""):'<p class="empty">No products found.</p>'}
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