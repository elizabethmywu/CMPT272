System.register(["./CategoryAbility", "./PigController", "./Pig"], function (exports_1, context_1) {
    "use strict";
    var CategoryAbility_1, PigController_1, Pig_1, greypigs, chestnutpigs, blackpigs, whitepigs, controller;
    var __moduleName = context_1 && context_1.id;
    // show a certain pig's info
    function showInfo(b) {
        document.getElementById("more-info").style.visibility = "visible"; // display section
        //get pig id, name, category associated with button
        let idname = b.getAttribute("id");
        let idtext = idname.split("-"); // [info, id#]
        let id = Number(idtext[1]); // id #
        let name = b.parentElement.nextElementSibling.textContent;
        let category = b.parentElement.nextElementSibling.nextElementSibling.textContent;
        //find matching pig
        let found = false;
        let pigs = controller.findPig(id);
        for (let p of pigs) {
            if (p.name == name && p.category == category) {
                found = true;
                //display info
                document.getElementById("show-name").innerText = p.name;
                document.getElementById("show-height").innerText = p.height.toString();
                document.getElementById("show-weight").innerText = p.weight.toString();
                document.getElementById("show-personality").innerText = p.personality;
                document.getElementById("show-category").innerText = p.category;
                document.getElementById("show-breed").innerText = p.breed;
                document.getElementById("show-ability-name").innerText = p.ability;
                if (p.category != "Chestnut") {
                    document.getElementById("show-ability-detail").innerText = p.rating.toString();
                }
                else {
                    document.getElementById("show-ability-detail").innerText = p.language;
                }
                return;
            }
        }
        if (found == false) {
            alert("Error: pig not found");
        }
    }
    // delete pig
    function deletePig(b) {
        //get pig id, name, category associated with button
        let idname = b.getAttribute("id");
        let idtext = idname.split("-"); // [info, id#]
        let id = Number(idtext[1]); // id #
        let name = b.parentElement.previousElementSibling.previousElementSibling.textContent;
        let category = b.parentElement.previousElementSibling.textContent;
        if (name && category) {
            let pigtabledata = document.querySelectorAll("[id=info-" + id + "]");
            for (let i in pigtabledata) {
                let pigtablename = pigtabledata[i].parentElement.nextElementSibling.textContent;
                let pigtablecate = pigtabledata[i].parentElement.nextElementSibling.nextElementSibling.textContent;
                if (pigtablename == name && pigtablecate == category) {
                    pigtabledata[i].parentElement.parentElement.remove(); // remove <tr>
                    break;
                }
            }
            controller.delete(id, name, category); // delete from storage
        }
    }
    // when page opens, load the pig list
    function loadList() {
        let mainlistbody = document.getElementById("all-pigs");
        let allpigs = controller.getAll();
        if (allpigs) {
            for (let p of allpigs) {
                let newrow = "<tr class='item'><td><button id='info-" + p.id.toString() + "'>More Info</button></td><td>" + p.name + "</td><td>" + p.category + "</td><td><button id='del-" + p.id.toString() + "'>Delete</button></td></tr>";
                mainlistbody.insertAdjacentHTML("beforeend", newrow);
            }
        }
    }
    // changes list of breeds to select from based on pig category
    function breedList(pigcategory) {
        let color = [];
        if (pigcategory.toLowerCase() == "black") {
            color = blackpigs;
        }
        else if (pigcategory.toLowerCase() == "grey") {
            color = greypigs;
        }
        else if (pigcategory.toLowerCase() == "chestnut") {
            color = chestnutpigs;
        }
        else if (pigcategory.toLowerCase() == "white") {
            color = whitepigs;
        }
        let options = ''; // store code
        for (let p in color) {
            options += '<option value="' + color[p] + '"></option>'; // Storing options in variable
        }
        document.getElementById("breeds").innerHTML = options;
    }
    // validate input on rating, height, weight , then name,personality,breed
    function checkInput() {
        const temp = (document.querySelector('label[for="ability"]'));
        const ability = temp.innerText;
        const inputbar = document.getElementById("ability");
        const rate = Number(inputbar.value);
        const minnum = Number(inputbar.getAttribute("min"));
        const maxnum = Number(inputbar.getAttribute("max"));
        if (ability != "Language:") {
            if (rate > maxnum || rate < minnum) {
                const category = document.getElementById("category").value;
                if (category.toLowerCase() == "black") {
                    alert("Please enter a number between 0 and 10 (inclusive) for the ability.");
                }
                else {
                    alert("Please enter a number between 0 and 100 (inclusive) for the ability.");
                }
                return false;
            }
        }
        const height = Number(document.getElementById("height").value);
        const weight = Number(document.getElementById("weight").value);
        const hinp = document.getElementById("height");
        const winp = document.getElementById("weight");
        const minh = Number(inputbar.getAttribute("min"));
        const minw = Number(winp.getAttribute("min"));
        if (height < minh || weight < minw) {
            alert("Please enter a positive number for the height and weight.");
            return false;
        }
        const name = document.getElementById("name").value;
        const personality = document.getElementById("personality").value;
        const breed = document.getElementById("breed").value;
        if (name == "" || personality == "" || breed == "") {
            alert("Please fill in all fields");
            return false;
        }
        return true;
    }
    //display new pig
    function addtoList(p) {
        let mainlistbody = document.getElementById("all-pigs");
        let newrow = "<tr class='item'><td><button id='info-" + p.id.toString() + "'>More Info</button></td><td class='main-name'>" + p.name + "</td><td class='main-cate'>" + p.category + "</td><td><button id='del-" + p.id.toString() + "'>Delete</button></td></tr>";
        mainlistbody.insertAdjacentHTML("beforeend", newrow);
        // add event listeners to new info/delete buttons
        let newinfo = document.querySelectorAll('button[id^="info-"]');
        let last = newinfo[newinfo.length - 1];
        last.addEventListener('click', function () {
            showInfo(this);
        });
        let newdel = document.querySelectorAll('button[id^="del-"]');
        last = newdel[newdel.length - 1];
        last.addEventListener('click', function () {
            let choice = confirm("Are you sure you want to delete this pig?");
            if (choice) {
                deletePig(this);
            }
        });
    }
    return {
        setters: [
            function (CategoryAbility_1_1) {
                CategoryAbility_1 = CategoryAbility_1_1;
            },
            function (PigController_1_1) {
                PigController_1 = PigController_1_1;
            },
            function (Pig_1_1) {
                Pig_1 = Pig_1_1;
            }
        ],
        execute: function () {
            greypigs = ["Iron Age pig", "Turopolje", "Sicilian Grey"];
            chestnutpigs = ["Duroc", "Kunekune", "Red Mangalitsa", "Red Wattle hog", "Tamworth", "Husum Red Pied",
                "Hereford", "Bantu", "Oxford Sandy and Black"];
            blackpigs = ["Ankamali", "Berkshire", "Basque", "Chiangmai", "Chato Murciano", "Gascon", "Mulefoot",
                "Poland China", "Meishan", "Taihu", "Pot-Bellied", "Fengjing", "Tibetan", "Iberian"];
            whitepigs = ["Yorkshire", "Landrace", "Lop", "Forest Mountain", "Göttingen Minipig", "Lacombe",
                "Curly Coat", "Sushan Pig", "Tsivilsk", "White Steppe", "Welsh", "Thuoc Nhieu"];
            controller = new PigController_1.PigController();
            // load list on open
            window.onload = (event) => {
                loadList();
                // prepare buttons to see more info about a pig
                let infobuttons = document.querySelectorAll('button[id^="info-"]');
                for (let b of infobuttons) {
                    b.addEventListener('click', function () {
                        showInfo(this);
                    });
                }
                // prepare delete buttons
                let deletebuttons = document.querySelectorAll('button[id^="del-"]');
                for (let b of deletebuttons) {
                    b.addEventListener('click', function () {
                        let choice = confirm("Are you sure you want to delete this pig?");
                        if (choice) {
                            deletePig(this);
                        }
                    });
                }
            };
            // open up add-pig page
            document.getElementById("add-pig").addEventListener('click', function () {
                document.getElementById("add-new").style.visibility = "visible";
                breedList('grey'); // set default breed list
            });
            // category selected
            document.getElementById("category").addEventListener('click', function () {
                var cate = document.getElementById("category");
                var value = cate.value;
                // update breed list
                breedList(value);
                // update ability
                let dynam = document.querySelector('label[for="ability"]');
                let dynam_input = document.getElementById("ability");
                if (value.toLowerCase() == "black") {
                    dynam.textContent = CategoryAbility_1.CategoryAbility.Black + " (0-10):";
                    dynam_input.setAttribute("type", "number");
                    dynam_input.setAttribute("min", "0");
                    dynam_input.setAttribute("max", "10");
                }
                else if (value.toLowerCase() == "grey") {
                    dynam.textContent = CategoryAbility_1.CategoryAbility.Grey + " (0-100):";
                    ;
                    dynam_input.setAttribute("type", "number");
                    dynam_input.setAttribute("min", "0");
                    dynam_input.setAttribute("max", "100");
                }
                else if (value.toLowerCase() == "chestnut") {
                    dynam.textContent = CategoryAbility_1.CategoryAbility.Chestnut + ":";
                    dynam_input.setAttribute("type", "string");
                    dynam_input.setAttribute("value", "English");
                    dynam_input.removeAttribute("max");
                    dynam_input.removeAttribute("min");
                }
                else if (value.toLowerCase() == "white") {
                    dynam.textContent = CategoryAbility_1.CategoryAbility.White + " (0-100):";
                    ;
                    dynam_input.setAttribute("type", "number");
                    dynam_input.setAttribute("min", "0");
                    dynam_input.setAttribute("max", "100");
                }
            });
            // save new pig
            document.getElementById("save-new").addEventListener('click', function () {
                let proceed = checkInput();
                if (proceed) {
                    const name = document.getElementById("name").value;
                    const height = Number(document.getElementById("height").value);
                    const weight = Number(document.getElementById("weight").value);
                    const personality = document.getElementById("personality").value;
                    const category = document.getElementById("category").value;
                    const breed = document.getElementById("breed").value;
                    const ability_label = document.querySelector('label[for="ability"]').innerText;
                    const ability_desc = ability_label.split(/[.,!,?,:, ]/);
                    const ability = ability_desc[0];
                    let new_pig = new Pig_1.Pig(name, category, breed, height, weight, personality, ability);
                    if (ability == "Language") {
                        let lang = document.getElementById("ability").value;
                        new_pig.addLanguage(lang);
                    }
                    else {
                        let rate = Number(document.getElementById("ability").value);
                        new_pig.addRating(rate);
                    }
                    controller.add(new_pig);
                    addtoList(new_pig);
                    // clear inputs
                }
            });
        }
    };
});
