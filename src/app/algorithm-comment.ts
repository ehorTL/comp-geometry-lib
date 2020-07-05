import { AlgorithmExternal } from './algorithm-external';
import { User } from './user';

export class AlgorithmComment {
    constructor(
    public id : number,
    public parentId : number,
    public text : string,
    public created : Date,
    public user : User,
    public algo : AlgorithmExternal){}
}
