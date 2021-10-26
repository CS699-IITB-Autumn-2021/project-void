
/**
 * Opens the image on the main window for labelling when a thumbnail is clicked from the left side bar
 *
 * @param {string} img - contains image details
 */
function ExpandImg(img) {
    var expandimg = document.getElementById("expimg")
    expandimg.src = img.src;
    expandimg.title = img.title;
    expandimg.parentElement.style.display = "block";
    $('#expimg').css('transform', 'rotate(' + 0 + 'deg)');
    $("#expimg").css({
        'top': 0,
        'position': 'relative',
        'left': 0
    });
    expandimg.style.width = img_src[img.title][1] + "px";
    temp_res[img.title] = JSON.parse(JSON.stringify(results[img.title]));
    angle = 0;
    displaylabels(img.title);

    console.log(results[img.title]);
    console.log(temp_res[img.title]);

}

/**
 * To draw the bounding box corresponding to the label
 *
 * @param {int}  - x1 co-ordinate of the bounding box
 * @param {int}  - y1 co-ordinate of the bounding box
 * @param {int}  - x2 co-ordinate of the bounding box
 * @param {int}  - y2 co-ordinate of the bounding box
 */
function drawlabelrect(x1, y1, x2, y2) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
}

/**
 * To delete the label along with the bounding box
 *
 * @param {Array}  - string array of image title and corresponding label to delete
 */
function deletelabel(delarg) {
    var arg = delarg.split(",");
    var tmp = -1;
    let tmplab = results[arg[0]];
    for (var i = 0; i < tmplab.length; i++) {

        for (const [key, value] of Object.entries(tmplab[i])) {
            if (key == arg[1])
                tmp = i;
        }
        if (tmp != -1)
            break;
    }
    results[arg[0]].splice(tmp, 1);
    temp_res[arg[0]].splice(tmp, 1);
    displaylabels(arg[0]);
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas


}

/**
 * To display the labels on the right side bar
 *
 * @param {string}  - image title
 */
function displaylabels(img) {
    var labellist = document.getElementById("label");
    labellist.innerHTML = "";
    let tmplab = temp_res[img];
    for (var i = 0; i < tmplab.length; i++) {

        for (const [key, value] of Object.entries(tmplab[i])) {
            var div = document.createElement("div");
            var coord = value[0] + "," + value[1] + "," + value[2] + "," + value[3];
            var delarg = img + "," + key;
            div.innerHTML = "<label onclick=\"drawlabelrect(" + coord + ")\"style=\"border:#099EA7 2px solid\";>" + key + "</label>"
                + "<button id=\"dellabel\" onclick=\"deletelabel( \'" + delarg + "\')\"><i class=\"far fa-trash-alt\"></i></button>";
            labellist.insertBefore(div, null);
        }
    }
}


/**
 * To display the labels from the imported annotation file in the right side bar
 *
 * @param {string}  - image title
 */
function displayimportedlabels(img) {
    var labellist = document.getElementById("label");
    labellist.innerHTML = "";
    let tmplab = impjson[img];
    for (var i = 0; i < tmplab.length; i++) {

        for (const [key, value] of Object.entries(tmplab[i])) {
            var div = document.createElement("div");
            var coord = value[0] + "," + value[1] + "," + value[2] + "," + value[3];
            div.innerHTML = "<label onclick=\"drawlabelrect(" + coord + ")\"style=\"border:cornsilk 2px solid; font-weight:bold\";>" + key + "</label>";
            labellist.insertBefore(div, null);
        }
    }
}



/**
 * Draws the imported annotation file lables and calls displayimportedlabels() function
 *
 */
function importlabels() {
    console.log(impjson);
    var img = document.getElementById("expimg")

    for (const [key, value] of Object.entries(impjson)) {
        if (img.title == key) {
            for (var i = 0; i < value.length; i++) {
                for (const [k, v] of Object.entries(value[i])) {
                    // drawimplabels(v[0], v[1], v[2], v[3]);
                    ctx.strokeRect(v[0], v[1], v[2] - v[0], v[3] - v[1]);
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 3;
                    displayimportedlabels(img.title);
                }
            }
        }
    }

}



