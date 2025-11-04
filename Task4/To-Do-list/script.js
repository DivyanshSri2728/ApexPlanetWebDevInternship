 const LS_TASKS = 'td_app_tasks_v1';
    const LS_NOTES = 'td_app_notes_v1';

    // State
    let tasks = []; // {id,title,due,priority,note,done,created}
    let notes = []; // {id,title,body,created}
    let mode = 'tasks';

    // Elements
    const tabs = document.querySelectorAll('.tab');
    const taskForm = document.getElementById('taskForm');
    const noteForm = document.getElementById('noteForm');
    const taskZone = document.getElementById('taskZone');
    const noteZone = document.getElementById('noteZone');
    const emptyState = document.getElementById('emptyState');
    const storageCount = document.getElementById('storageCount');
    const itemsInfo = document.getElementById('itemsInfo');
    const searchInput = document.getElementById('search');

    // Load from localStorage
    function load(){
      try{ tasks = JSON.parse(localStorage.getItem(LS_TASKS)) || []; }catch(e){ tasks = []; }
      try{ notes = JSON.parse(localStorage.getItem(LS_NOTES)) || []; }catch(e){ notes = []; }
      render();
    }

    function save(){
      localStorage.setItem(LS_TASKS, JSON.stringify(tasks));
      localStorage.setItem(LS_NOTES, JSON.stringify(notes));
      updateStorageCount();
    }

    function updateStorageCount(){
      const count = tasks.length + notes.length;
      storageCount.textContent = count + ' items';
      itemsInfo.textContent = `Tasks: ${tasks.length} • Notes: ${notes.length}`;
    }

    // Helpers
    function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
    function formatDate(d){ if(!d) return ''; const dt = new Date(d); return dt.toLocaleDateString(); }

    // Create
    taskForm.addEventListener('submit', e=>{
      e.preventDefault();
      const title = document.getElementById('taskTitle').value.trim();
      if(!title) return;
      const due = document.getElementById('taskDue').value || null;
      const priority = document.getElementById('taskPriority').value;
      const note = document.getElementById('taskNote').value.trim();
      const item = {id:uid(),title,due,priority,note,done:false,created:Date.now()};
      tasks.unshift(item);
      save();
      taskForm.reset();
      render();
    });

    noteForm.addEventListener('submit', e=>{
      e.preventDefault();
      const title = document.getElementById('noteTitle').value.trim();
      const body = document.getElementById('noteBody').value.trim();
      if(!title && !body) return;
      const item = {id:uid(),title,body,created:Date.now()};
      notes.unshift(item);
      save();
      noteForm.reset();
      render();
    });

    // Tabs
    tabs.forEach(t=>t.addEventListener('click', ()=>{
      tabs.forEach(x=>x.classList.remove('active'));
      t.classList.add('active');
      mode = t.dataset.mode;
      document.getElementById('taskForm').style.display = mode === 'tasks' ? 'block' : 'none';
      document.getElementById('noteForm').style.display = mode === 'notes' ? 'block' : 'none';
      render();
    }));

    // Render
    function render(){
      // filter & search
      const q = searchInput.value.trim().toLowerCase();
      const filter = document.querySelector('.pill.active')?.id || 'showAll';

      // tasks
      taskZone.innerHTML = '';
      const tlist = tasks.filter(t=>{
        if(filter==='showActive' && t.done) return false;
        if(filter==='showDone' && !t.done) return false;
        if(q){ return (t.title + ' ' + (t.note||'')).toLowerCase().includes(q); }
        return true;
      });

      if(tlist.length===0 && mode==='tasks') taskZone.innerHTML = '<div class="empty">No tasks found.</div>';
      tlist.forEach(t=>{
        const el = document.createElement('div'); el.className='card';
        el.innerHTML = `
          <div class="item-row">
            <div class="item-left">
              <div class="checkbox ${t.done? 'checked':''}" data-id="${t.id}"></div>
              <div>
                <div class="title">${escapeHtml(t.title)}</div>
                <div class="meta">${t.priority.toUpperCase()} ${t.due? '• Due: '+formatDate(t.due):''}</div>
              </div>
            </div>
            <div class="actions">
              <button class="action edit" data-id="${t.id}">Edit</button>
              <button class="action delete" data-id="${t.id}">Delete</button>
            </div>
          </div>
          ${t.note? '<div class="note-body">'+escapeHtml(t.note)+'</div>':''}
        `;
        taskZone.appendChild(el);
      });

      // notes
      noteZone.innerHTML = '';
      const nlist = notes.filter(n=>{
        if(q) return (n.title + ' ' + n.body).toLowerCase().includes(q);
        return true;
      });
      if(nlist.length===0 && mode==='notes') noteZone.innerHTML = '<div class="empty">No notes found.</div>';
      nlist.forEach(n=>{
        const el = document.createElement('div'); el.className='card';
        el.innerHTML = `
          <div class="item-row">
            <div class="item-left">
              <div style="min-width:8px"></div>
              <div>
                <div class="title">${escapeHtml(n.title)}</div>
                <div class="meta">${new Date(n.created).toLocaleString()}</div>
              </div>
            </div>
            <div class="actions">
              <button class="action edit-note" data-id="${n.id}">Edit</button>
              <button class="action delete-note" data-id="${n.id}">Delete</button>
            </div>
          </div>
          ${n.body? '<div class="note-body">'+escapeHtml(n.body)+'</div>':''}
        `;
        noteZone.appendChild(el);
      });

      // visibility
      if(mode==='tasks'){ taskZone.style.display='flex'; noteZone.style.display='none'; }
      else{ taskZone.style.display='none'; noteZone.style.display='flex'; }

      emptyState.style.display = (tasks.length===0 && notes.length===0)? 'block':'none';
      updateStorageCount();

      // attach listeners to dynamic elements
      attachDynamicListeners();
    }

    function attachDynamicListeners(){
      document.querySelectorAll('.checkbox').forEach(cb=>{
        cb.onclick = ()=>{
          const id = cb.dataset.id; toggleDone(id); };
      });
      document.querySelectorAll('.action.delete').forEach(b=>{ b.onclick=()=>{ if(confirm('Delete task?')){ deleteTask(b.dataset.id); } }; });
      document.querySelectorAll('.action.edit').forEach(b=>{ b.onclick=()=>{ openEditTask(b.dataset.id); } });
      document.querySelectorAll('.action.delete-note').forEach(b=>{ b.onclick=()=>{ if(confirm('Delete note?')){ deleteNote(b.dataset.id); } }; });
      document.querySelectorAll('.action.edit-note').forEach(b=>{ b.onclick=()=>{ openEditNote(b.dataset.id); } });
    }

    // CRUD operations
    function toggleDone(id){ const idx = tasks.findIndex(t=>t.id===id); if(idx>-1){ tasks[idx].done = !tasks[idx].done; save(); render(); } }
    function deleteTask(id){ tasks = tasks.filter(t=>t.id!==id); save(); render(); }
    function deleteNote(id){ notes = notes.filter(n=>n.id!==id); save(); render(); }

    // Edit flows (simple prompt-based edit to keep code compact)
    function openEditTask(id){ const t = tasks.find(x=>x.id===id); if(!t) return; const newTitle = prompt('Edit title', t.title); if(newTitle===null) return; t.title = newTitle.trim() || t.title; const newDue = prompt('Edit due date (YYYY-MM-DD) or leave blank', t.due||''); if(newDue!==null) t.due = newDue.trim() || null; const newPriority = prompt('Priority: low, medium, high', t.priority)||t.priority; t.priority = ['low','medium','high'].includes(newPriority)? newPriority:t.priority; const newNote = prompt('Notes', t.note||''); if(newNote!==null) t.note = newNote.trim(); save(); render(); }

    function openEditNote(id){ const n = notes.find(x=>x.id===id); if(!n) return; const newTitle = prompt('Edit title', n.title); if(newTitle===null) return; n.title = newTitle.trim() || n.title; const newBody = prompt('Edit body', n.body||''); if(newBody!==null) n.body = newBody.trim(); save(); render(); }

    // Search + filters
    searchInput.addEventListener('input', ()=>render());
    document.getElementById('showAll').addEventListener('click', e=>{ setActiveFilter(e.target); render(); });
    document.getElementById('showActive').addEventListener('click', e=>{ setActiveFilter(e.target); render(); });
    document.getElementById('showDone').addEventListener('click', e=>{ setActiveFilter(e.target); render(); });

    function setActiveFilter(el){ document.querySelectorAll('.pill').forEach(p=>p.classList.remove('active')); el.classList.add('active'); }

    // Export / Import / Clear
    document.getElementById('exportBtn').addEventListener('click', ()=>{
      const payload = { tasks, notes, exportedAt: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
      const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='todo-notes-export.json'; a.click(); URL.revokeObjectURL(url);
    });
    document.getElementById('importBtn').addEventListener('click', ()=>document.getElementById('importFile').click());
    document.getElementById('importFile').addEventListener('change', e=>{
      const f = e.target.files[0]; if(!f) return; const reader=new FileReader(); reader.onload=ev=>{
        try{ const data = JSON.parse(ev.target.result); if(Array.isArray(data.tasks) && Array.isArray(data.notes)){ tasks = data.tasks; notes = data.notes; save(); render(); alert('Imported successfully'); } else alert('Invalid file format'); }catch(err){ alert('Failed to import: '+err.message); }
      }; reader.readAsText(f);
    });
    document.getElementById('clearAll').addEventListener('click', ()=>{ if(confirm('Clear ALL tasks and notes? This cannot be undone.')){ tasks=[]; notes=[]; save(); render(); } });

    // Utilities
    function escapeHtml(s){ if(!s) return ''; return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

    // Initialize
    (function init(){
      // attach simple filter active default
      setActiveFilter(document.getElementById('showAll'));
      load();
    })();