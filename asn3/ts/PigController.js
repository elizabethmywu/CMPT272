System.register([], function (exports_1, context_1) {
    "use strict";
    var PigController;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            PigController = class PigController {
                constructor() {
                    if (localStorage.UserArray && localStorage.UserArray.length > 0) {
                        this.piglist = JSON.parse(localStorage.UserArray);
                    }
                    else {
                        this.piglist = [];
                    }
                }
                add(p) {
                    this.piglist.push(p);
                    localStorage.UserArray = JSON.stringify(this.piglist);
                }
                findPig(id) {
                    let matchingpigs = [];
                    for (let p of this.piglist) {
                        if (p.id == id) {
                            matchingpigs.push(p);
                        }
                    }
                    return matchingpigs;
                }
                getAll() {
                    if (localStorage.UserArray) {
                        return JSON.parse(localStorage.UserArray);
                    }
                }
                delete(id, name, category) {
                    this.piglist = this.piglist.filter((p) => {
                        // find matching pig
                        let pigs = this.findPig(id);
                        for (let x of pigs) {
                            if (x.name == name && x.category == category) {
                                return p != x;
                            }
                        }
                    });
                    localStorage.UserArray = JSON.stringify(this.piglist);
                }
            };
            exports_1("PigController", PigController);
        }
    };
});
