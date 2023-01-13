class Helper {
    static deepCopy = function (object) {
        return JSON.parse(JSON.stringify(object));
    };

    static areArraysEqual(array1, array2) {
        if (!(array1 instanceof Array) || !(array2 instanceof Array) || array1.length !== array2.length) {
            return false;
        }

        for(let x = 0; x < array1.length; x++) {
            if ((array1[x] instanceof Array) && (array2[x] instanceof Array)) {
                const IS_EQUAL = Helper.areArraysEqual(array1[x], array2[x]);

                if(!IS_EQUAL) {
                    return false;
                }
            } else if ((typeof array1[x].equals !== 'function') || !array1[x].equals(array2[x])) {
                return false;
            }
        }

        return true;
    }

    static preventDefaultAndStopImmediatePropagation(e) {
        if(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    }
}