/**
 * To slide to next image on the main window when a next button is clicked. These buttons follow a circular loop on thumbnail images
 *
 */
function nextimg() {
    var currimg = document.getElementById("expimg");
    var index = filelist.indexOf(currimg.title);
    currimg.src = img_src[filelist[(index + 1) % (filelist.length)]][0];
    currimg.title = filelist[(index + 1) % (filelist.length)];
    $('#expimg').css('transform', 'rotate(' + 0 + 'deg)');
    $("#expimg").css({
        'top': 0,
        'position': 'relative',
        'left': 0
    });
    expandimg.style.width = img_src[img.title][1] + "px";
    temp_res[img.title] = JSON.parse(JSON.stringify(results[img.title]));
    angle = 0;
    displaylabels(currimg.title);

}
/**
 * To slide to previous image on the main window when a next button is clicked. These buttons follow a circular loop on thumbnail images
 *
 */
function previmg() {
    var currimg = document.getElementById("expimg");
    var index = filelist.indexOf(currimg.title);
    if (index == 0)
        index = filelist.length;
    currimg.src = img_src[filelist[(index - 1)]][0];
    currimg.title = filelist[(index - 1)];
    $('#expimg').css('transform', 'rotate(' + 0 + 'deg)');
    $("#expimg").css({
        'top': 0,
        'position': 'relative',
        'left': 0
    });
    expandimg.style.width = img_src[img.title][1] + "px";
    temp_res[img.title] = JSON.parse(JSON.stringify(results[img.title]));
    angle = 0;
    displaylabels(currimg.title);

}

/**
 * To download the output json file with image labels
 *
 */
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

/**
 * To download the output csv file with image labels
 *
 */
function exportcsv() {
    const filename = 'data.csv';
    str = "filename,label,x1,y1,x2,y2\n";
    for (const [key, value] of Object.entries(results)) {
        for (var i = 0; i < value.length; i++) {
            for (const [k, v] of Object.entries(value[i])) {
                str = str + key + ",";
                str = str + k + "," + v + "\n";
            }
        }
    }
    console.log(str);
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(str));
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
var filelist = [];  // filelist array stores the image titles in the order of the thumbnails
var results = {};
let impjson = {};
var canvas;
var ctx;
var rotationAngle = 0;
var original = 100;
var temp_res = {};


