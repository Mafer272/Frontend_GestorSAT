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

// LISTADO CLIENTES (TABLA COMPLETA)
let editingTableRowId = null;

function enableEditTable(rowId){
  // Deshabilitar el modo de edición de cualquier otra fila
  if(editingTableRowId !== null && editingTableRowId !== rowId){
    cancelEditTable(editingTableRowId);
  }

  editingTableRowId = rowId;
  const row = document.querySelector(`tr[data-id="${rowId}"]`);
  if(!row) return;

  // Convertir todos los cell-value a inputs editables
  const cells = row.querySelectorAll('td:not(:last-child)');
  cells.forEach(cell => {
    const span = cell.querySelector('.cell-value');
    if(!span) return;

    const value = span.textContent;
    span.dataset.originalValue = value;
    span.style.display = 'none';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    input.className = 'cell-input-table';
    cell.appendChild(input);
  });

  // Cambiar botones: deshabilitar MODIFICAR, agregar GUARDAR y ELIMINAR
  const actionsCell = row.querySelector('td:last-child');
  actionsCell.innerHTML = `
    <button class="btn-table btn-modify" disabled>MODIFICAR</button>
    <button class="btn-table btn-table-save" onclick="saveEditTable(${rowId})">GUARDAR</button>
    <button class="btn-table btn-table-delete" onclick="deleteTableRow(${rowId})">ELIMINAR</button>
  `;
}

function saveEditTable(rowId){
  showModal('modal-save');

  document.getElementById('save-ok')?.addEventListener('click', ()=>{
    const row = document.querySelector(`tr[data-id="${rowId}"]`);
    if(!row) return;

    // Guardar los valores de los inputs de vuelta a spans
    const cells = row.querySelectorAll('td:not(:last-child)');
    cells.forEach(cell => {
      const input = cell.querySelector('.cell-input-table');
      const span = cell.querySelector('.cell-value');
      if(input && span){
        span.textContent = input.value;
        input.remove();
        span.style.display = '';
      }
    });

    // Restaurar el botón MODIFICAR
    const actionsCell = row.querySelector('td:last-child');
    actionsCell.innerHTML = `<button class="btn-table btn-modify" onclick="enableEditTable(${rowId})">MODIFICAR</button>`;

    editingTableRowId = null;
    document.getElementById('modal-save').classList.remove('show');
  }, { once: true });
}

function cancelEditTable(rowId){
  const row = document.querySelector(`tr[data-id="${rowId}"]`);
  if(!row) return;

  // Restaurar valores originales
  const cells = row.querySelectorAll('td:not(:last-child)');
  cells.forEach(cell => {
    const input = cell.querySelector('.cell-input-table');
    const span = cell.querySelector('.cell-value');
    if(input && span){
      input.remove();
      span.style.display = '';
    }
  });

  // Restaurar el botón MODIFICAR
  const actionsCell = row.querySelector('td:last-child');
  actionsCell.innerHTML = `<button class="btn-table btn-modify" onclick="enableEditTable(${rowId})">MODIFICAR</button>`;
}

function deleteTableRow(rowId){
  showModal('modal-delete');

  document.getElementById('delete-ok')?.addEventListener('click', ()=>{
    const row = document.querySelector(`tr[data-id="${rowId}"]`);
    if(row){
      row.remove();
    }
    editingTableRowId = null;
    document.getElementById('modal-delete').classList.remove('show');
  }, { once: true });
}

function initListadoClientes(){
  const searchInput = document.getElementById('searchInput');
  if(searchInput){
    searchInput.addEventListener('input', (e)=>{
      const searchTerm = e.target.value.toLowerCase();
      const rows = document.querySelectorAll('#tableBody tr');

      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
      });
    });
  }

  // Cerrar modales al hacer clic en cancelar
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', (e)=>{
      const modal = e.target.closest('.modal');
      if(modal) modal.classList.remove('show');
    });
  });
}

// LISTADO TRÁMITES
let editingTramiteId = null;
let currentEditingTramiteId = null; // Para el modal de modificación

function enableEditTramite(tramiteId){
  // Guardar ID del trámite que se está editando
  currentEditingTramiteId = tramiteId;

  // Mostrar modal de elección
  showModal('modal-modificar-choice');
}

