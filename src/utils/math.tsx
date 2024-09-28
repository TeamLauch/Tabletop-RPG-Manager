export function vectorLenght(v1 : {x: number, y: number}){

    return Math.sqrt(v1.x*v1.x + v1.y*v1.y);
}

export function vectorAdd(v1 : {x: number, y: number}, v2 : {x: number, y: number}){

    return {x: v1.x + v2.x, y: v1.y + v2.y};
}