(async (document) => {
  const $audio = document.getElementById('audio');
  const $list = document.getElementById('list');

  const ACTIVE_CLASS = 'active';

  let $current = null;
  let current = null;

  /**
   * @param {MouseEvent} event 
   */
  const onElementClick = (event) => {
    const $target = event.target;
    const link = $target.dataset.link;

    if (!link) return;

    if (link === current) {
      $target.classList.remove(ACTIVE_CLASS);
      $current = null;
      current = null;
      
      $audio.pause();
    } else {
      if ($current)
        $current.classList.remove(ACTIVE_CLASS);

      $target.classList.add(ACTIVE_CLASS);
      $current = $target;
      current = link;
      
      $audio.src = current;
      $audio.load();
      $audio.play();
    }
  }

  /**
   * @param { { name: string, link: string }[] } stations 
   */
  const render = (stations) => {
    for (const { name, link } of stations) {
      const $element = document.createElement('li');
      $element.textContent = name;
      $element.dataset.link = link;
      $list.appendChild($element);
    }
  };

  /* Init */

  $list.addEventListener('click', onElementClick, false);

  const response = await fetch('data.json');
  const data = await response.json();

  render(data.stations);

})(document);