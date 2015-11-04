// from require to global var
var OSG = window.OSG;
OSG.globalify();

var osg = window.osg;
var osgViewer = window.osgViewer;
var osgGA = window.osgGA;
var viewer;
var root;

var main = function () {
    // The 3D canvas.
    var canvas = document.getElementById( '3DView' );

    //try {
        viewer = new osgViewer.Viewer( canvas, {
            antialias: true,
            //alpha: true
        } );
        viewer.init();
        mvMatrix = new osg.MatrixTransform();
        mvMatrix.addChild( createScene() );
        viewer.setSceneData( mvMatrix );


        viewer.setupManipulator();
        // set distance
        viewer.getManipulator().setDistance( 5.0 );

        viewer.run();

        var mousedown = function ( ev ) {
            ev.stopPropagation();
        };

    $('')
    //} catch ( er ) {
    //    osg.log( 'exception in osgViewer ' + er );
    //    alert( 'exception in osgViewer ' + er );
    //}
};

// create a cube in center of the scene(0, 0, 0) and set it's size to 1
var size = 1;


function createScene() {
    /* Lets create a robot
    // Robot:
        // Head
        // chest
            // right shoulder
                // right Elbow
                // right Wrist
            // Left Shoulder
                // left Elbow
                // Left Wrist
        // Waist
            // Right Leg
            // Left Leg

    */
    var robot, chest, head, waist;

    root = new osg.Node();
    root.setName('world');

    // Base world transform
    robot = new osg.MatrixTransform();
    robot.setName('lamont');
    root.addChild(robot);

        // Head
        var nde = createSegment(null, [ 0.8, 0.8, 0.0, 0.8 ], [1,1,1],[0,2,0]);
        nde.setName('head');
        // add to parent
        robot.addChild( nde );

        //Chest
        chest = createSegment(null, [ 0.8, 0.0, 0.0, 0.8 ], [2,2.5,1],[0,1,0]);
        chest.setName('chest');
        // add to parent
        robot.addChild( chest );

            chest.addChild(createArm('left', 1.25, [ 0.0, 0.8, 0.8, 0.8 ]));
            chest.addChild(createArm('right', -1.25, [ 0.0, 0.8, 0.8, 0.8 ]));

        //Waist
        waist = createSegment(null, [ 0.0, 0.0, 0.8, 0.8 ], [2,1,1],[0,-1.5,0]);
        waist.setName('waist');
        // add to parent
        robot.addChild( waist );
            waist.addChild(createLeg('left', 0.7, [ 0.0, 0.8, 0.8, 0.8 ]));
            waist.addChild(createLeg('right', -0.7, [ 0.0, 0.8, 0.8, 0.8 ]));


    return root;
}

function createSegment(geom, color, size, pos) {
    var seg = new osg.MatrixTransform();
    var cubeModel = osg.createTexturedBoxGeometry( 0, -size[1]/2.0, 0, size[0], size[1], size[2] );
    seg.addChild( cubeModel );
    // Set position and scale
    //seg.setMatrix( osg.Matrix.setScale( size[0], size[1], size[2], osg.Matrix.create() ) );
    seg.setMatrix( osg.Matrix.setTrans( seg.getMatrix(), pos[0], pos[1], pos[2] ) );


    seg.getOrCreateStateSet().setRenderingHint( 'TRANSPARENT_BIN' );
    seg.getOrCreateStateSet().setAttributeAndModes( new osg.BlendFunc( 'SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA' ) );
    seg.getOrCreateStateSet().setAttributeAndModes( new osg.CullFace( 'DISABLE' ) );

    // add a stateSet of texture to cube
    var material = new osg.Material();
    material.setDiffuse( color );
    material.setAmbient( color );
    material.setSpecular( [ 1.0, 1.0, 0.0, 0.0 ] );
    material.setEmission( [ 0.0, 0.0, 0.0, 0.5 ] );
    seg.getOrCreateStateSet().setAttributeAndMode( material );
    return seg;
}

function createArm(side, pos, col) {
    var shoulder = createSegment(null, col, [0.5,1.5,0.5],[pos,0,0]);
    shoulder.setName(side + 'shoulder');

    var elbow = createSegment(null, col, [.4,1,.4],[0,-1.5,0]);
    elbow.setName(side + 'elbow');
    shoulder.addChild(elbow);

    var wrist = createSegment(null, col, [0.3,0.3,0.3],[0,-1,0]);
    wrist.setName(side + 'wrist');
    elbow.addChild(wrist);
    return shoulder;
}

function createLeg(side, pos, col) {
    var hip = createSegment(null, col, [0.5,1.5,0.5],[pos,-0.5,0]);
    hip.setName(side + 'hip');

    var knee = createSegment(null, col, [.4,1,.4],[0,-1.5,0]);
    knee.setName(side + 'knee');
    hip.addChild(knee);

    var ankle = createSegment(null, col, [0.3,0.3,0.3],[0,-1,0]);
    ankle.setName(side + 'ankle');
    knee.addChild(ankle);
    return hip;
}

var rotx = 1, roty = 1, rotz = 1;
function handleScroll(slider) {
    var part = $('#bodypart').find(':selected').val();
    rotx = $('input[name="rotX"]').get(0).valueAsNumber - rotx;
    roty = $('input[name="rotY"]').get(0).valueAsNumber - roty;
    rotz = $('input[name="rotZ"]').get(0).valueAsNumber - rotz;

    // Find the node
    var finder = new FindByNameVisitor( part );
    root.accept( finder );

    if (finder.found !== undefined) {
        elem = finder.found;
        var accumMat = elem.getMatrix();
        switch (slider.name) {
            case 'rotX':
                osg.Matrix.preMult(accumMat, osg.Matrix.makeRotate(degToRad(1), 1, 0, 0, osg.Matrix.create() ));
                break;
            case 'rotY':
                osg.Matrix.preMult(accumMat, osg.Matrix.makeRotate(degToRad(1), 0, 1, 0, osg.Matrix.create() ));
                break;
            case 'rotZ':
                osg.Matrix.preMult(accumMat, osg.Matrix.makeRotate(degToRad(1), 0, 0, 1, osg.Matrix.create() ));
                break;
        }
        elem.setMatrix(accumMat);
    }

}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

// Here we create a new form of
// Scene Graph Visitor
var FindByNameVisitor = function ( name ) {
    osg.NodeVisitor.call( this, osg.NodeVisitor.TRAVERSE_ALL_CHILDREN );
    this._name = name;
};

FindByNameVisitor.prototype = osg.objectInherit( osg.NodeVisitor.prototype, {
    // in found we'll store our resulting matching node
    init: function () {
        this.found = undefined;
    },
    // the crux of it
    apply: function ( node ) {
        if ( node.getName() == this._name ) {
            this.found = node;
            return;
        }
        this.traverse( node );
    }
} );


window.addEventListener( 'load', main, true );
