import axios from "axios";


/**
 * Saves News
 * 
 * @permission ADMIN
 * @param data News Data
 */
export async function saveNews(data : any){
    await axios.post("/api/news/setNews", {data : data});
} 

/**
 * Deletes News
 * 
 * @permission ADMIN
 * @param id News ID
 */
export async function removeNews(id : any){
    await axios.post("/api/news/deleteNews", {id : id});
}