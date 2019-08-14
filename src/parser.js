function recurseArray(typed) {
    //Get the unique keys in the array. We only care about the top level  - recursion will take care of the rest
    let uniqueKeys = new Set();
    typed.forEach(t => {
        if (typeof t === "object") {
            Object.keys(t).forEach(key => uniqueKeys.add(key))
        }
    });

    // Get an array of all the types within each key
    let keyTypes = Object.fromEntries(
        Array.from(uniqueKeys).map(u => {
            return [u, typed.map(t => t[u])];
        })
    );

    return Object.fromEntries(Object.entries(keyTypes).map(([key, types]) => {
        const firstType = types[0] === null ? null : typeof types[0];
        //i===firstType is special case for nulls
        if (!types.every(i => typeof i === firstType || i === firstType)) {
            //If the key has multiple types, return the list of types
            //TODO: do some analysis/*something* with this data
            return [key, types];
        } else if (firstType !== "object") {
            //If the array of types is all the same, make it a single value instead
            return [key, firstType];
        } else {
            //If the types are objects, recurse to simplify them as well
            return [key, recurseArray(types)]
        }
    }))
}

function recurseProperties(o) {

    if (o === null || o === undefined) {
        return o;
    } else if (Array.isArray(o)) {
        //This is like an n + n^2 + n^2 algorithim and I don't like it, but I'm not sure what the non-naive way of doing it is 
        //Essentially a find/replace of values with types
        let typed = o.map(i =>
            recurseProperties(i)
        );
        return recurseArray(typed);
    } else if (typeof o === "object") {
        const temp = Object.entries(o).map(([k, v]) => [k, recurseProperties(v)]);
        return Object.fromEntries(temp)
    } else {
        return typeof o;
    }

}

function parseTextString(str) {
    let obj = JSON.parse(str);

    if (obj.length === undefined) {
        //If we have a single object, convert it to an array of itself
        obj = [obj]

    }
    let result = recurseProperties(obj)
    return result
}

export default parseTextString