// Safe client-side logic only — does NOT send load/test traffic.
// Generates example k6 script and curl/ab commands for *authorized* testing.

function qs(id){return document.getElementById(id)}
const targetEl = qs('target')
const concEl = qs('concurrency')
const durEl = qs('duration')
const confirmEl = qs('confirmOwn')
const out = qs('outputArea')
const dl = qs('downloadLink')
const notice = qs('notice')

function escapeHtml(s){ return (s+'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }

function generateK6Script(target, vus, duration){
  return `import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: ${vus},
  duration: '${duration}s',
};

export default function () {
  http.get('${target}');
  sleep(1);
}
`;
}

function generateABCommand(target, conc, duration){
  // ab runs a fixed number of requests; approximate requests = conc * duration
  const requests = Math.max(1, Math.floor(conc * duration));
  return `ab -n ${requests} -c ${conc} ${target}`;
}

function generateCurlExample(target){
  return `# Simple example (run locally, for debugging only)
curl -I ${target}
# Or run a loop locally (bash)
for i in {1..10}; do curl -s -o /dev/null -w "%{http_code} %{time_total}\\n" ${target}; done
`;
}

// UI handlers
qs('generateK6').addEventListener('click', () => {
  if(!confirmEl.checked){ alert('You must confirm you own or have permission to test this target.'); return; }
  const t = targetEl.value.trim();
  if(!t){ alert('Enter a valid target URL'); return; }
  const vus = Math.max(1,parseInt(concEl.value)||1)
  const dur = Math.max(1,parseInt(durEl.value)||30)
  const script = generateK6Script(t, vus, dur)
  out.textContent = `### k6 script (preview)\n\n${script}\n### Command to run locally:\n\nk6 run k6_test.js`
  // prepare download
  const blob = new Blob([script], {type:'text/javascript'})
  const url = URL.createObjectURL(blob)
  dl.href = url
  dl.classList.remove('hidden')
});

qs('generateCurl').addEventListener('click', () => {
  const t = targetEl.value.trim();
  if(!confirmEl.checked){ alert('You must confirm you own or have permission to test this target.'); return; }
  if(!t){ alert('Enter a valid target URL'); return; }
  out.textContent = generateCurlExample(t)
  dl.classList.add('hidden')
});

qs('simulate').addEventListener('click', () => {
  // purely client-side simulation animation (no network load)
  const t = targetEl.value.trim();
  if(!confirmEl.checked){ alert('You must confirm you own or have permission to test this target.'); return; }
  if(!t){ alert('Enter a valid target URL'); return; }
  const vus = Math.max(1,parseInt(concEl.value)||1)
  const dur = Math.max(1,parseInt(durEl.value)||10)
  out.textContent = `Simulating a ${vus}-VU test for ${dur} seconds against ${t}\n\n(This is a client-side simulation — no traffic was sent.)\n\nProgress:\n`
  let elapsed=0
  const interval = setInterval(()=> {
    elapsed++
    out.textContent = out.textContent + '■'
    if(elapsed>=dur){ clearInterval(interval); out.textContent += `\n\nSimulation complete. Use k6/locust/ab locally to run real, authorized tests.`}
  }, 500)
});

// helper: show a stronger warning if checkbox not checked
confirmEl.addEventListener('change', () => {
  if(!confirmEl.checked){
    notice.textContent = 'You MUST confirm permission before using generated commands.';
    notice.style.color = '#ff9b9b'
  } else {
    notice.textContent = 'Permission confirmed. Use commands responsibly and only on targets you own or are allowed to test.';
    notice.style.color = ''
  }
});
