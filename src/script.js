/*To preview image on the main window when a thumbnail is clicked from the left bar */

function ExpandImg(img) {
    var expandimg = document.getElementById("expimg")
    // console.log(img_src[img.title][1]);
    // console.log(img_src[img.title][2]);
    // console.log(img_src);
    
    expandimg.src = img.src;
    expandimg.title = img.title;
    expandimg.parentElement.style.display = "block";

    $("#expimg").css("zoom",0); 
    $("#canvas").css("zoom",0); 
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


class Rectangle { 
    constructor(ctx, x, y, w, h) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
   }
    draw() {
      // draw using ctx here
      this.ctx.rect(this.x,this.y,this.w,this.h);
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
   }
} 

$(document).ready(function () {

    //global variables
    canvas = document.getElementById('canvas');
    // let pic = document.getElementById('expimg');
    let input_box = document.getElementById('input-box');
    let input_ele=document.getElementById('input-ele');
    ctx=canvas.getContext('2d');
    
    // let canvasx = canvas.offsetLeft;
    // let canvasy = canvas.offsetTop;
    let last_mousex = last_mousey = width = height = 0;
    // let prev_x = prev_y = prev_w = prev_h = 0;
    let mousex = mousey = 0;
    let mousedown = false;
    var pic;
    let shapes=[]
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
                    shapes=new Array();
                    
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
            input_box.style.display='none'
            input_ele.value=""

            let temp_data = { 'x1': last_mousex, 'y1': last_mousey, 'x2': mousex, 'y2': mousey, 'label': input_value }
            results[pic.title].push(temp_data)
           
            displaylabels(pic);
           
            // console.log(results);
        }
    }
    
    //Mouseup
    canvas.addEventListener('mouseup', function(e) {
        mousedown = false;

       

        if(width !=0 && height != 0){

            rectangle = new Rectangle(ctx, last_mousex, last_mousey, width, height);
            // save rectangle to an array
            shapes.push(rectangle);
            // redraw canvas
            redraw();

            width=0;
            height=0;
           
            let rect = canvas.getBoundingClientRect()
            input_box.style.top=e.clientY-rect.top +'px'
            input_box.style.left= e.clientX -rect.left+'px'
    
            // console.log("y:"+ e.clientY +"x:" + e.clientX)
            input_box.style.display='block'
    
            input_box.addEventListener("keyup", inputLabel)
        }

    });

    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        // console.log(shapes);
        // draw all rectangle
        shapes.forEach(function(shape) {
        // draw shape
        shape.draw();
      
    })
    }


    
    //Mousemove
    canvas.addEventListener('mousemove', function(e) {
        let rect = canvas.getBoundingClientRect()
        mousex = parseInt(e.clientX-rect.left);
        mousey = parseInt(e.clientY-rect.top);
        if(mousedown) {
            prev_x = last_mousex;
            prev_y = last_mousey;
            // prev_w = width;
            // prev_h = height;
            ctx.clearRect(0,0,canvas.width,canvas.height); //clear canvas
            // ctx.clearRect(prev_x-1, prev_y-1, prev_w+2, prev_h+2);
          
            ctx.beginPath();
            width = mousex-last_mousex;
            height = mousey-last_mousey;
            ctx.rect(last_mousex,last_mousey,width,height);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.stroke();
            redraw();
            
        }
        //Output
        // document.getElementById('output').innerHTML='current: '+mousex+', '+mousey+'<br/>last: '+last_mousex+', '+last_mousey+'<br/>mousedown: '+mousedown;
    
    });

    $(document).keyup(function(e) {
        if (e.keyCode == 27) { 
            
            input_ele.value="";
            input_box.style.display='none'
            shapes.pop();
            ctx.clearRect(0,0,canvas.width,canvas.height); //clear canvas
            redraw();
            ctx.stroke();
        };
        
      });


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
    }
    $("#zoomin").click(function(){ 
        var zoominPercent = original + 10;
        original=zoominPercent;
        var increased = zoominPercent.toString().concat("%");
        $("#expimg").css("zoom",increased); 
        // $("#canvas").css("zoom",increased); 
        imageresize();

    });
    $("#zoomout").click(function(){ 
        var zoomoutPercent = original - 10;
        if(zoomoutPercent>0)
        {
        original=zoomoutPercent;
        var decreased = zoomoutPercent.toString().concat("%");
        $("#expimg").css("zoom",decreased);
        // $("#canvas").css("zoom",decreased);
        imageresize();
        }
    });
});

