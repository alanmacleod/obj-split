/**
 * Created by alan on 04/04/2016.
 */

module.exports = LeafCollector;

function LeafCollector()
{
    this.leaves = [];

    this.addLeaf = function(leaf)
    {
        if (leaf.objects.length == 0)
            return;

        var leafObjects = [];

        for (var t=0; t<leaf.objects.length; t++)
        {
            leafObjects.push(leaf.objects[t]);
        }

        this.leaves.push(leafObjects);
    }
}
