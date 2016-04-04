
module.exports = ObjWriter;

var fs = require('fs');

function ObjWriter()
{

    this.write = function(toPath, mesh)
    {
        var wstream = fs.createWriteStream(toPath);

        for (var t= 0,l=mesh.vertices.length; t<l; t++)
        {
            var v = mesh.vertices[t];
            console.log(v);
            var out = "v "+ v.x+" "+ v.y+" "+ v.z;
            if (t < 5)
                console.log(out);
        }

        wstream.end();
    }

}