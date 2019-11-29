module.exports.findChildIdRecursive = function(parentId, array) {
    for(let i = 0; i < array.length; ++i) {
        if(array.items[i]._id === parentId) {
            return array.items[i].items;
        } else {
            if(array.items[i].items.length > 0) {
                const result = findChildIdRecursive(parentId, array.items[i].items);
                if(result !== null) {
                    return result;
                }    
            }
        }
    }
    return null;
}
