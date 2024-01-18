import {CategoryAbility} from './CategoryAbility'
import { PigController } from './PigController'
import { Pig } from './Pig'

var greypigs:string[] = ["Iron Age pig", "Turopolje", "Sicilian Grey"]
var chestnutpigs:string[] = ["Duroc", "Kunekune", "Red Mangalitsa", "Red Wattle hog", "Tamworth", "Husum Red Pied",
                    "Hereford", "Bantu", "Oxford Sandy and Black"]
var blackpigs:string[] = ["Ankamali", "Berkshire", "Basque", "Chiangmai", "Chato Murciano", "Gascon", "Mulefoot",
                "Poland China", "Meishan", "Taihu", "Pot-Bellied", "Fengjing", "Tibetan", "Iberian"]
var whitepigs:string[] = ["Yorkshire", "Landrace", "Lop", "Forest Mountain", "Göttingen Minipig", "Lacombe", 
                "Curly Coat", "Sushan Pig", "Tsivilsk", "White Steppe", "Welsh", "Thuoc Nhieu"]

var controller:PigController = new PigController();

// load list on open
window.onload = (event) => {
    loadList()
    // prepare buttons to see more info about a pig
    let infobuttons:NodeListOf<Element> = document.querySelectorAll('button[id^="info-"]')
    for(let b of infobuttons){
        b!.addEventListener('click', function(this:Element){
            showInfo(this);
        })
    }
    // prepare delete buttons
    let deletebuttons:NodeListOf<Element> = document.querySelectorAll('button[id^="del-"]')
    for(let b of deletebuttons){
        b!.addEventListener('click', function(this:Element){
            let choice:boolean = confirm("Are you sure you want to delete this pig?")
            if(choice){
                deletePig(this)
            }
        })
    }
};
  
// show a certain pig's info
function showInfo(b:Element): void{
    document.getElementById("more-info")!.style.visibility = "visible"; // display section

            //get pig id, name, category associated with button
            let idname:string|null = b.getAttribute("id")
            let idtext:string[] = idname!.split("-")  // [info, id#]
            let id:number = Number(idtext[1]) // id #
            let name:string|null = b.parentElement!.nextElementSibling!.textContent
            let category:string|null = b.parentElement!.nextElementSibling!.nextElementSibling!.textContent

            //find matching pig
            let found:boolean = false
            let pigs:Pig[] = controller.findPig(id)
            for(let p of pigs) {
                if(p.name == name && p.category == category){
                    found = true

                    //display info
                    document.getElementById("show-name")!.innerText = p.name
                    document.getElementById("show-height")!.innerText = p.height.toString()
                    document.getElementById("show-weight")!.innerText = p.weight.toString()
                    document.getElementById("show-personality")!.innerText = p.personality
                    document.getElementById("show-category")!.innerText = p.category
                    document.getElementById("show-breed")!.innerText = p.breed
                    document.getElementById("show-ability-name")!.innerText = p.ability
                    if(p.category != "Chestnut"){
                        document.getElementById("show-ability-detail")!.innerText = p.rating.toString()
                    } else{
                        document.getElementById("show-ability-detail")!.innerText = p.language
                    }

                    return;
                } 
            }

            if(found == false){
                alert("Error: pig not found")
            }
}

// delete pig
function deletePig(b:Element): void{
    //get pig id, name, category associated with button
    let idname:string|null = b.getAttribute("id")
    let idtext:string[] = idname!.split("-")  // [info, id#]
    let id:number = Number(idtext[1]) // id #
    let name:string|null = b.parentElement!.previousElementSibling!.previousElementSibling!.textContent
    let category:string|null = b.parentElement!.previousElementSibling!.textContent
    
    if(name && category){
        let pigtabledata = document.querySelectorAll("[id=info-"+id+"]") 
        for(let i in pigtabledata){
            let pigtablename:string|null = pigtabledata[i]!.parentElement!.nextElementSibling!.textContent
            let pigtablecate:string|null = pigtabledata[i]!.parentElement!.nextElementSibling!.nextElementSibling!.textContent
            if(pigtablename == name && pigtablecate == category){
                pigtabledata[i]!.parentElement!.parentElement!.remove() // remove <tr>
                break
            }
        }
        controller.delete(id, name, category) // delete from storage
    }

}

// when page opens, load the pig list
function loadList(): void{
    let mainlistbody:HTMLElement|null = document.getElementById("all-pigs")

    let allpigs:Pig[] = controller.getAll()
    if(allpigs) {
        for(let p of allpigs){
            let newrow:string = "<tr class='item'><td><button id='info-"+p.id.toString()+"'>More Info</button></td><td>"+p.name+"</td><td>"+p.category+"</td><td><button id='del-"+p.id.toString()+"'>Delete</button></td></tr>";
            mainlistbody!.insertAdjacentHTML("beforeend", newrow);
        }
    }   
}

// open up add-pig page
document.getElementById("add-pig")!.addEventListener('click', function(){
    document.getElementById("add-new")!.style.visibility = "visible"
    breedList('grey'); // set default breed list
})