$(document).ready(function () {

    //global variables
    canvas = document.getElementById('canvas');
    let input_box = document.getElementById('input-box');
    let input_ele = document.getElementById('input-ele');
    ctx = canvas.getContext('2d');

    // let canvasx = canvas.offsetLeft;
    // let canvasy = canvas.offsetTop;
    let last_mousex = last_mousey = 0;
    let mousex = mousey = 0;
    let mousedown = false;
    var pic;

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
                    temp_res[f.name] = new Array();

                });
                fileReader.readAsDataURL(f);

            }

            imageresize();
        });

        $("#json_upload").on("change", function (e) {

            var reader = new FileReader();
            var filetype = e.target.files[0].name;
            reader.onload = function (e) {
                if (filetype.split('.').pop() == "csv") {
                    var res = {};
                    var csvlines = e.target.result.split('\n');
                    var tmp = {};
                    var tmparr = [];
                    var prev = "";
                    for (var i = 1; i < csvlines.length; i++) {
                        currline = csvlines[i].split(',');
                        if ((prev != "" && currline[0] != prev) || (currline[0] == "")) {
                            res[prev] = tmparr;
                            tmparr = [];
                            tmp[currline[1]] = [currline[2], currline[3], currline[4], currline[5]];
                            prev = currline[0];
                            tmparr.push(tmp);
                            tmp = {};
                        }
                        else {
                            tmp[currline[1]] = [currline[2], currline[3], currline[4], currline[5]];
                            prev = currline[0];
                            tmparr.push(tmp);
                            tmp = {};
                        }
                    }
                    impjson = res;
                }

                else
                    impjson = JSON.parse(e.target.result);
            }
            reader.readAsText(e.target.files[0]);
        });
    }


    function imageresize() {
        $('#expimg').on('load', function () {
            pic = document.getElementById('expimg');

            image_width = pic.width;
            image_height = pic.height;

            canvas.width = image_width;
            canvas.height = image_height;
            ctx = canvas.getContext('2d');
        })


    }


    /**
     * Resize the canvas when the image is zoomed using the current image's dimensions
     * 
     */
    function canvasresize_zoom() {
        pic = document.getElementById('expimg');

        image_width = pic.clientWidth;
        image_height = pic.clientHeight;


        canvas.width = image_width;
        canvas.height = image_height;
        ctx = canvas.getContext('2d');


    }

    
    /**
     * Resize the canvas when the image is rotated using the current image's dimensions
     * 
     */
    function canvasresize_rotate(angle) {
        pic = document.getElementById('expimg');

        image_width = pic.clientWidth;
        image_height = pic.clientHeight;

        if (angle % 180 != 0) {
            canvas.width = image_height;
            canvas.height = image_width;
        }
        else {
            canvas.width = image_width;
            canvas.height = image_height;
        }

        ctx = canvas.getContext('2d');

    }


    //Mousedown
    canvas.addEventListener('mousedown', function (e) {

        input_box.style.display = 'none'
        input_ele.value = ""

        let rect = canvas.getBoundingClientRect()
        last_mousex = parseInt(e.clientX - rect.left);
        last_mousey = parseInt(e.clientY - rect.top);
        mousedown = true;
    });

    function inputLabel(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            alert('save!')

            let input_value = document.getElementById('input-ele').value


            // let temp_data2 = { 'x1': last_mousex, 'y1': last_mousey, 'x2': mousex, 'y2': mousey, 'label': input_value }
            let temp_data = {}
            var x1 = last_mousex;
            var y1 = last_mousey;
            var x2 = mousex;
            var y2 = mousey;

            // if box is drawn over a rotated image, calculate the coordinates of box of original orientation and add it to the results
            if (angle % 360 != 0) {
                console.log(angle % 360);
                if (angle % 360 == 90) {
                    var newx1 = y1;
                    var newy1 = pic.height - x1;

                    var newx2 = y2;
                    var newy2 = pic.height - x2;
                }
                else if (angle % 360 == 180) {
                    var newx1 = pic.width - x1;
                    var newy1 = pic.height - y1;

                    var newx2 = pic.width - x2;
                    var newy2 = pic.height - y2;
                }
                else if (angle % 360 == 270) {
                    var newx1 = pic.width - y1;
                    var newy1 = x1;

                    var newx2 = pic.width - y2
                    var newy2 = x2;
                }

                temp_data[input_value] = [newx1, newy1, newx2, newy2];

                results[pic.title].push(JSON.parse(JSON.stringify(temp_data)));

            }

            //else if box is drawn on original image add it directly to results
            else {
                temp_data[input_value] = [x1, y1, x2, y2];
                results[pic.title].push(JSON.parse(JSON.stringify(temp_data)));
            }

            //add the current coordinates of the box to temporary results
            temp_data[input_value] = [x1, y1, x2, y2];
            temp_res[pic.title].push(JSON.parse(JSON.stringify(temp_data)));
            displaylabels(pic.title);

            console.log(results[pic.title]);
            console.log(temp_res[pic.title]);
            // console.log(results);
        }
    }

    //Mouseup
    canvas.addEventListener('mouseup', function (e) {
        mousedown = false;

        let rect = canvas.getBoundingClientRect()
        input_box.style.top = e.clientY - rect.top + 'px'
        input_box.style.left = e.clientX - rect.left + 'px'
        input_box.style.display = 'block'

        input_box.addEventListener("keyup", inputLabel)

    });



    //Mousemove
    canvas.addEventListener('mousemove', function (e) {
        let rect = canvas.getBoundingClientRect()
        mousex = parseInt(e.clientX - rect.left);
        mousey = parseInt(e.clientY - rect.top);
        if (mousedown) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
            ctx.beginPath();
            let width = mousex - last_mousex;
            let height = mousey - last_mousey;
            ctx.rect(last_mousex, last_mousey, width, height);
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        //Output
        // document.getElementById('output').innerHTML='current: '+mousex+', '+mousey+'<br/>last: '+last_mousex+', '+last_mousey+'<br/>mousedown: '+mousedown;

    });

    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            // ctx.clearRect(0,0,canvas.width,canvas.height); 
            input_ele.value = "";
            input_box.style.display = 'none'
        };
    });

    var angle = 0;


    $('#clockwise').on('click', function () {
        angle += 90;
        $('#expimg').css('transform', 'rotate(' + angle + 'deg)');

        // calculating top_offset and left_offset to maintain image position with respect to the canvas when rotated
        var topoffset = (pic.width / 2 - pic.height / 2) * ((angle % 180) / 90);
        var leftoffset = (pic.width - pic.height) / 2 * ((angle % 180) / 90);;
        $("#expimg").css({
            'top': topoffset,
            'position': 'relative',
            'left': -leftoffset
        });

        //resize the canvas wrt to angle
        canvasresize_rotate(angle);

        //rotate all the bouding boxes wrt to the angle rotated
        for (var i = 0; i < results[pic.title].length; i++) {
            for (const [key, value] of Object.entries(results[pic.title][i])) {

                var x1 = value[0];
                var y1 = value[1];
                var x2 = value[2];
                var y2 = value[3];

                var ratio = pic.clientWidth / img_src[pic.title][1];

                //to retrieve the resized boxes if the image is zoomed
                var newboxes = resizeboxes(x1, y1, x2, y2, ratio);


                x1 = newboxes[0];
                y1 = newboxes[1];
                x2 = newboxes[2];
                y2 = newboxes[3];


                //change the coordinates of the box w.r.t the angle rotated
                if (angle % 360 == 90) {
                    var newx1 = pic.height - y1;
                    var newy1 = x1;

                    var newx2 = pic.height - y2;
                    var newy2 = x2;
                }
                else if (angle % 360 == 180) {
                    var newx1 = pic.width - x1;
                    var newy1 = pic.height - y1;

                    var newx2 = pic.width - x2;
                    var newy2 = pic.height - y2;
                }
                else if (angle % 360 == 270) {
                    var newx1 = y1;
                    var newy1 = pic.width - x1;

                    var newx2 = y2
                    var newy2 = pic.width - x2;
                }
                else if (angle % 360 == 0) {
                    var newx1 = x1;
                    var newy1 = y1;

                    var newx2 = x2;
                    var newy2 = y2;
                }

                //store the new coordinates in temporary results
                temp_res[pic.title][i][key] = [Math.abs(newx1), Math.abs(newy1), Math.abs(newx2), Math.abs(newy2)];
                console.log(results[pic.title][i][key]);
                console.log(temp_res[pic.title][i][key]);
            }
        }
        displaylabels(pic.title);

    });


    $('#counterclockwise').on('click', function () {
        angle -= 90;
        $('#expimg').css('transform', 'rotate(' + angle + 'deg)');

        // calculating top_offset and left_offset to maintain image position with respect to the canvas when rotated
        var topoffset = (pic.width / 2 - pic.height / 2) * ((Math.abs(angle) % 180) / 90);
        var leftoffset = (pic.width - pic.height) / 2 * ((Math.abs(angle) % 180) / 90);;
        $("#expimg").css({
            'top': topoffset,
            'position': 'relative',
            'left': -leftoffset
        });

        //resize the canvas wrt to angle
        canvasresize_rotate(angle);

        //rotate all the bouding boxes wrt to the angle rotated
        for (var i = 0; i < results[pic.title].length; i++) {
            for (const [key, value] of Object.entries(results[pic.title][i])) {

                var x1 = value[0];
                var y1 = value[1];
                var x2 = value[2];
                var y2 = value[3];

                //to retrieve the resized boxes if the image is zoomed
                var ratio = pic.clientWidth / img_src[pic.title][1];
                var newboxes = resizeboxes(x1, y1, x2, y2, ratio);

                x1 = newboxes[0];
                y1 = newboxes[1];
                x2 = newboxes[2];
                y2 = newboxes[3];

                //change the coordinates of the box w.r.t the angle rotated
                if (angle % 360 == 90) {
                    var newx1 = pic.height - y1;
                    var newy1 = x1;

                    var newx2 = pic.height - y2;
                    var newy2 = x2;
                }
                else if (angle % 360 == 180) {
                    var newx1 = pic.width - x1;
                    var newy1 = pic.height - y1;

                    var newx2 = pic.width - x2;
                    var newy2 = pic.height - y2;
                }
                else if (angle % 360 == 270) {
                    var newx1 = y1;
                    var newy1 = pic.width - x1;

                    var newx2 = y2
                    var newy2 = pic.width - x2;
                }
                else if (angle % 360 == 0) {
                    var newx1 = x1;
                    var newy1 = y1;

                    var newx2 = x2;
                    var newy2 = y2;
                }

                //store the new coordinates in temporary results
                temp_res[pic.title][i][key] = [Math.abs(newx1), Math.abs(newy1), Math.abs(newx2), Math.abs(newy2)];

            }
        }
        displaylabels(pic.title);

    });


    /**
    * Resizes the bounding boxes when the image is zoomed in or zoomed out.
    * @param{int} x1 - x1 coordinate of the bouding box
    * @param{int} y1 - y1 coordinate of the bouding box
    * @param{int} x2 - x2 coordinate of the bouding box
    * @param{int} y2 - t2 coordinate of the bouding box
    * @param{int} ratio - ratio of the zoomed image width to the previous image width
    * 
    * @return{Array<int>} Array of resized coordinates of the bouding box.
    */
    function resizeboxes(x1, y1, x2, y2, ratio) {

        var xMid = (x2 - x1) / 2 + x1;
        var yMid = (y2 - y1) / 2 + y1;

        var xLength = (x2 - x1) * ratio;
        var yLength = (y2 - y1) * ratio;

        var newx1 = xMid * ratio - (xLength / 2);
        var newx2 = xMid * ratio + (xLength / 2);

        var newy1 = yMid * ratio - (yLength / 2);
        var newy2 = yMid * ratio + (yLength / 2);

        return [newx1, newy1, newx2, newy2];
    }


    $("#zoomin").click(function () {
        var prev = pic.clientWidth;
        var currWidth = pic.clientWidth;
        pic.style.width = (currWidth + 100) + "px";
        var next = pic.clientWidth;
        var ratio = (next / prev);

        //resize canvas w.r.t the zoomed image
        canvasresize_zoom();

        for (var i = 0; i < temp_res[pic.title].length; i++) {
            for (const [key, value] of Object.entries(temp_res[pic.title][i])) {

                var x1 = value[0];
                var y1 = value[1];
                var x2 = value[2];
                var y2 = value[3];

                // retrieve the resized coordinates of the bounding box
                var newboxes = resizeboxes(x1, y1, x2, y2, ratio);
                console.log(newboxes);

                newx1 = newboxes[0];
                newy1 = newboxes[1];
                newx2 = newboxes[2];
                newy2 = newboxes[3];

                //store in the temporary results
                temp_res[pic.title][i][key] = [newx1, newx2, newy1, newy2];

                displaylabels(pic.title);

                ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
            }
        }

    });


    $("#zoomout").click(function () {
        var prev = pic.clientWidth;
        var currWidth = pic.clientWidth;
        pic.style.width = (currWidth - 100) + "px";
        var next = pic.clientWidth;
        var ratio = (next / prev);

        //resize canvas w.r.t the zoomed image
        canvasresize_zoom();


        for (var i = 0; i < temp_res[pic.title].length; i++) {
            for (const [key, value] of Object.entries(temp_res[pic.title][i])) {

                var x1 = value[0];
                var y1 = value[1];
                var x2 = value[2];
                var y2 = value[3];

                // retrieve the resized coordinates of the bounding box
                var newboxes = resizeboxes(x1, y1, x2, y2, ratio);
                console.log(newboxes);
                newx1 = newboxes[0];
                newy1 = newboxes[1];
                newx2 = newboxes[2];
                newy2 = newboxes[3];

                //store in the temporary results
                temp_res[pic.title][i][key] = [newx1, newy1, newx2, newy2];

                displaylabels(pic.title);
                ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
            }
        }

    });

});


