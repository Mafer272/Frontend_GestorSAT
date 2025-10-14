// Navegación simple sin backend
function navTo(url){ window.location.href = url; }

function showModal(id){
  const el = document.getElementById(id);
  if(!el) return;
  el.classList.add('show');
  el.querySelector('[data-close]')?.addEventListener('click', ()=> el.classList.remove('show'));
}

// LOGIN
function initLogin(){
  const form = document.getElementById('loginForm');
  const registerLink = document.getElementById('goRegister');
  const acceptBtn = document.getElementById('acceptLogin');
  if(registerLink) registerLink.addEventListener('click', (e)=>{ e.preventDefault(); navTo('register.html'); });
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      navTo('dashboard.html');
    });
  }
  if(acceptBtn){
    acceptBtn.addEventListener('click', ()=> navTo('dashboard.html'));
  }
}

// REGISTER
function initRegister(){
  const form = document.getElementById('registerForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    showModal('modal-registered');
  });
  document.getElementById('registered-ok')?.addEventListener('click', ()=> navTo('dashboard.html'));
}

// DASHBOARD
function initDashboard(){
  document.getElementById('goClientes')?.addEventListener('click', (e)=>{
    e.preventDefault();
    navTo('clientes.html');
  });
}

// CLIENTES
function initClientes(){
  const form = document.getElementById('clientesForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    showModal('modal-clientes-ok');
  });
  document.getElementById('clientes-ok')?.addEventListener('click', ()=> navTo('tramites.html'));
}

// TRAMITES
function initTramites(){
  const form = document.getElementById('tramitesForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    showModal('modal-tramite-ok');
  });
}

// Boot
document.addEventListener('DOMContentLoaded', ()=>{
  const page = document.body.dataset.page;
  switch(page){
    case 'login': initLogin(); break;
    case 'register': initRegister(); break;
    case 'dashboard': initDashboard(); break;
    case 'clientes': initClientes(); break;
    case 'tramites': initTramites(); break;
  }
});
