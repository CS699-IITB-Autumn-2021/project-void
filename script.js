/*To preview image on the main window when a thumbnail is clicked from the left bar */

function ExpandImg(img) {
    var expandimg = document.getElementById("expimg")
    // console.log(img_src[img.title][1]);
    // console.log(img_src[img.title][2]);
    // console.log(img_src);
    expandimg.src = img.src;
    expandimg.title = img.title;
    expandimg.parentElement.style.display = "block";
    displaylabels(img);

}

function drawlabelrect(x1, y1, x2, y2) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
}

function displaylabels(img) {
    var labellist = document.getElementById("label");
    labellist.innerHTML = "";
    for (var i = 0; i < results[img.title].length; i++) {
        var div = document.createElement("div");
        var coord = results[img.title][i]["x1"] + "," + results[img.title][i]["y1"] + "," + results[img.title][i]["x2"] + "," + results[img.title][i]["y2"];
        div.innerHTML = "<label onclick=\"drawlabelrect(" + coord + ")\"style=\"border:#099EA7 2px solid\";>" + results[img.title][i]["label"] + "</label>";
        labellist.insertBefore(div, null);
    }
}


/*To slide to next image on the main window when a next button is clicked*/
/*these buttons follow a circular loop on thumbnail images*/
function nextimg() {
    var currimg = document.getElementById("expimg");
    var index = filelist.indexOf(currimg.title);
    currimg.src = img_src[filelist[(index + 1) % (filelist.length)]][0];
    currimg.title = filelist[(index + 1) % (filelist.length)];
    displaylabels(currimg);

}
/*To slide to previous image on the main window when a previous button is clicked*/
function previmg() {
    var currimg = document.getElementById("expimg");
    var index = filelist.indexOf(currimg.title);
    if (index == 0)
        index = filelist.length;
    currimg.src = img_src[filelist[(index - 1)]][0];
    currimg.title = filelist[(index - 1)];
    displaylabels(currimg);

}

