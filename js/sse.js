export function startSSE(){
  if(!window.EventSource) return;
  const source = new EventSource('/events');
  source.onmessage = () => location.reload();
}
