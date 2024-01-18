System.register([], function (exports_1, context_1) {
    "use strict";
    var Pig;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Pig = class Pig {
                constructor(n, c, b, h, w, p, a) {
                    this.rating = 0;
                    this.language = "";
                    this.id = Pig.amount;
                    Pig.amount++;
                    this.name = n;
                    this.category = c;
                    this.breed = b;
                    this.height = h;
                    this.weight = w;
                    this.personality = p;
                    this.ability = a;
                }
                addRating(r) {
                    this.rating = r;
                }
                addLanguage(l) {
                    this.language = l;
                }
            };
            exports_1("Pig", Pig);
            Pig.amount = 0;
        }
    };
});
