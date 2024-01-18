import {CategoryAbility} from './CategoryAbility'

export class Pig {
    name: string
    category: string
    breed: string
    height: number
    weight: number
    personality: string
    ability: string
    rating: number = 0
    language: string =""
    
    id:number
    static amount:number = 0

    constructor(n:string, c:string, b:string, h:number, w:number, p:string, a:string){
        this.id = Pig.amount
        Pig.amount++

        this.name = n
        this.category = c
        this.breed = b
        this.height = h
        this.weight = w
        this.personality = p
        this.ability = a
    }

    addRating(r:number){
        this.rating = r
    }

    addLanguage(l:string){
        this.language = l
    }
}

