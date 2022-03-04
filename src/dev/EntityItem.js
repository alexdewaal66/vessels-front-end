import { entityTypes } from '../helpers';

class EntityItem {
    constructor(entityType, item) {
        this.entityType = entityType;
        this.item = item;
    }
    get id() {
        return Object.fromEntries( this.entityType.id.map( propName => [propName, this.item[propName]] ) );
    }

}

