$(window).load(function(){
    var canvas=document.getElementById("canvas");
    var ctx=canvas.getContext("2d");
    var rotationAngle=0;
    var image=document.createElement("img");
    var original=100;
    image.onload=function(){
        canvas.width=image.width;
        canvas.height=image.height;
        ctx.drawImage(image,0,0);
    }
    image.src="download.jpeg";
    $("#clockwise").click(function(){ 
        rotationAngle+=90;
        drawRotated(rotationAngle);
    });
    $("#counterclockwise").click(function(){ 
        rotationAngle-=90;
        drawRotated(rotationAngle);
    });
    function drawRotated(degrees){
        prevWidth=canvas.width;
        prevHeight=canvas.height;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.save();
        canvas.width=prevHeight;
        canvas.height=prevWidth;
        ctx.translate(canvas.width/2,canvas.height/2);
        ctx.rotate(degrees*Math.PI/180);
        ctx.drawImage(image,-image.width/2,-image.height/2);
        ctx.restore();
        
    }
    $("#zoomin").click(function(){ 
        var zoominPercent = original + 10;
        original=zoominPercent;
        var increased = zoominPercent.toString().concat("%");
        $("#canvas").css("zoom",increased); 

    });
    $("#zoomout").click(function(){ 
        var zoomoutPercent = original - 10;
        if(zoomoutPercent>0)
        {
        original=zoomoutPercent;
        var decreased = zoomoutPercent.toString().concat("%");
        $("#canvas").css("zoom",decreased);
        }
    });
});