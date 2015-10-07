//////////////////////////////////////////////////////////////////////////
//
//  This code is for instructional purposes only. It was generated for
//  use in a college course to show certain aspects of data
//  storage algorithms. It has problems and should not be used
//  outside the class environment.
//
//  Author:  Thomas D. Citriniti     citrit@rpi.edu
//  Class:   Computer Graphics
//           Rensselaer Polytechnic Institute
//  Date:    Sept 2015
//
//////////////////////////////////////////////////////////////////////////

var WGLRen = WGLRen || {};

/**
  * Abstract Cell class which defines the API for all drawable
  * entities to follow
  */
WGLRen.Geom = function(typ, colr)
{

    var topology = typ;
    var color = colr.concat([1.0]);

    // add
    var indices = [];
    var vertexBuffer = gl.createBuffer();
    var indexBuffer = gl.createBuffer();

     this.addIndices = function(idx) {
        indices = indices.concat(idx);
    }

    this.drawElem = function(cc){
        gl.uniform4fv(program.pColorUniform, color);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cc), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        gl.vertexAttribPointer(program.vPosition, 3, gl.FLOAT, false, 0, 0);
        gl.drawElements( topology, indices.length, gl.UNSIGNED_SHORT, 0);
    }
}
