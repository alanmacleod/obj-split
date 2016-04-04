/**
 * Created by alan on 28/03/2016.
 */

module.exports = Vector3;

function Vector3(xx, yy, zz)
{

    this.x = xx || 0;
    this.y = yy || 0;
    this.z = zz || 0;

    // special ignore-z quadtree case
    this.isWithinBounds2d = function(bounds)
    {
        if (this.x < bounds.min_x) return false;
        if (this.x > bounds.max_x) return false;
        if (this.y < bounds.min_y) return false;
        if (this.y > bounds.max_y) return false;

        return true;
    };

    this.isWithinBounds = function(bounds)
    {
        if (this.x < bounds.min_x) return false;
        if (this.x > bounds.max_x) return false;
        if (this.y < bounds.min_y) return false;
        if (this.y > bounds.max_y) return false;
        if (this.z < bounds.min_z) return false;
        if (this.z > bounds.max_z) return false;

        return true;
    };

}
