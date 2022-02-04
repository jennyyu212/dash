import { StoreType } from "./stores/nodestores/NodeStore"

/**
 * This is a class that contains static methods. 
 * This means that the methods you write here can be accessed in the same way from anywhere else in the project (as long as this file is imported)
 * You do not need to make changes to this for the starter project (but you can!)
 */
export class Utils {

    /**
     * @returns an 8-4-4-4-12 character alphanumeric string
     */
    public static GenerateGuid() {

        /**
         * @returns a 4-character alphanumeric string
        */
        const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    public static getStoreType(type: StoreType | null): String {
        switch (type) {
            case null:
                return "Folder";
                
            case StoreType.Video:
                return "Video";
            
            case StoreType.Text:
                return "Text";

            case StoreType.Image:
                return "Image";

            case StoreType.Website:
                return "Website";
        }
             

    }

}
