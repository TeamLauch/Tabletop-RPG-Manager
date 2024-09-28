import { User } from "@prisma/client";
import axios from "axios";

/**
 * Saves Character
 * 
 * @param character Character Data
 */
export const saveCharacter = async (character: any) => {
    await axios.post("/api/character/editCharacter", { character: character });
};


/**
 * 
 * Deletes Character
 * 
 * @param id Id of the Character
 */
export const deleteCharacter = async (id: any) => {
    await axios.post("/api/character/deleteCharacter", { id });
}

