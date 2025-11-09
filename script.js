// Script: AJAX fetch + DOM manipulation + hamburger + active nav
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const categoriesEl = document.getElementById('categories');
const menuItemsEl = document.getElementById('menu-items');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const navLinkEls = document.querySelectorAll('.nav-link');

menuToggle.addEventListener('click', ()=>{
  navLinks.classList.toggle('show');
});

// Close mobile nav when link clicked
navLinkEls.forEach(a=>a.addEventListener('click', ()=>{
  navLinks.classList.remove('show');
}));

// Fallback lokal data (istifadəçi internetdə fetch bloku ilə üzləşsə)
const fallbackMeals = {
  "soup":[
    {"name":"Tomato Soup","desc":"Dadlı pomidor şorbası.","price":"6 AZN"},
    {"name":"Chicken Soup","desc":"Təbii toyuq bulyonlu şorba.","price":"7 AZN"}
  ],
  "pizza":[
    {"name":"Margherita","desc":"Mozzarella və reyhan.","price":"10 AZN"},
    {"name":"Pepperoni","desc":"Ət və pendir.","price":"12 AZN"}
  ],
  "dessert":[
    {"name":"Chocolate Cake","desc":"Kremli şokoladlı tort.","price":"8 AZN"}
  ],
  "drink":[
    {"name":"Lemonade","desc":"Təbi limonlu içki.","price":"4 AZN"}
  ]
};

let mealsData = null;

// Try to fetch external JSON (meals.json)
fetch('meals.json')
  .then(resp=>{
    if(!resp.ok) throw new Error('Network response not ok');
    return resp.json();
  })
  .then(data=>{
    mealsData = data;
    initMenu(mealsData);
  })
  .catch(err=>{
    console.warn('Fetch error:', err);
    errorEl.hidden = false;
    mealsData = fallbackMeals;
    initMenu(mealsData);
  })
  .finally(()=>{
    loadingEl.style.display = 'none';
  });

function initMenu(data){
  const categories = Object.keys(data);
  // Render category buttons
  categoriesEl.innerHTML = '';
  categories.forEach((cat, idx)=>{
    const btn = document.createElement('button');
    btn.className = 'cat-btn';
    btn.textContent = capitalize(cat);
    btn.dataset.cat = cat;
    if(idx===0) btn.classList.add('active');
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.cat-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      showMeals(cat);
    });
    categoriesEl.appendChild(btn);
  });
  // show first category by default
  if(categories.length>0) showMeals(categories[0]);
}

// Render meals for a category
function showMeals(category){
  menuItemsEl.innerHTML = '';
  const list = mealsData[category] || [];
  if(list.length===0){
    menuItemsEl.innerHTML = '<p>Bu kateqoriyada yemək yoxdur.</p>';
    return;
  }
  list.forEach(item=>{
    const card = document.createElement('article');
    card.className = 'menu-card';
    card.innerHTML = `
      <h4>${escapeHtml(item.name)}</h4>
      <p>${escapeHtml(item.desc)}</p>
      <p class="price">${escapeHtml(item.price)}</p>
    `;
    menuItemsEl.appendChild(card);
  });
}

// small helper
function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1) }
function escapeHtml(str){ return String(str).replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; }); }

// Active nav on scroll (simple)
const sections = document.querySelectorAll('main section[id]');
const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    const id = entry.target.id;
    const link = document.querySelector('.nav-links a[href="#'+id+'"]');
    if(entry.isIntersecting){
      document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('active'));
      if(link) link.classList.add('active');
    }
  });
},{threshold:0.55});

sections.forEach(s=>observer.observe(s));
