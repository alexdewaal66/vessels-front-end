import { entitiesMetadata } from '../helpers/entitiesMetadata';

class EntityItem {
    constructor(metadata, item) {
        this.metadata = metadata;
        this.item = item;
    }
    get id() {
        return Object.fromEntries( this.metadata.id.map( propName => [propName, this.item[propName]] ) );
    }

}

