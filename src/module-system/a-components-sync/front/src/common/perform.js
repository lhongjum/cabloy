export default {
  props: {
    onPerform: {
      type: Function,
    },
    context: {
    },
  },
  data() {
    return {
      _preloader: null,
    };
  },
  methods: {
    onClick(event) {
      if (this._preloader) return;
      this.$emit('click', event);

      const linkEl = this.getLinkEl && this.getLinkEl();
      if (linkEl && linkEl.length > 0) {
        // popover
        if (linkEl.hasClass('popover-close')) {
          this.$f7.popover.close(linkEl.parents('.popover'));
        }

        // only preventDefault for link
        event.stopPropagation();
        event.preventDefault();
      }

      if (!this.onPerform) return this.onLinkClick && this.onLinkClick(event);

      try {
        const res = this.onPerform(event, this.context);
        if (this.$meta.util.isPromise(res)) {
          this._showPreloader();
          res.then(res2 => {
            this._hidePreloader();
            if (res2 === true) {
              this.$view.toast.show({ text: this.$text('Operation succeeded') });
            } else if (typeof res2 === 'string') {
              this.$view.toast.show({ text: res2 });
            }
          }).catch(err => {
            this._hidePreloader();
            if (err && err.code !== 401) {
              this.$view.toast.show({ text: err.message });
            }
          });
        } else {
          if (res === true) {
            this.$view.toast.show({ text: this.$text('Operation succeeded') });
          }
        }
      } catch (err) {
        this.$view.toast.show({ text: err.message });
      }

    },
    _showPreloader() {
      const html = `
        <div class="button-backdrop">
          <div class="preloader">
            <span class="preloader-inner">
              <span class="preloader-inner-gap"></span>
              <span class="preloader-inner-left">
                <span class="preloader-inner-half-circle"></span>
              </span>
              <span class="preloader-inner-right">
                <span class="preloader-inner-half-circle"></span>
              </span>
            </span>
          </div>
        </div>
      `;
      this._preloader = this.$$(html);
      this.$$(this.$el).append(this._preloader);
      this._preloader.addClass('not-animated').addClass('backdrop-in');
    },
    _hidePreloader() {
      if (this._preloader) {
        this._preloader.remove();
        this._preloader = null;
      }
    },
  },
};