// Abrir modal para modificar trámite
function abrirModificarTramite(){
  if(currentEditingTramiteId === null) return;

  // Cerrar modal de elección
  document.getElementById('modal-modificar-choice').classList.remove('show');

  // Obtener datos del trámite
  const row = document.querySelector(`#tramitesTableBody tr[data-id="${currentEditingTramiteId}"]`);
  if(!row) return;

  const cells = row.querySelectorAll('.cell-value');
  const nombre = cells[0].textContent;
  const descripcion = cells[1].textContent;
  const requisitos = cells[2].textContent;
  const grupo = cells[3].textContent;
  const link = cells[4].textContent;

  // Llenar formulario
  document.getElementById('editTramiteNombre').value = nombre;
  document.getElementById('editTramiteGrupo').value = grupo;
  document.getElementById('editTramiteDescripcion').value = descripcion;
  document.getElementById('editTramiteRequisitos').value = requisitos;
  document.getElementById('editTramiteLink').value = link;

  // Mostrar modal de edición
  showModal('modal-modificar-tramite');
}

// Abrir modal para modificar tipo/grupo
function abrirModificarTipo(){
  // Cerrar modal de elección
  document.getElementById('modal-modificar-choice').classList.remove('show');

  // Hacer que las celdas sean editables al hacer clic
  habilitarEdicionGrupos();

  // Mostrar modal de listado de grupos
  showModal('modal-listado-grupos');
}

// Variables para la edición de grupos
let selectedGrupoRow = null;

// Habilitar edición inline en la tabla de grupos
function habilitarEdicionGrupos(){
  const tbody = document.getElementById('gruposTableBody');
  const rows = tbody.querySelectorAll('tr');

  rows.forEach(row => {
    const cells = row.querySelectorAll('td');

    cells.forEach(cell => {
      cell.style.cursor = 'pointer';

      cell.addEventListener('click', function(){
        // Marcar fila como seleccionada
        rows.forEach(r => r.classList.remove('selected-grupo'));
        row.classList.add('selected-grupo');
        selectedGrupoRow = row;

        const span = this.querySelector('.cell-value-grupo');
        if(!span) return;

        // Si ya hay un input, no hacer nada
        if(this.querySelector('.cell-input-grupo')) return;

        const value = span.textContent;
        span.style.display = 'none';

        const input = document.createElement('input');
        input.type = 'text';
        input.value = value;
        input.className = 'cell-input-grupo';
        this.appendChild(input);

        // Seleccionar texto automáticamente
        input.focus();
        input.select();

        // Al perder el foco, guardar el cambio
        input.addEventListener('blur', ()=>{
          span.textContent = input.value;
          input.remove();
          span.style.display = '';
        });

        // Al presionar Enter, guardar
        input.addEventListener('keypress', (e)=>{
          if(e.key === 'Enter'){
            span.textContent = input.value;
            input.remove();
            span.style.display = '';
          }
        });
      });
    });
  });
}

// Eliminar grupo seleccionado
function eliminarGrupoSeleccionado(){
  if(!selectedGrupoRow){
    alert('Por favor selecciona un grupo haciendo clic en una fila');
    return;
  }

  // Mostrar modal de confirmación
  showModal('modal-grupo-eliminado');
}

// Guardar cambios en grupos
function guardarCambiosGrupos(){
  // Mostrar modal de confirmación
  showModal('modal-grupos-guardados');
}


// Array para almacenar tipos/grupos personalizados
let tiposPersonalizados = [];

// Contador para IDs de trámites
let nextTramiteId = 11; // Empezamos desde 11 porque hay 10 trámites existentes

// Mostrar modal principal
function showMainModal(){
  showModal('modal-main-choice');
}

// Mostrar modal de agregar trámite
function showAgregarTramiteModal(){
  document.getElementById('modal-main-choice').classList.remove('show');
  showModal('modal-agregar-tramite');
}

// Mostrar modal de agregar tipo
function showAgregarTipoModal(){
  document.getElementById('modal-main-choice').classList.remove('show');
  showModal('modal-agregar-tipo');
}

