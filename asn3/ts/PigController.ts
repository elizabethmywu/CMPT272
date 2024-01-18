import {Pig} from './Pig'

interface PigServices {
    add(p:Pig):void;
    findPig(id:number):Pig[];
    getAll:() => Pig[];
    delete(id:number, name:string, category:string):void
}

export class PigController implements PigServices{
    piglist:Pig[]  // list of all pigs 

    constructor(){
        if(localStorage.UserArray && localStorage.UserArray.length > 0){
            this.piglist = JSON.parse(localStorage.UserArray)
        } else {
            this.piglist = []
        }
        
    }

    add(p: Pig) {
        this.piglist.push(p)
        localStorage.UserArray = JSON.stringify(this.piglist)
    }
    findPig(id:number){
        let matchingpigs =[]
        for(let p of this.piglist){
            if(p.id == id){
                matchingpigs.push(p)
            }
        }
        return matchingpigs;
    }
    getAll() {
        if(localStorage.UserArray){
            return JSON.parse(localStorage.UserArray)
        }
    } 
    delete(id:number, name:string, category:string){
        this.piglist = this.piglist.filter((p)=>{
            // find matching pig
            let pigs:Pig[] = this.findPig(id)
            for(let x of pigs) {
                if(x.name == name && x.category == category){
                    return p != x
                }
            }
        })
        localStorage.UserArray = JSON.stringify(this.piglist)
    }
} 