// category selected
document.getElementById("category")!.addEventListener('click', function(){ 
    var cate:HTMLInputElement = document.getElementById("category") as HTMLInputElement;
    var value:string = cate.value;
    // update breed list
    breedList(value);
    // update ability
    let dynam:Element|null = document.querySelector('label[for="ability"]');
    let dynam_input:HTMLElement|null = document.getElementById("ability");
    if(value.toLowerCase() == "black"){
        dynam!.textContent = CategoryAbility.Black + " (0-10):";
        dynam_input!.setAttribute("type", "number");
        dynam_input!.setAttribute("min","0");
        dynam_input!.setAttribute("max","10");
    } else if(value.toLowerCase() == "grey"){
        dynam!.textContent = CategoryAbility.Grey + " (0-100):";;
        dynam_input!.setAttribute("type", "number");
        dynam_input!.setAttribute("min","0");
        dynam_input!.setAttribute("max","100");
    } else if(value.toLowerCase() == "chestnut"){
        dynam!.textContent = CategoryAbility.Chestnut + ":";
        dynam_input!.setAttribute("type", "string");
        dynam_input!.setAttribute("value", "English");
        dynam_input!.removeAttribute("max");
        dynam_input!.removeAttribute("min");
    } else if(value.toLowerCase() == "white"){
        dynam!.textContent = CategoryAbility.White + " (0-100):";;
        dynam_input!.setAttribute("type", "number");
        dynam_input!.setAttribute("min","0");
        dynam_input!.setAttribute("max","100");
    }
})

// changes list of breeds to select from based on pig category
function breedList(pigcategory:string): void{
    let color:string[] = []

    if(pigcategory.toLowerCase() == "black"){
        color = blackpigs;
    } else if(pigcategory.toLowerCase() == "grey"){
        color = greypigs;
    } else if(pigcategory.toLowerCase() == "chestnut"){
        color = chestnutpigs;
    } else if(pigcategory.toLowerCase() == "white"){
        color = whitepigs;
    }

    let options:string =''; // store code
    for(let p in color){
        options += '<option value="'+color[p]+'"></option>'; // Storing options in variable
    }

    document.getElementById("breeds")!.innerHTML = options;

}

// validate input on rating, height, weight , then name,personality,breed
function checkInput(): boolean {
    const temp:HTMLInputElement = (document.querySelector('label[for="ability"]')) as HTMLInputElement;
    const ability:string = temp!.innerText;
    const inputbar:HTMLElement|null = document.getElementById("ability")
    const rate:number = Number((inputbar as HTMLInputElement).value);
    const minnum:number = Number(inputbar!.getAttribute("min"))
    const maxnum:number = Number(inputbar!.getAttribute("max"))
    
    if(ability != "Language:"){
        if(rate > maxnum || rate < minnum){
            const category:string = (document.getElementById("category") as HTMLInputElement).value
            if(category.toLowerCase() == "black"){
                alert("Please enter a number between 0 and 10 (inclusive) for the ability.")
            } else {
                alert("Please enter a number between 0 and 100 (inclusive) for the ability.")
            }
            return false;
        }
    } 

    const height:number = Number((document.getElementById("height") as HTMLInputElement).value);
    const weight:number = Number((document.getElementById("weight") as HTMLInputElement).value);
    const hinp:HTMLElement|null = document.getElementById("height")
    const winp:HTMLElement|null = document.getElementById("weight")
    const minh:number = Number(inputbar!.getAttribute("min"))
    const minw:number = Number(winp!.getAttribute("min"))

    if(height < minh || weight < minw){
        alert("Please enter a positive number for the height and weight.")
        return false;
    }

    const name:string = (document.getElementById("name") as HTMLInputElement).value;
    const personality:string = (document.getElementById("personality") as HTMLInputElement).value;
    const breed:string = (document.getElementById("breed") as HTMLInputElement).value;
    if(name == "" || personality == "" || breed == ""){
        alert("Please fill in all fields")
        return false;
    }


    return true;
}

// save new pig
document.getElementById("save-new")!.addEventListener('click', function(){ 
    let proceed:boolean = checkInput()
    if(proceed) {
        const name:string = (document.getElementById("name") as HTMLInputElement).value;
        const height:number = Number((document.getElementById("height") as HTMLInputElement).value);
        const weight:number = Number((document.getElementById("weight") as HTMLInputElement).value);
        const personality:string = (document.getElementById("personality") as HTMLInputElement).value;
        const category:string = (document.getElementById("category") as HTMLInputElement).value;
        const breed:string = (document.getElementById("breed") as HTMLInputElement).value;
        const ability_label:string= (document.querySelector('label[for="ability"]') as HTMLInputElement).innerText;
        const ability_desc:string[] = ability_label.split(/[.,!,?,:, ]/)
        const ability:string = ability_desc[0];


        let new_pig:Pig = new Pig(name,category,breed,height,weight,personality,ability)
        if(ability == "Language"){
            let lang:string = (document.getElementById("ability") as HTMLInputElement).value;
            new_pig.addLanguage(lang);
        } else {
            let rate:number = Number((document.getElementById("ability") as HTMLInputElement).value);
            new_pig.addRating(rate);
        }
        controller.add(new_pig)
        addtoList(new_pig)
        // clear inputs

    }
       
})

//display new pig
function addtoList(p:Pig): void{
    let mainlistbody:HTMLElement|null = document.getElementById("all-pigs")
    let newrow:string = "<tr class='item'><td><button id='info-"+p.id.toString()+"'>More Info</button></td><td class='main-name'>"+p.name+"</td><td class='main-cate'>"+p.category+"</td><td><button id='del-"+p.id.toString()+"'>Delete</button></td></tr>";
    
    mainlistbody!.insertAdjacentHTML("beforeend", newrow);

    // add event listeners to new info/delete buttons
    let newinfo:NodeListOf<Element> = document.querySelectorAll('button[id^="info-"]')
    let last:Element = newinfo[newinfo.length- 1];
    last!.addEventListener('click', function(this:Element){
            showInfo(this);
    })
    let newdel:NodeListOf<Element> = document.querySelectorAll('button[id^="del-"]')
    last = newdel[newdel.length- 1];
    last!.addEventListener('click', function(this:Element){
        let choice:boolean = confirm("Are you sure you want to delete this pig?")
            if(choice){
                deletePig(this)
            }
    })

}