// Función para agregar un trámite a la tabla
function agregarTramiteATabla(nombre, descripcion, requisitos, grupo, link){
  const tbody = document.getElementById('tramitesTableBody');
  const newRow = document.createElement('tr');
  const newId = nextTramiteId++;

  // Alternar entre rosa y blanco
  const rowClass = (newId % 2 === 1) ? 'row-pink' : 'row-white';
  newRow.setAttribute('data-id', newId);
  newRow.className = rowClass;

  newRow.innerHTML = `
    <td><span class="cell-value">${nombre}</span></td>
    <td><span class="cell-value">${descripcion}</span></td>
    <td><span class="cell-value">${requisitos}</span></td>
    <td><span class="cell-value">${grupo}</span></td>
    <td><span class="cell-value">${link}</span></td>
    <td><button class="btn-table btn-modify" onclick="enableEditTramite(${newId})">MODIFICAR</button></td>
  `;

  tbody.appendChild(newRow);
}

// Función para agregar una opción al dropdown de grupos
function agregarGrupoADropdown(nombreGrupo, link){
  const select = document.getElementById('tramiteGrupo');
  const option = document.createElement('option');
  option.value = nombreGrupo;
  option.textContent = nombreGrupo;
  option.dataset.link = link; // Guardamos el link como atributo de datos
  select.appendChild(option);

  // Guardar en array de tipos personalizados
  tiposPersonalizados.push({nombre: nombreGrupo, link: link});
}

function initListadoTramites(){
  const searchInput = document.getElementById('searchInputTramites');
  if(searchInput){
    searchInput.addEventListener('input', (e)=>{
      const searchTerm = e.target.value.toLowerCase();
      const rows = document.querySelectorAll('#tramitesTableBody tr');

      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
      });
    });
  }

  // Cerrar modales al hacer clic en cancelar
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', (e)=>{
      const modal = e.target.closest('.modal');
      if(modal) modal.classList.remove('show');
    });
  });

  // Formulario: Agregar Trámite
  const formAgregarTramite = document.getElementById('formAgregarTramite');
  if(formAgregarTramite){
    formAgregarTramite.addEventListener('submit', (e)=>{
      e.preventDefault();

      const nombre = document.getElementById('tramiteNombre').value;
      const grupo = document.getElementById('tramiteGrupo').value;
      const descripcion = document.getElementById('tramiteDescripcion').value;
      const requisitos = document.getElementById('tramiteRequisitos').value;
      const link = document.getElementById('tramiteLink').value;

      // Cerrar formulario y mostrar confirmación
      document.getElementById('modal-agregar-tramite').classList.remove('show');
      showModal('modal-tramite-guardado');

      // Guardar datos temporalmente para agregarlos después de confirmar
      window.tempTramiteData = {nombre, grupo, descripcion, requisitos, link};
    });
  }

  // Botón aceptar del modal de confirmación de trámite
  const btnAceptarTramite = document.getElementById('btn-aceptar-tramite');
  if(btnAceptarTramite){
    btnAceptarTramite.addEventListener('click', ()=>{
      if(window.tempTramiteData){
        const {nombre, grupo, descripcion, requisitos, link} = window.tempTramiteData;
        agregarTramiteATabla(nombre, descripcion, requisitos, grupo, link);

        // Limpiar formulario
        document.getElementById('formAgregarTramite').reset();
        delete window.tempTramiteData;
      }

      // Cerrar modal
      document.getElementById('modal-tramite-guardado').classList.remove('show');
    });
  }

  // Formulario: Agregar Tipo/Grupo
  const formAgregarTipo = document.getElementById('formAgregarTipo');
  if(formAgregarTipo){
    formAgregarTipo.addEventListener('submit', (e)=>{
      e.preventDefault();

      const nombre = document.getElementById('tipoNombre').value;
      const link = document.getElementById('tipoLink').value;

      // Cerrar formulario y mostrar confirmación
      document.getElementById('modal-agregar-tipo').classList.remove('show');
      showModal('modal-tipo-guardado');

      // Guardar datos temporalmente
      window.tempTipoData = {nombre, link};
    });
  }

  // Botón aceptar del modal de confirmación de tipo
  const btnAceptarTipo = document.getElementById('btn-aceptar-tipo');
  if(btnAceptarTipo){
    btnAceptarTipo.addEventListener('click', ()=>{
      if(window.tempTipoData){
        const {nombre, link} = window.tempTipoData;
        agregarGrupoADropdown(nombre, link);

        // Limpiar formulario
        document.getElementById('formAgregarTipo').reset();
        delete window.tempTipoData;
      }

      // Cerrar modal
      document.getElementById('modal-tipo-guardado').classList.remove('show');
    });
  }

  // Formulario: Modificar Trámite
  const formModificarTramite = document.getElementById('formModificarTramite');
  if(formModificarTramite){
    formModificarTramite.addEventListener('submit', (e)=>{
      e.preventDefault();

      const nombre = document.getElementById('editTramiteNombre').value;
      const grupo = document.getElementById('editTramiteGrupo').value;
      const descripcion = document.getElementById('editTramiteDescripcion').value;
      const requisitos = document.getElementById('editTramiteRequisitos').value;
      const link = document.getElementById('editTramiteLink').value;

      // Cerrar formulario y mostrar confirmación
      document.getElementById('modal-modificar-tramite').classList.remove('show');
      showModal('modal-tramite-modificado');

      // Guardar datos temporalmente
      window.tempModificarData = {nombre, grupo, descripcion, requisitos, link};
    });
  }

  // Botón aceptar del modal de confirmación de modificación de trámite
  const btnAceptarModificarTramite = document.getElementById('btn-aceptar-modificar-tramite');
  if(btnAceptarModificarTramite){
    btnAceptarModificarTramite.addEventListener('click', ()=>{
      if(window.tempModificarData && currentEditingTramiteId !== null){
        const {nombre, grupo, descripcion, requisitos, link} = window.tempModificarData;
        const row = document.querySelector(`#tramitesTableBody tr[data-id="${currentEditingTramiteId}"]`);

        if(row){
          const cells = row.querySelectorAll('.cell-value');
          cells[0].textContent = nombre;
          cells[1].textContent = descripcion;
          cells[2].textContent = requisitos;
          cells[3].textContent = grupo;
          cells[4].textContent = link;
        }

        // Limpiar
        document.getElementById('formModificarTramite').reset();
        delete window.tempModificarData;
        currentEditingTramiteId = null;
      }

      // Cerrar modal
      document.getElementById('modal-tramite-modificado').classList.remove('show');
    });
  }

  // Botón aceptar del modal de confirmación de eliminar grupo
  const btnAceptarEliminarGrupo = document.getElementById('btn-aceptar-eliminar-grupo');
  if(btnAceptarEliminarGrupo){
    btnAceptarEliminarGrupo.addEventListener('click', ()=>{
      if(selectedGrupoRow){
        selectedGrupoRow.remove();
        selectedGrupoRow = null;
      }

      // Cerrar modal de confirmación y volver al listado
      document.getElementById('modal-grupo-eliminado').classList.remove('show');
    });
  }

  // Botón aceptar del modal de confirmación de guardar grupos
  const btnAceptarGuardarGrupos = document.getElementById('btn-aceptar-guardar-grupos');
  if(btnAceptarGuardarGrupos){
    btnAceptarGuardarGrupos.addEventListener('click', ()=>{
      // Aquí se podrían guardar los cambios en el backend si existiera
      // Por ahora solo cerramos los modales

      // Cerrar modal de confirmación
      document.getElementById('modal-grupos-guardados').classList.remove('show');

      // Cerrar modal de listado de grupos
      document.getElementById('modal-listado-grupos').classList.remove('show');

      // Limpiar selección
      selectedGrupoRow = null;
    });
  }
}

