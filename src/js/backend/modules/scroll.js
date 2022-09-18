import SimpleBar from 'simplebar'; // or "import SimpleBar from 'simplebar';" if you want to use it manually.

export default class Scroll {
  constructor(element, options) {
    this.element = element || '.is-scroll';
    this.options = options || {};
    this.init();
  }

  init() {
    Array.prototype.forEach.call(
      document.querySelectorAll(this.element),
      el => new SimpleBar()
    );
  }
}
