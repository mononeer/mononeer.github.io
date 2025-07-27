if (!!window.EventSource) {
  const source = new EventSource('/events');
  source.onmessage = () => location.reload();
}
