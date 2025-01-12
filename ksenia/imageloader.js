(function (c) {
    c.widget("ui.imageLoader", {
        options: {async: true, images: []}, total: 0, _init: function () {
            var a;
            this.total++;
            this.loaded = 0;
            this.data = [];
            this.stats = {loaded: 0, errored: 0, allcomplete: false};
            if (typeof this.options.images === "string") {
                var b = [];
                c.map(c(this.options.images), function (d) {
                    b.push(c(d).attr("src"))
                });
                this.options.images = b
            }
            for (a = 0; a < this.options.images.length; a++) this.data.push({
                init: false,
                complete: false,
                error: false,
                src: this.options.images[a],
                img: new Image,
                i: a
            });
            for (a = 0; a < this.data.length &&
            (this.options.async === true || a === 0 || a < parseInt(this.options.async, 10)); a++) this._loadImg(a);
            return this
        }, _loadImg: function (a) {
            var b = this;
            if (a !== false && a < b.data.length) if (!b.data[a].init) {
                b.data[a].init = true;
                b._trigger("start", null, {i: a, data: b.getData()});
                setTimeout(function () {
                    b.data[a].img.onerror = function () {
                        b.loaded++;
                        b.stats.errored++;
                        b.data[a].error = true;
                        b._trigger("error", null, {i: a, data: b.getData()});
                        b._complete(a)
                    };
                    b.data[a].img.onload = function () {
                        if (b.data[a].img.width < 1) return b.data[a].img.onerror();
                        b.loaded++;
                        b.stats.loaded++;
                        b.data[a].complete = true;
                        b._trigger("complete", null, {i: a, data: b.getData()});
                        b._complete(a)
                    };
                    b.data[a].img.src = b.data[a].src
                }, 1)
            }
        }, _complete: function (a) {
            if (!this.options.async || typeof this.options.async === "number") this._loadImg(this._next(a));
            if (this.loaded === this.data.length) {
                this._trigger("allcomplete", null, this.getData());
                this.stats.allcomplete = true
            }
        }, _next: function (a) {
            var b;
            for (b = 0; b < this.data.length; b++) if (b !== a && !this.data[b].init) return b;
            return false
        }, getData: function () {
            return c.extend(true,
                [], this.data)
        }, getStats: function () {
            return c.extend(true, [], this.stats)
        }, destroy: function () {
            c.Widget.prototype.destroy.apply(this, arguments)
        }
    })
})(jQuery);