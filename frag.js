
var parseObj = require('parse-obj');
var Mesh3d = require('./geo/Mesh3d');
var QuadTree = require('./spatial/QuadTree.js');
var LeafCollector = require('./spatial/LeafCollector.js');
var ObjWriter = require('./io/ObjWriter.js');

var fs = require('fs');

var MAX_POLYGONS = 2500;

var testFile = "./testdata/quarry_30k.obj";

blast_off(testFile);

var numPolys = 0;
var totalPolysDone = 0;

function blast_off(file)
{
    console.log("");
    process.stdout.write("Loading '"+file+"'...");

    readfile(file, function(data){
        fragment(data, MAX_POLYGONS);
    });
}


function fragment(data, maxpolygons)
{
    var mesh = new Mesh3d();
    mesh.parse(data);

    numpolys = mesh.polygons.length;

    console.log("OK ("+Math.round(numpolys/1000)+"K polygons)");

    if (numpolys <= MAX_POLYGONS)
    {
        console.log("Nothing to do! MAX_POLYGONS = " + MAX_POLYGONS);
        process.exit(0);
    }

    console.log("\nSubdividing LIDAR terrain using method `Quadtree`:");

    var quadtree = new QuadTree(maxpolygons, qt_progress);

    var pointers = [];
    for (var t=0; t<mesh.polygons.length; t++)
    {
        pointers.push(t);
    }

    quadtree.build(mesh.polygons, pointers);

    var leafCollector = new LeafCollector();

    quadtree.walkToAll(leafCollector);

    console.log("\r\nWaw!");
    console.log("\r\nExtracting and reindexing vertices for "+leafCollector.leaves.length+" meshes...");

    var meshes = [];

    for (var t=0; t<leafCollector.leaves.length; t++)
    {
        var pc = Math.round((t / (leafCollector.leaves.length-1)) * 100);
        showProgressBar(pc);

        meshes.push({
            vertices: createVertexIndex(mesh, leafCollector.leaves[t]),
            faces: leafCollector.leaves[t]
        });
    }

    console.log("\r\nBoom.\r\n\r\nFlushing hierarchy to disk...");

    var objWriter = new ObjWriter();

    for (var t=0; t<meshes.length; t++)
    {
        objWriter.write(__dirname+"/testout/"+t+".obj", meshes[t]);
    }



}





function createVertexIndex(mesh, tris)
{
    var vertices = [];
    var newVerts = [];

    var vi = 0;

    for (var v= 0,l=mesh.vertices.length; v<l; v++)
        vertices[v] = {};


    for (var t=0; t<tris.length; t++)
    {
        var f = tris[t].vertexIndicies;
        vertices[f[0]].used = true;
        vertices[f[1]].used = true;
        vertices[f[2]].used = true;
    }

    var nvi=0;

    for (var v= 0, l=mesh.vertices.length; v<l;v++)
    {
        var vtx = vertices[v];
        if (vtx.used) {
            var ov = mesh.vertices[v];
            newVerts[nvi] = [ov[0], ov[1], ov[2]];
            vtx.newIndex = nvi;
            nvi++;
        }
    }

    for (var t=0; t<tris.length; t++)
    {
        var f = tris[t];
        f.vertexIndicies[0] = vertices[f.vertexIndicies[0]].newIndex;
        f.vertexIndicies[1] = vertices[f.vertexIndicies[1]].newIndex;
        f.vertexIndicies[2] = vertices[f.vertexIndicies[2]].newIndex;
    }

    return newVerts;

}


function showProgressBar(pc)
{
    var scale = Math.round(20*(pc / 100));

    process.stdout.write("\r[");
    var p="";
    for (var t=0; t<20; t++)
    {
        if (t <=scale)
        //p+="-";
            p+="\u2764 ";
        else p+="--";
    }

    process.stdout.write(p+"] "+pc+"%");
}

function qt_progress(numPolysDone)
{
    totalPolysDone += numPolysDone;
    var pc = Math.round((totalPolysDone / numpolys) * 100);
    //console.log(pc+"% done");
    showProgressBar(pc);

}

function readfile(file, cb) {

    parseObj(fs.createReadStream(file), function (err, result) {
        cb(result);
    });

}


