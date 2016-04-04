/**
 * Created by alan on 28/03/2016.
 */

var Vector3 = require("./Vector3");
var Polygon = require("./Polygon");

module.exports = Mesh3d;
/**
 *
 * Special respresentation of a 3d .OBJ model/mesh to be used by the quadtree to partition it into parts
 * down to a specified polygon maximum
 *
 **/


function Mesh3d(test)
{
    this.vertices = [];
    this.polygons = [];
    /**
     *
     vertexPositions an array of vertex position data
     vertexNormals an array of vertex normal data
     vertexUVs an array of vertex UV coordinates
     facePositions an array of indices for face positions
     faceNormals an array of indices for face normals
     faceUVs an array of indices for face texture coordinates
     *
     */
    this.parse = function(data)
    {
        // Load vertex data
        for (var t= 0,l=data.vertexPositions.length; t<l; t++)
        {
            var v = data.vertexPositions[t];
            this.vertices.push(new Vector3(v[0], v[1], v[2]));
        }

        // Load polygons

        // also set the vertex references so each Polygon can see where its' position is in 3d space
        // (clumsy, but this is necessary for the quadtree calculations, derp)

        var vl = this.vertices;
        for (var t= 0, l=data.facePositions.length; t<l; t++)
        {
            var f = data.facePositions[t];
            var p = new Polygon(t, vl[f[0]], vl[f[1]], vl[f[2]], f[0], f[1], f[2]);
            this.polygons.push(p);


        }



    };


}