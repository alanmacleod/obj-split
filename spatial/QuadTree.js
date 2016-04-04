/**
 * Created by alan on 28/03/2016.
 */
//

module.exports = QuadTree;

/**
 *
 * Alan MacLeod - RSK Orbital Ltd.
 * Quadtree implementation
 *
 **/


function QuadTree(maxObjects, progressCallback)
{
    this.MAX_OBJECTS = maxObjects;
    this.bounds = null;
    this.level = 0;

    this.children = [];
    this.objects = []; // empty everywhere apart from the leaf nodes
    this.leaf = false;
    this.progressCallback = progressCallback;

    this.build = function(polygons, pointers)
    {

        if (pointers.length == 0)
        {
            this.leaf = true;
            return;
        }

        // Saturation point reached, subdivide the bounds
        if (pointers.length > this.MAX_OBJECTS)
        {
            if (this.bounds == null)  // bootstrap
                this.bounds = this._calcBounds(polygons, pointers);

            this.subdivide();

            //iterate through child nodes

            for (var c = 0; c < this.children.length; c++)
            {
                var childPointers = [];

                // Assign polygons to the children
                var bound = this.children[c].bounds;

                for (var t = 0, l = pointers.length; t < l; t++)
                {
                    if (polygons[pointers[t]].isWithinBounds(bound))
                        childPointers.push(pointers[t]);
                }

                this.children[c].build(polygons, childPointers);
            }
        } else {
            // add the polygons to our leaf objects

            for (var t=0; t<pointers.length; t++)
                this.objects.push(polygons[pointers[t]]);

            this.leaf = true;

            if (this.progressCallback)
                this.progressCallback(this.objects.length);

        }

    };

    this.walkToAll = function(leafCollector)
    {
        if (this.leaf)
        {
            leafCollector.addLeaf(this);
        }

        if (this.children.length == 0)
            return;

        for (var t=0; t<this.children.length; t++)
        {
            this.children[t].walkToAll(leafCollector);
        }
    };

    this.subdivide = function()
    {
        for (var t=0; t<4; t++)
        {
            this.children[t] = new QuadTree(this.MAX_OBJECTS, this.progressCallback);
            this.children[t].bounds = this.getChildBounds(t);
            this.children[t].level = this.level + 1;

        }
    };

    this.getChildBounds = function(childIndex)
    {
        // go figure this out ;)

        //var xpos = (((childIndex & 2) >> 1) * 2) -1;
        //var ypos = ((childIndex & 1) * 2) -1;

        var minx=0, maxx=0, miny=0, maxy=0 ;

        switch (childIndex)
        {
            case 0: // lower left
                minx = this.bounds.min_x;
                miny = this.bounds.min_y;
                maxx = this.bounds.centre_x;
                maxy = this.bounds.centre_y;
                break;
            case 1: // lower right
                minx = this.bounds.centre_x;
                miny = this.bounds.min_y;
                maxx = this.bounds.max_x;
                maxy = this.bounds.centre_y;
                break;
            case 2: // upper left
                minx = this.bounds.min_x;
                miny = this.bounds.centre_y;
                maxx = this.bounds.centre_x;
                maxy = this.bounds.max_y;
                break;
            case 3: //upper right
                minx = this.bounds.centre_x;
                miny = this.bounds.centre_y;
                maxx = this.bounds.max_x;
                maxy = this.bounds.max_y;
                break;
        }

        return {
            min_x: minx,
            min_y: miny,

            max_x: maxx,
            max_y: maxy,

            centre_x: (maxx + minx) / 2,
            centre_y: (maxy + miny) / 2,

            x_range: (maxx - minx) + 1,
            y_range: (maxy - miny) + 1
        }

    };

    this._calcBounds = function(polygons, pointers)
    {
        var minx, miny, minz, maxx, maxy, maxz;
        maxx = maxy = maxz = Number.MAX_VALUE * -1;
        minx = miny = minz = Number.MAX_VALUE;

        for (var t=0; t<pointers.length; t++)
        {
            var b = polygons[pointers[t]].getBounds();

            if (b.min_x < minx) minx = b.min_x; if (b.max_x > maxx) maxx = b.max_x;
            if (b.min_y < miny) miny = b.min_y; if (b.max_y > maxy) maxy = b.max_y;
            //if (b.min_z < minz) minz = b.min_z; if (b.max_z > maxz) maxz = b.max_z;

        }

        return {
            min_x: minx,
            min_y: miny,
            //min_z: minz,

            max_x: maxx,
            max_y: maxy,
            //max_z: maxz,

            centre_x: (maxx + minx) / 2,
            centre_y: (maxy + miny) / 2,
            //centre_z: (maxz + minz) / 2,

            x_range: (maxx - minx)+1,
            y_range: (maxy - miny)+1
            //z_range: (maxz - minz)+1
        };

    }


}