/*To download the output json file with image labels*/
//needs to be updated
function exportjson() {
    const filename = 'data.json';
    const jsonStr = JSON.stringify(results);
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

/*uploading images using filereader api*/

/* img_src stores the details of the images uploaded. image title is the key and details are in the value.
 Ex: {'img1 title':['img src','img width','img height'],'img2 title':['img src','img width','img height']}*/
var img_src = {};
// filelist array stores the image titles in the order of the thumbnails
var filelist = [];
var results = {};
var canvas;
var ctx;
var rotationAngle=0;
var original=100;
$(document).ready(function () {

    //global variables
    canvas = document.getElementById('canvas');
    // let pic = document.getElementById('expimg');
    let input_box = document.getElementById('input-box');
    let input_ele=document.getElementById('input-ele');
    ctx=canvas.getContext('2d');
    
    // let canvasx = canvas.offsetLeft;
    // let canvasy = canvas.offsetTop;
    let last_mousex = last_mousey = 0;
    let mousex = mousey = 0;
    let mousedown = false;
    var pic;
    //  results= {'img':"",'bounding_boxes':[]};





    if (window.File && window.FileList && window.FileReader) {
        $("#folder_upload,#file_upload").on("change", function (e) {
            var output = document.getElementById("imgnav");
            var files = e.target.files;
            for (var i = 0; i < files.length; i++) {
                const temp = [];
                const f = files[i]
                var fileReader = new FileReader();
                fileReader.onload = (function (e) {
                    var file = e.target;
                    temp[0] = file.result;
                    var img = new Image;
                    img.onload = function () {
                        temp[1] = img.width;
                        temp[2] = img.height;
                    };
                    img.src = file.result;
                    // document.getElementById('imgnav').innerHTML = document.getElementById('imgnav').innerHTML + "<img src=\"" + e.target.result + "\" title=\"" + f.name + "\" id=\"tbimg\" style=\"width: 150px; height:100px\" onclick=\"ExpandImg(this)\"/> ";
                    var div = document.createElement("div");
                    div.innerHTML = "<img src=\"" + file.result + "\" title=\"" + f.name + "\" id=\"tbimg\"  onclick=\"ExpandImg(this)\"/> ";
                    output.insertBefore(div, null);
                    img_src[f.name] = temp;
                    filelist.push(f.name);
                    results[f.name] = new Array();
                    
                });
                fileReader.readAsDataURL(f);

            }

            imageresize();
            // console.log(files);
            // console.log(img_src);
        });
    }

    function imageresize(){
        $('#expimg').on('load',function(){
            pic = document.getElementById('expimg');

            image_width=pic.clientWidth;
            image_height=pic.clientHeight;
            
        
            canvas.width=image_width;
            canvas.height=image_height;
            ctx = canvas.getContext('2d');
        })
        
    
    }

    //Mousedown
    canvas.addEventListener('mousedown', function(e) {

        input_box.style.display='none'
        input_ele.value=""

        let rect = canvas.getBoundingClientRect()
        last_mousex = parseInt(e.clientX-rect.left);
        last_mousey = parseInt(e.clientY-rect.top);
        mousedown = true;
    });

    function inputLabel(event){
        if (event.keyCode === 13) {
            event.preventDefault();
            alert('save!')

            let input_value=document.getElementById('input-ele').value
            

            let temp_data = { 'x1': last_mousex, 'y1': last_mousey, 'x2': mousex, 'y2': mousey, 'label': input_value }
            results[pic.title].push(temp_data)
            displaylabels(pic);
           
            console.log(results);
        }
    }
    
    //Mouseup
    canvas.addEventListener('mouseup', function(e) {
        mousedown = false;
       
        let rect = canvas.getBoundingClientRect()
        input_box.style.top=e.clientY-rect.top +'px'
        input_box.style.left= e.clientX -rect.left+'px'

        // console.log("y:"+ e.clientY +"x:" + e.clientX)
        input_box.style.display='block'

        input_box.addEventListener("keyup", inputLabel)

    });


    
    //Mousemove
    canvas.addEventListener('mousemove', function(e) {
        let rect = canvas.getBoundingClientRect()
        mousex = parseInt(e.clientX-rect.left);
        mousey = parseInt(e.clientY-rect.top);
        if(mousedown) {
            ctx.clearRect(0,0,canvas.width,canvas.height); //clear canvas
            ctx.beginPath();
            let width = mousex-last_mousex;
            let height = mousey-last_mousey;
            ctx.rect(last_mousex,last_mousey,width,height);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        //Output
        // document.getElementById('output').innerHTML='current: '+mousex+', '+mousey+'<br/>last: '+last_mousex+', '+last_mousey+'<br/>mousedown: '+mousedown;
    
    });

    $(document).keyup(function(e) {
        if (e.keyCode == 27) { 
            // ctx.clearRect(0,0,canvas.width,canvas.height); 
            input_ele.value="";
            input_box.style.display='none'
        };
      });

      var angle = 0;
      $('#clockwise').on('click', function() {
          angle += 90;
          $('#expimg').css('transform','rotate(' + angle + 'deg)');
          imageresize();
          

        for (var i = 0; i < results[pic.title].length; i++) 
        {
            var x1=results[pic.title][i]["x1"];
            var y1=results[pic.title][i]["y1"];
            var x2=results[pic.title][i]["x2"];
            var y2=results[pic.title][i]["y2"];

            var rad=angle*Math.PI / 180;
            var newx1= x1*Math.cos(rad) - y1*Math.sin(rad);
            var newy1= x1*Math.sin(rad) + y1*Math.cos(rad);

            var newx2= x2*Math.cos(rad) - y2*Math.sin(rad);
            var newy2= x2*Math.sin(rad) + y2*Math.cos(rad);
            
            
            console.log(x1);
            console.log(x2);
            console.log(y1);
            console.log(y2);
            console.log(Math.abs(newx1));
            console.log(Math.abs(newx2));
            console.log(Math.abs(newy1));
            console.log(Math.abs(newy2));

            results[pic.title][i]["x1"]=Math.abs(newx1);
            results[pic.title][i]["y1"]=Math.abs(newy1);
            results[pic.title][i]["x2"]=Math.abs(newx2);
            results[pic.title][i]["y2"]=Math.abs(newy2);

            Cx, Cy // the coordinates of your center point in world coordinates
W      // the width of your rectangle
H      // the height of your rectangle
θ      // the angle you wish to rotate

//The offset of a corner in local coordinates (i.e. relative to the pivot point)
//(which corner will depend on the coordinate reference system used in your environment)
Ox = W / 2
Oy = H / 2

//The rotated position of this corner in world coordinates    
Rx = Cx + (Ox  * cos(θ)) - (Oy * sin(θ))
Ry = Cy + (Ox  * sin(θ)) + (Oy * cos(θ))

        }
        });
      $('#counterclockwise').on('click', function() {
    angle -= 90;
    $('#expimg').css('transform','rotate(' + angle + 'deg)');
        imageresize();

});
    
    /*
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
        ctx.drawImage(pic,-pic.width/2,-pic.height/2);
        ctx.restore();    
    }*/
    $("#zoomin").click(function(){ 
        var prev=pic.clientWidth;
        var currWidth = pic.clientWidth;
        pic.style.width = (currWidth + 100) + "px";
        var next=pic.clientWidth;
        var ratio=(next/prev);
        for (var i = 0; i < results[pic.title].length; i++) {
            var x1=results[pic.title][i]["x1"];
            var y1=results[pic.title][i]["y1"];
            var x2=results[pic.title][i]["x2"];
            var y2=results[pic.title][i]["y2"];

            var xMid=(x2 - x1)/2 + x1;  
            var yMid=(y2 - y1)/2 + y1;

            var xLength=(x2 - x1)*ratio;
            var yLength=(y2 - y1)*ratio;

            var newx1=xMid*ratio-(xLength/2);
            var newx2=xMid*ratio+(xLength/2);

            var newy1=yMid*ratio-(yLength/2);
            var newy2=yMid*ratio+(yLength/2);

            results[pic.title][i]["x1"]=newx1;
            results[pic.title][i]["y1"]=newy1;
            results[pic.title][i]["x2"]=newx2;
            results[pic.title][i]["y2"]=newy2;

            // console.log(x1);
            // console.log(y1);
            // console.log(x2);
            // console.log(y2);
            // console.log(newx1);
            // console.log(newy1);
            // console.log(newx2);
            // console.log(newy2);


        }

    });
    $("#zoomout").click(function(){ 
        var prev=pic.clientWidth;
        var currWidth = pic.clientWidth;
        pic.style.width = (currWidth - 100) + "px";
        var next=pic.clientWidth;
        var ratio=(next/prev);
        for (var i = 0; i < results[pic.title].length; i++) {
            var x1=results[pic.title][i]["x1"];
            var y1=results[pic.title][i]["y1"];
            var x2=results[pic.title][i]["x2"];
            var y2=results[pic.title][i]["y2"];
            
            var xMid=(x2 - x1)/2 + x1;  
            var yMid=(y2 - y1)/2 + y1;

            var xLength=(x2 - x1)*ratio;
            var yLength=(y2 - y1)*ratio;

            var newx1=xMid*ratio-(xLength/2);
            var newx2=xMid*ratio+(xLength/2);

            var newy1=yMid*ratio-(yLength/2);
            var newy2=yMid*ratio+(yLength/2);

            results[pic.title][i]["x1"]=newx1;
            results[pic.title][i]["y1"]=newy1;
            results[pic.title][i]["x2"]=newx2;
            results[pic.title][i]["y2"]=newy2;

            // console.log(x1);
            // console.log(y1);
            // console.log(x2);
            // console.log(y2);
            // console.log(newx1);
            // console.log(newy1);
            // console.log(newx2);
            // console.log(newy2);


        }

    });
});