// ESTADO DE TRÁMITES
let nextEstadoId = 16; // Empezamos desde 16 porque hay 15 registros existentes

function abrirModalAgregarEstado(){
  showModal('modal-agregar-estado');
}

// Cambiar color del select según el estado seleccionado
function cambiarEstado(selectElement){
  const estado = selectElement.value;

  // Remover todas las clases de estado previas
  selectElement.classList.remove('select-pendiente', 'select-proceso', 'select-finalizado', 'select-rechazado');

  // Agregar la clase correspondiente al nuevo estado
  if(estado === 'Pendiente'){
    selectElement.classList.add('select-pendiente');
  } else if(estado === 'En Proceso'){
    selectElement.classList.add('select-proceso');
  } else if(estado === 'Finalizado'){
    selectElement.classList.add('select-finalizado');
  } else if(estado === 'Rechazado'){
    selectElement.classList.add('select-rechazado');
  }

  // Mostrar mensaje de confirmación temporal
  mostrarNotificacionEstado(selectElement);
}

// Mostrar notificación temporal al cambiar estado
function mostrarNotificacionEstado(selectElement){
  const row = selectElement.closest('tr');
  const tramite = row.querySelector('td:first-child').textContent;
  const estado = selectElement.value;

  // Crear notificación
  const notification = document.createElement('div');
  notification.className = 'estado-notification';
  notification.textContent = `Estado actualizado: ${tramite} → ${estado}`;
  document.body.appendChild(notification);

  // Mostrar con animación
  setTimeout(()=> notification.classList.add('show'), 10);

  // Ocultar después de 2.5 segundos
  setTimeout(()=>{
    notification.classList.remove('show');
    setTimeout(()=> notification.remove(), 300);
  }, 2500);
}

