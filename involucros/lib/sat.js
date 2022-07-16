function sat(obj1, obj2) {
    let axes1 = obj1.axes();
    let vert1 = obj1.vertices();

    let axes2 = obj2.axes();
    let vert2 = obj2.vertices();

    for (let i = 0; i < axes1.length; i++) {
        let axe = axes1[i];
        if (!axe.projectionCollides(vert1, vert2)) {
            return false;
        }
    }

    for (let i = 0; i < axes2.length; i++) {
        let axe = axes2[i];
        if (!axe.projectionCollides(vert1, vert2)) {
            return false;
        }
    }

    return true;
}