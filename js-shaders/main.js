function start() {

    // Get canvas, WebGL context, twgl.m4
    var canvas = document.getElementById("mycanvas");
    var gl = canvas.getContext("webgl");

    // Sliders at center
    var slider1 = document.getElementById('slider1');
    slider1.value = -20;
    var slider2 = document.getElementById('slider2');
    var slider3 = document.getElementById('slider3');
    slider2.value = -20;

    function complexVersion() {
        var select = document.getElementById("modelSelect");
    
        // for this demo, set obj_model to reference the model name defined 
        // in the other included script
        var obj_model;
        switch (select.value) {
            case 'sofa': obj_model = sofaModel; break;
            case 'potGold': obj_model = potGoldModel; break;
            case 'basketballHoop': obj_model = basketballHoopModel; break;
            case 'nationalParkRanger': obj_model = nationalParkRangerModel; break;
            case 'shamrock': obj_model = shamrockModel; break;
        }
    
        // initialize a variable that contains the proper gl enum for the 
        // size of our triangle index elements
        var triangleIndexSize = gl.UNSIGNED_INT;
        switch (obj_model.triangleIndices.BYTES_PER_ELEMENT) {
        case 1:
            triangleIndexSize = gl.UNSIGNED_BYTE;
            break;
        case 2:
            triangleIndexSize = gl.UNSIGNED_SHORT;
            break;
        case 4:
            // for uint32, we have to enable the extension that allows uint32 as triangle indices
            gl.getExtension('OES_element_index_uint');
            triangleIndexSize = gl.UNSIGNED_INT;
            break;
        default:
            throw new Error('unknown triangle index element size');
        }
    
   
        // Read shader source
        var vertexSource = document.getElementById("vertexShader").text;
        var fragmentSource = document.getElementById("fragmentShader").text;
    
        // Compile vertex shader
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(vertexShader)); return null;
        }
    
        // Compile fragment shader
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(fragmentShader)); return null;
        }
    
        // Attach the shaders and link
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialize shaders");
        }
        gl.useProgram(shaderProgram);
    
        // with the vertex shader, we need to pass it positions
        // as an attribute - so set up that communication
        shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
        gl.enableVertexAttribArray(shaderProgram.PositionAttribute);
    
        shaderProgram.NormalAttribute = gl.getAttribLocation(shaderProgram, "vNormal");
        gl.enableVertexAttribArray(shaderProgram.NormalAttribute);
    
        // this gives us access to the matrix uniform
        shaderProgram.MVmatrix = gl.getUniformLocation(shaderProgram, "uMV");
        shaderProgram.MVNormalmatrix = gl.getUniformLocation(shaderProgram, "uMVn");
        shaderProgram.MVPmatrix = gl.getUniformLocation(shaderProgram, "uMVP");
        shaderProgram.time = gl.getUniformLocation(shaderProgram, "time");

        // we need to put the vertices into a buffer so we can
        // block transfer them to the graphics hardware
        var trianglePosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, obj_model.vertexPos, gl.STATIC_DRAW);
        trianglePosBuffer.itemSize = 3;
        trianglePosBuffer.numItems = obj_model.vertexPos.length;
    
        // a buffer for normals
        var triangleNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, obj_model.vertexNormals, gl.STATIC_DRAW);
        triangleNormalBuffer.itemSize = 3;
        triangleNormalBuffer.numItems = obj_model.vertexNormals.length;
    
        // a buffer for indices
        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, obj_model.triangleIndices, gl.STATIC_DRAW);
    
        // Scene (re-)draw routine
        function draw() {
    
            // Translate slider values to angles in the [-pi,pi] interval
            var angle1 = slider1.value * 0.01 * Math.PI;
            var angle2 = slider2.value * 0.01 * Math.PI;
        
            // Circle around the y-axis
            var eye = [400 * Math.sin(angle1+performance.now()/1000), 150.0, 400.0 * Math.cos(angle1+performance.now()/1000)];
            var target = [0, 0, 0];
            var up = [0, 1, 0];
        
            // set up model transform
            // somewhat arbitrarily, let's make the model 200 units tall/wide/high
            // with its center at the origin of the wcs
            w = obj_model.bboxMax[0] - obj_model.bboxMin[0]
            h = obj_model.bboxMax[1] - obj_model.bboxMin[1]
            d = obj_model.bboxMax[2] - obj_model.bboxMin[2]
            s = slider3.value / Math.max(w, h, d);
            // make our coord system bigger/smaller
            var tModel = mat4.create();
            mat4.fromScaling(tModel, [s, s, s])
            // rotate our coord system according to slider2
            mat4.rotate(tModel, tModel, angle2, [w, h, d]);
            // translate coord system so model center is at wcs origin
            offset = [
                -(obj_model.bboxMax[0] + obj_model.bboxMin[0]) / 2,
                -(obj_model.bboxMax[1] + obj_model.bboxMin[1]) / 2,
                -(obj_model.bboxMax[2] + obj_model.bboxMin[2]) / 2];
            mat4.translate(tModel, tModel, offset);
        
            // set up camera transform
            var tCamera = mat4.create();
            mat4.lookAt(tCamera, eye, target, up);
        
            // set up projection transform
            var tProjection = mat4.create();
            mat4.perspective(tProjection, Math.PI / 4, 1, 10, 1000);
        
            var tMV = mat4.create();
            var tMVn = mat3.create();
            var tMVP = mat4.create();
            mat4.multiply(tMV, tCamera, tModel); // "modelView" matrix
            mat3.normalFromMat4(tMVn, tMV);
            mat4.multiply(tMVP, tProjection, tMV);
        
            // Clear screen, prepare for rendering
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
            // Set up uniforms & attributes
            gl.uniformMatrix4fv(shaderProgram.MVmatrix, false, tMV);
            gl.uniformMatrix3fv(shaderProgram.MVNormalmatrix, false, tMVn);
            gl.uniformMatrix4fv(shaderProgram.MVPmatrix, false, tMVP);
            gl.uniform1f(shaderProgram.time, performance.now() / 1000);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
            gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer.itemSize,
                gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer);
            gl.vertexAttribPointer(shaderProgram.NormalAttribute, triangleNormalBuffer.itemSize,
                gl.FLOAT, false, 0, 0);
        
            // Do the drawing
            gl.drawElements(gl.TRIANGLES, obj_model.triangleIndices.length, triangleIndexSize, 0);  
            requestAnimationFrame(draw);
        }
        
        draw();
    }

    function simpleVersion() {
        // Read shader source
        var vertexSource = document.getElementById("vertexShaderSimple").text;
        var fragmentSource = document.getElementById("fragmentShaderSimple").text;

        // Compile vertex shader
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader,vertexSource);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(vertexShader)); return null; }
        
        // Compile fragment shader
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader,fragmentSource);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(fragmentShader)); return null; }
        
        // Attach the shaders and link
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialize shaders"); }
        gl.useProgram(shaderProgram);	    
        
        // with the vertex shader, we need to pass it positions
        // as an attribute - so set up that communication
        shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
        gl.enableVertexAttribArray(shaderProgram.PositionAttribute);
        
        shaderProgram.ColorAttribute = gl.getAttribLocation(shaderProgram, "vColor");
        gl.enableVertexAttribArray(shaderProgram.ColorAttribute);    
        
        // this gives us access to the matrix uniform
        shaderProgram.MVPmatrix = gl.getUniformLocation(shaderProgram,"uMVP");
        shaderProgram.time = gl.getUniformLocation(shaderProgram, "time");

        // Data ...
        
        // vertex positions
        var vertexPos = new Float32Array(
            [  1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1,
            1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1,
            1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1,
            -1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,
            -1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,
            1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1 ]);

        // vertex colors
        var vertexColors = new Float32Array(
            [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
            1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
            0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
            1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,
            1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,
            0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1 ]);
        
        // element index array
        var triangleIndices = new Uint8Array(
            [  0, 1, 2,   0, 2, 3,    // front
            4, 5, 6,   4, 6, 7,    // right
            8, 9,10,   8,10,11,    // top
            12,13,14,  12,14,15,    // left
            16,17,18,  16,18,19,    // bottom
        20,21,22,  20,22,23 ]); // back

        // we need to put the vertices into a buffer so we can
        // block transfer them to the graphics hardware
        var trianglePosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexPos, gl.STATIC_DRAW);
        trianglePosBuffer.itemSize = 3;
        trianglePosBuffer.numItems = 24;
        
        // a buffer for colors
        var colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW);
        colorBuffer.itemSize = 3;
        colorBuffer.numItems = 24;

        // a buffer for indices
        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices, gl.STATIC_DRAW);    

        // Scene (re-)draw routine
        function draw() {
        
            // Translate slider values to angles in the [-pi,pi] interval
            var angle1 = slider1.value*0.01*Math.PI;
            var angle2 = slider2.value*0.01*Math.PI;
        
            // Circle around the y-axis
            var eye = [400*Math.sin(angle1),150.0,400.0*Math.cos(angle1)];
            var target = [0,0,0];
            var up = [0,1,0];
        
            var tModel = mat4.create();
            mat4.fromScaling(tModel,[50,50,50]);
            mat4.rotate(tModel,tModel,angle2,[1,1,1]);
        
            var tCamera = mat4.create();
            mat4.lookAt(tCamera, eye, target, up);      

            var tProjection = mat4.create();
            mat4.perspective(tProjection,Math.PI/4,1,10,1000);
        
            var tMVP = mat4.create();
            mat4.multiply(tMVP,tCamera,tModel); // "modelView" matrix
            mat4.multiply(tMVP,tProjection,tMVP);
        
            // Clear screen, prepare for rendering
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
            // Set up uniforms & attributes
            gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.vertexAttribPointer(shaderProgram.ColorAttribute, colorBuffer.itemSize,
                    gl.FLOAT,false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
            gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer.itemSize,
                    gl.FLOAT, false, 0, 0);
            gl.uniform1f(shaderProgram.time, performance.now() / 1000);

        // Do the drawing
            gl.drawElements(gl.TRIANGLES, triangleIndices.length, gl.UNSIGNED_BYTE, 0);
            requestAnimationFrame(draw);
        }

        draw();
    }

    var simpleShader = document.getElementById("simpleExample");
    if (simpleShader.checked) {
        console.log("Using simple shader");
        simpleVersion();
    } else {
        console.log("Using complex shader");
        complexVersion();
    }

    document.getElementById('modelSelect').addEventListener('change', function() {
        start();
    });    
    
    document.getElementById('simpleExample').addEventListener('change', function() {
        start();
    });


  }
  
  window.onload = start;