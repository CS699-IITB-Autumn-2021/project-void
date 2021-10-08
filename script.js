/*To preview image on the main window when a thumbnail is clicked from the left bar */

function ExpandImg(img) {
    var expandimg = document.getElementById("expimg")
    // console.log(img_src[img.title][1]);
    // console.log(img_src[img.title][2]);
    // console.log(img_src);
    expandimg.src = img.src;
    expandimg.title = img.title;
    expandimg.parentElement.style.display = "block";
}

/*To slide to next image on the main window when a next button is clicked*/
/*these buttons follow a circular loop on thumbnail images*/
function nextimg() {
    var currimg = document.getElementById("expimg");
    var index = filelist.indexOf(currimg.title);
    currimg.src = img_src[filelist[(index + 1) % (filelist.length)]][0];
    currimg.title = filelist[(index + 1) % (filelist.length)];
}
/*To slide to previous image on the main window when a previous button is clicked*/
function previmg() {
    var currimg = document.getElementById("expimg");
    var index = filelist.indexOf(currimg.title);
    if (index == 0)
        index = filelist.length;
    currimg.src = img_src[filelist[(index - 1)]][0];
    currimg.title = filelist[(index - 1)];
}

/*To download the output json file with image labels*/
//needs to be updated
function exportjson() {
    const filename = 'data.json';
    const jsonStr = JSON.stringify(filelist);
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

$(document).ready(function () {
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
                });
                fileReader.readAsDataURL(f);

            }

            // console.log(files);
            // console.log(img_src);
        });
    }
});



