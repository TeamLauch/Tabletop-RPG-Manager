import { Vector3 } from "three";

/**
 * 
 * @param qube1 Qube 1
 * @param qube2 Qube 2
 * @returns Tests for Collision
 */
export function doesCollide(qube1 : Vector3[], qube2 : Vector3[]){
    let maxX = qube1[6].x, maxY = qube1[6].y, maxZ = qube1[6].z;
    let minX= qube1[0].x, minY= qube1[0].y, minZ= qube1[0].z;
    for(const vertex of qube2){
        if(minX > vertex.x || maxX < vertex.x || 
           minY > vertex.y || maxY < vertex.y ||
           minZ > vertex.z || maxZ < vertex.z){
            continue;
        }
        return true;
    }
    return false;
}

/**
 * 
 * @param mesh Mesh
 * @returns Returns a Cube containing the Mesh
 */
export function meshToCube(mesh : Vector3[]){
    let maxX = 0, maxY = 0, maxZ = 0;
    let minX= 0, minY= 0, minZ= 0;

    let first = true;
    for(const vertex of mesh){
        if(first){
            minX = vertex.x;
            maxX = vertex.x;
            maxY = vertex.y;
            minY = vertex.y;
            maxZ = vertex.z;
            minZ = vertex.z;
            first =false;
            continue;
        }
        minX = Math.min(minX, vertex.x);
        maxX = Math.max(maxX, vertex.x);

        minY = Math.min(minY, vertex.y);
        maxY = Math.max(maxY, vertex.y);

        minZ = Math.min(minZ, vertex.z);
        maxZ = Math.max(maxZ, vertex.z);
    }
    return [new Vector3(minX, minY, minZ), new Vector3(maxX, minY, minZ), 
            new Vector3(maxX, maxY, minZ), new Vector3(minX, maxY, minZ),

            new Vector3(minX, minY, maxZ), new Vector3(maxX, minY, maxZ),
            new Vector3(maxX, maxY, maxZ), new Vector3(minX, maxY, maxZ)]
}