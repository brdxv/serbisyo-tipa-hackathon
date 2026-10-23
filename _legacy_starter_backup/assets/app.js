const cards = [...document.querySelectorAll('.service-card')];
const searchInput = document.getElementById('searchInput');
const resultCount = document.getElementById('resultCount');
const emptyState = document.getElementById('emptyState');
const sortSelect = document.getElementById('sortSelect');
let category = 'All', openOnly = false, accessibleOnly = false;
function render() {
  const q = searchInput.value.toLowerCase().trim();
  let visible = cards.filter(card => {
    const matchesText = card.dataset.name.includes(q) || card.dataset.category.toLowerCase().includes(q);
    const matchesCategory = category === 'All' || card.dataset.category.toLowerCase().includes(category.toLowerCase());
    const matchesOpen = !openOnly || card.dataset.status === 'Open';
    return matchesText && matchesCategory && matchesOpen;
  });
  const sort = sortSelect.value;
  visible.sort((a,b) => {
    if (sort === 'wait') return +a.dataset.wait - +b.dataset.wait;
    if (sort === 'reliability') return +b.dataset.reliability - +a.dataset.reliability;
    if (sort === 'score') return +b.dataset.score - +a.dataset.score;
    return parseFloat(a.dataset.distance) - parseFloat(b.dataset.distance);
  });
  const list = document.getElementById('serviceList');
  cards.forEach(card => card.hidden = true);
  visible.forEach(card => { card.hidden = false; list.appendChild(card); });
  resultCount.textContent = `${visible.length} service${visible.length === 1 ? '' : 's'} around Morong, Rizal`;
  emptyState.hidden = visible.length > 0;
}
searchInput.addEventListener('input', render);
document.getElementById('searchForm').addEventListener('submit', e => {e.preventDefault(); render();});
document.getElementById('clearSearch').addEventListener('click', () => {searchInput.value='';render();searchInput.focus();});
sortSelect.addEventListener('change', render);
document.querySelectorAll('.category').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.category) {
    category = button.dataset.category;
    document.querySelectorAll('.category[data-category]').forEach(b => b.classList.toggle('active', b === button));
  }
  if (button.dataset.filter === 'open') {
    openOnly = !openOnly; button.classList.toggle('active', openOnly);
  }
  if (button.dataset.filter === 'accessible') {
    accessibleOnly = !accessibleOnly; button.classList.toggle('active', accessibleOnly);
    showToast(accessibleOnly ? 'Accessibility filter selected (sample data only).' : 'Accessibility filter cleared.');
  }
  if (button.dataset.sort === 'wait') sortSelect.value = 'wait';
  if (button.dataset.sort === 'reliability') sortSelect.value = 'reliability';
  render();
}));
const modal = document.getElementById('modalBackdrop');
function closeModal(){modal.hidden=true;}
document.getElementById('closeModal').addEventListener('click',closeModal);
modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
document.querySelectorAll('.details-button').forEach(button => button.addEventListener('click', () => {
  const card = button.closest('.service-card');
  document.getElementById('modalTitle').textContent = card.querySelector('h2').textContent;
  document.getElementById('modalCategory').textContent = card.querySelector('.muted').textContent + ' · ' + card.querySelector('.address').textContent.trim();
  document.getElementById('modalWait').textContent = card.dataset.wait + ' min';
  document.getElementById('modalReliability').textContent = card.dataset.reliability + '%';
  document.getElementById('modalScore').textContent = card.dataset.score + '/100';
  modal.hidden = false;
}));
function showToast(message){const toast=document.getElementById('toast');toast.textContent=message;toast.classList.add('show');clearTimeout(window.toastTimeout);window.toastTimeout=setTimeout(()=>toast.classList.remove('show'),2400);}
document.querySelectorAll('.save-button').forEach(button=>button.addEventListener('click',()=>{
  button.classList.toggle('saved');button.textContent=button.classList.contains('saved')?'♥':'♡';
  showToast(button.classList.contains('saved')?'Service saved to your list.':'Service removed from saved list.');
}));
document.getElementById('contributeBtn').addEventListener('click',()=>showToast('Contribution form can be connected to the PHP API next.'));
document.getElementById('mapSearch').addEventListener('click',()=>showToast('Map area search is a demo interaction.'));
let zoom=1;
document.getElementById('zoomIn').addEventListener('click',()=>{zoom=Math.min(zoom+.1,1.4);document.querySelector('.map-panel').style.backgroundSize=`${100*zoom}% ${100*zoom}%`;});
document.getElementById('zoomOut').addEventListener('click',()=>{zoom=Math.max(zoom-.1,.8);document.querySelector('.map-panel').style.backgroundSize=`${100*zoom}% ${100*zoom}%`;});
render();
