
var gl;
var program;
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

window.onload = function init()
{

    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Associate out shader variables with our data buffer

    program.vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( program.vPosition );
    program.pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
    program.mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");
    program.pColorUniform = gl.getUniformLocation(program, "uColor");


    init_draw();
    // read through example data and draw
    read_draw_data(exampleData);
};

function setUniforms() {
    gl.uniformMatrix4fv(program.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(program.mvMatrixUniform, false, mvMatrix);

}

function init_draw(){
    gl.clear( gl.COLOR_BUFFER_BIT );

    mat4.identity(mvMatrix);
    mat4.scale(mvMatrix, mvMatrix, [0.5, 0.5, 1.0]);
    mat4.translate(mvMatrix, mvMatrix, [-2.5, -2.5, 0.0]);

    setUniforms();
}

function read_draw_data(data) {
    var cc = [];
    for (var ii = 0;ii < data.length; ii++) {
        val = data[ii];
        switch(val[0]) {
            case 0: // coords
                console.log(' Read coords [' + val[1] + ']: RGB(' + val[2] + ',' + val[3] + ',' + val[4] + ')');
                ii++;
                cc = data[ii];
                console.log(data[ii]);
                break;
            case 1: // Point topology
                console.log(' Read Point Topology [' + val[1] + ']: RGB(' + val[2] + ',' + val[3] + ',' + val[4] + ')');
                var pGeom = new WGLRen.Geom(gl.POINTS, [val[2], val[3], val[4]]);
                ii++;
                console.log(data[ii]);
                pGeom.addIndices(data[ii]);
                pGeom.drawElem(cc);
                break;
            case 2: // Lines topology
                console.log(' Read Line Topology [' + val[1] + ']: RGB(' + val[2] + ',' + val[3] + ',' + val[4] + ')');
                var pGeom = new WGLRen.Geom(gl.LINES, [val[2], val[3], val[4]]);
                ii++;
                console.log(data[ii]);
                pGeom.addIndices(data[ii]);
                pGeom.drawElem(cc);
                break;
            case 3: // Polygons topology
                console.log(' Read Polygon Topology [' + val[1] + ']: RGB(' + val[2] + ',' + val[3] + ',' + val[4] + ')');
                ii++;
                console.log(data[ii]);
                var kk = 0;
                for (var jj=0;jj<val[1];jj++) {
                    var pGeom = new WGLRen.Geom(gl.LINE_LOOP, [val[2], val[3], val[4]]);
                    var idx = data[ii][kk];
                    var indices = [];
                    do {
                        indices = indices.concat([idx]);
                        kk++;
                        idx = data[ii][kk];
                    } while (idx != -1 && kk < data[ii].length);
                    pGeom.addIndices(indices);
                    pGeom.drawElem(cc);
                    kk++;
                }
                break;
            case 4: // Triangles topology
                console.log(' Read Triangle Topology [' + val[1] + ']: RGB(' + val[2] + ',' + val[3] + ',' + val[4] + ')');
                var pGeom = new WGLRen.Geom(gl.TRIANGLES, [val[2], val[3], val[4]]);
                ii++;
                console.log(data[ii]);
                pGeom.addIndices(data[ii]);
                pGeom.drawElem(cc);
                break;
            case 5: // PolyLines  topology
                console.log(' Read Polygon Topology [' + val[1] + ']: RGB(' + val[2] + ',' + val[3] + ',' + val[4] + ')');
                ii++;
                console.log(data[ii]);
               var kk = 0;
                for (var jj=0;jj<val[1];jj++) {
                    var pGeom = new WGLRen.Geom(gl.LINE_STRIP, [val[2], val[3], val[4]]);
                    var idx = data[ii][kk];
                    var indices = [];
                    do {
                        indices = indices.concat([idx]);
                        kk++;
                        idx = data[ii][kk];
                    } while (idx != -1 && kk < data[ii].length);
                    pGeom.addIndices(indices);
                    pGeom.drawElem(cc);
                    kk++;
                }
                break;
        }
    }
}
