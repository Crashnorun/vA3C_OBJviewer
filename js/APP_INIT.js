/**
 * Created by benjamin howes on 12/30/2014.
 */

//contains the jquery document.ready callback, which starts the application
var myVA3C = {};

$(document).ready(function(){

    //once the whole page is loaded, initialize a VA3C viewer by passing in the div to bind to, links to the OBJ and MTL files,
    // and a callback function where we can enable application functionality in nice clean chunks
    myVA3C = new VA3C_CONSTRUCTOR($("#vA3C_output"),'assets/Lion_Fountain_Crop-exported.obj', 'assets/Lion_Fountain_Crop-exported.mtl', function(app){

        //call the UI / functionality modules
        app.userInterface();
        app.sceneUI();

    });
});