function agregarEstadoATabla(tramite, cliente, fecha, estado){
  const tbody = document.getElementById('estadoTableBody');
  const newRow = document.createElement('tr');
  const newId = nextEstadoId++;

  newRow.setAttribute('data-id', newId);

  newRow.innerHTML = `
    <td>${tramite}</td>
    <td>${cliente}</td>
    <td>${fecha}</td>
    <td>
      <select class="estado-select" onchange="cambiarEstado(this)">
        <option value="Pendiente" ${estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
        <option value="En Proceso" ${estado === 'En Proceso' ? 'selected' : ''}>En Proceso</option>
        <option value="Finalizado" ${estado === 'Finalizado' ? 'selected' : ''}>Finalizado</option>
        <option value="Rechazado" ${estado === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
      </select>
    </td>
  `;

  tbody.appendChild(newRow);

  // Aplicar color inicial al select
  const select = newRow.querySelector('.estado-select');
  cambiarEstado(select);
}

function initEstadoTramites(){
  // Aplicar colores iniciales a todos los selects existentes
  document.querySelectorAll('.estado-select').forEach(select => {
    const estado = select.value;
    if(estado === 'Pendiente'){
      select.classList.add('select-pendiente');
    } else if(estado === 'En Proceso'){
      select.classList.add('select-proceso');
    } else if(estado === 'Finalizado'){
      select.classList.add('select-finalizado');
    } else if(estado === 'Rechazado'){
      select.classList.add('select-rechazado');
    }
  });

  const searchInput = document.getElementById('searchInputEstado');
  if(searchInput){
    searchInput.addEventListener('input', (e)=>{
      const searchTerm = e.target.value.toLowerCase();
      const rows = document.querySelectorAll('#estadoTableBody tr');

      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
      });
    });
  }

  // Cerrar modales al hacer clic en cancelar
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', (e)=>{
      const modal = e.target.closest('.modal');
      if(modal) modal.classList.remove('show');
    });
  });

  // Formulario: Agregar Estado
  const formAgregarEstado = document.getElementById('formAgregarEstado');
  if(formAgregarEstado){
    formAgregarEstado.addEventListener('submit', (e)=>{
      e.preventDefault();

      const cliente = document.getElementById('estadoCliente').value;
      const tramite = document.getElementById('estadoTramite').value;
      const fechaInicio = document.getElementById('estadoFechaInicio').value;
      const estado = document.getElementById('estadoEstado').value;

      // Convertir fecha a formato dd/mm/yyyy
      const [year, month, day] = fechaInicio.split('-');
      const fechaFormateada = `${day}/${month}/${year}`;

      // Cerrar formulario y mostrar confirmación
      document.getElementById('modal-agregar-estado').classList.remove('show');
      showModal('modal-estado-guardado');

      // Guardar datos temporalmente
      window.tempEstadoData = {tramite, cliente, fecha: fechaFormateada, estado};
    });
  }

  // Botón aceptar del modal de confirmación
  const btnAceptarEstado = document.getElementById('btn-aceptar-estado');
  if(btnAceptarEstado){
    btnAceptarEstado.addEventListener('click', ()=>{
      if(window.tempEstadoData){
        const {tramite, cliente, fecha, estado} = window.tempEstadoData;
        agregarEstadoATabla(tramite, cliente, fecha, estado);

        // Limpiar formulario
        document.getElementById('formAgregarEstado').reset();
        delete window.tempEstadoData;
      }

      // Cerrar modal
      document.getElementById('modal-estado-guardado').classList.remove('show');
    });
  }
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
    case 'listado-clientes': initListadoClientes(); break;
    case 'listado-tramites': initListadoTramites(); break;
    case 'estado-tramites': initEstadoTramites(); break;
  }
});
