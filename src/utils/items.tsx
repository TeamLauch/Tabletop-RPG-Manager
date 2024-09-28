import axios from "axios";

/**
 * 
 * Deletes a Item
 * 
 * @param id Id of the Item
 */
export async function deleteItem(id: string){
    await axios.post("/api/item/deleteItem", {id});
}

/**
 * Saves Data of the Item to the Databasqe
 * 
 * @param data Data of Itemm
 */
export async function saveItem(data : string){
    await axios.post("/api/item/setItem", {data});
}