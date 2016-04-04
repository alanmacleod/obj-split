/**
 * Created by alan on 28/03/2016.
 */

module.exports = Polygon;

function Polygon(id, v0, v1, v2, vi0, vi1, vi2)
{
    this.vertices = null;
    this.vertexIndicies = null;
    this.id = id;

//    if (p0 !==null && p1!==null && p2!==null)
//        this.indices = [p0, p1, p2];

    if (v0 !==null && v1!==null && v2!==null) // must be null-test otherwise index '0' fails duh :
        this.vertices = [v0, v1, v2];

    this.vertexIndicies = [vi0, vi1, vi2];

    // Tells the quadtree if this polygon is (mostly) in one area or not
    // TODO: This is a shit test, only tests the vertices. Really, it should test the quantity -
    // TODO: - of overlapping areas
    this.isWithinBounds = function(bounds)
    {
        var ok_count = 0;

        for (var t=0; t<this.vertices.length; t++)
            if (this.vertices[t].isWithinBounds2d(bounds)) ok_count++;

        var res = (ok_count >= 2);

        return res;
    };

    this.getBounds = function()
    {
        var maxx, maxy, maxz, minx, miny, minz;
        maxx = maxy = maxz = Number.MAX_VALUE * -1;
        minx = miny = minz = Number.MAX_VALUE;

        for (var t=0; t<3; t++)
        {
            var x = this.vertices[t].x;
            var y = this.vertices[t].y;
            var z = this.vertices[t].z;

            if (x > maxx) maxx = x; if (x < minx) minx = x;
            if (y > maxy) maxy = y; if (y < miny) miny = y;
            if (z > maxz) maxz = z; if (z < minz) minz = z;
        }

        return {
            max_x: maxx,
            max_y: maxy,
            max_z: maxz,

            min_x: minx,
            min_y: miny,
            min_z: minz
        }

    }

}
