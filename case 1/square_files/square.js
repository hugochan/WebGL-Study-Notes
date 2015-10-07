
var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    // Four Vertices
    // Y
    var vertices2 = [
        vec2( 0.0, 0.1 ),
        vec2(  0.13, 0.18 ),
        vec2(  0.175, -0.175 ),
        vec2( 0.25, 0.05),
        vec2( 0.325, -0.175 ),
        vec2(  0.37, 0.18 ),
        vec2(  0.5, 0.1 ),
        vec2( 0.175, -0.175),
        vec2( 0.325, -0.175),
        vec2( 0.175, -0.25 ),
        vec2(  0.325, -0.25 )
    ];
    
    // C
    var vertices = [
        vec2( 0.5, 0.25 ),
        vec2( 0.25, 0.5 ),
        vec2( 0.0,  0.25 ),
        vec2( -0.25, 0.5),
        vec2( -0.25, 0.1 ),
        vec2(  -0.5,  0.25 ),
        vec2(  -0.25, -0.1 ),
        vec2( -0.5, -0.25),
        vec2(  0.0, -0.25 ),
        vec2(  -0.25, -0.5 ),
        vec2(  0.5, -0.25 ),
        vec2(  0.25, -0.5 )
    ];

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices2), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 11 );


};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 12 );
}
