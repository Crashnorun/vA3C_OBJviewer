	var V3LI = {} || V3LI;

	V3LI.addLibrariesTab = function() {
		var tab = JA.menu.appendChild( document.createElement( 'div' ) );
		tab.title = 'View available libraries';
		tab.innerHTML =
			'<a href=# onclick=JA.toggleTab(V3LI.libraries); ><p class=button >' +
				'<i class="fa fa-paw"></i> Libraries & Tabs...' +
			'</p></a>'; 

		V3LI.libraries = JA.menu.appendChild( document.createElement( 'div' ) );
		V3LI.libraries.style.cssText = 'cursor: auto; display: none; ' ;
		V3LI.libraries.innerHTML =
			'<input type=radio name=fileOpen id=openOver checked /> Overwrite current view<br>' +
			'<input type=radio name=fileOpen id=openAppend /> Append to current view<br>' +

			'<p><input type=checkbox id=chkMeier onchange=JA.toggleTab(V3TM.threejsModelsTab.parentElement); > Three.js Example Models<br>' +
			'Over 100..</p>' +

			'<p><input type=checkbox id=chkMeier onchange=JA.toggleTab(V3CO.controlsTab.parentElement);JA.toggleTab(V3JM.JurgenMeier.parentElement); > Jurgen Meier Gallery<br>' +
			'170+ Parametric equations that create 3D objects</p>' +

			'<p><input type=checkbox id=chkGeometry onchange=JA.toggleTab(JAGE.geometryTab.parentElement); > Geometry<br>' +
			'Edit position, rotation and scale of the selected element</p>' +
			'<p style=text-align:right; >' +
				'<a class=button href=JavaScript:JA.toggleTab(V3LI.libraries); >Close</a> ' +
			'</p>' +
		'';
	};

	V3LI.updateIframe = function( fileList, index, basepath, filename ) {
		if ( !V3LI.ifr ) {
			V3LI.ifr = document.body.appendChild( document.createElement( 'iframe' ) );
			V3LI.ifr.height = window.innerHeight;
			V3LI.ifr.width = window.innerWidth;
			V3LI.ifr.style.cssText = 'border-width: 0; position: absolute; ';
		}

		var extension = filename.split( '.' ).pop().toLowerCase();
		if ( openOver.checked === true ) {
			V3LI.ifr.onload = function() {
				JAPR.setRandomGradient();

				app = V3LI.ifr.contentWindow;
	//			JA.body = V3FR.ifr.contentDocument;

				THREE = app.THREE;
//				THREE.ImageUtils.crossOrigin = 'anonymous';
				renderer = app.renderer;
				scene = app.scene;
				scene.select = app.mesh;
				camera = app.camera;
				controls = app.controls;
				
				V3CO.updateControlsTab();
				
				V3LI.loadFile( basepath, filename );
				divMsg1.innerHTML = fileList[ index ][1];

				renderer.shadowMapEnabled = true;
				renderer.shadowMapSoft = true;

				chkLightAmbient.checked = true;
				JALI.toggleLightAmbient();

				chkLightCamera.checked = true;
				JALI.toggleLightCamera();

				chkLightPosition.checked = true;
				JALI.toggleLightPosition();


	//			JAPR.setRandomGradient();

			};

			if ( extension === 'html' ) {
				V3LI.ifr.src = basepath + filename;

			} else {
				V3LI.ifr.src = 'boilerplate-simple.html';
			}
		} else {
			V3LI.loadFile( basepath, filename );
			V3CO.updateControlsTab();
			divMsg1.innerHTML = fileList[ index ][1];
		}

	};


	function requestFile( fname ) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.crossOrigin = "Anonymous"; 
		xmlhttp.open( 'GET', fname, false );
		xmlhttp.send( null );
		return xmlhttp.responseText;
	}

	V3LI.loadFile = function ( basepath, filename ) {

		var scr, reader, contents, fname, loader, result;
		var loaderBase = '../../../three.js/examples/';

//		var filename = fileList[ index ][0];
		var extension = filename.split( '.' ).pop().toLowerCase();

		switch ( extension ) {
			case 'html' :
console.log( basepath, filename);
				// V3LI.ifr.src = basepath + filename;
				// scene.select = scene.children[0];

				break;
			case 'babylon':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;
					var json = JSON.parse( contents );

					var loader = new THREE.BabylonLoader();
					var scene = loader.parse( json );

					editor.setScene( scene );

				}, false );
				reader.readAsText( file );

				break;

			case 'ctm':

					var scr = document.body.appendChild( document.createElement( 'script' ) );
					scr.src = basepath + 'js/loaders/ctm/lzma.js';

					scr = document.body.appendChild( document.createElement( 'script' ) );
					scr.src = basepath + 'js/loaders/ctm/ctm.js';

					scr = document.body.appendChild( document.createElement( 'script' ) );

					scr.onload = function() {

						var data = new Uint8Array( contents );

						var stream = new CTM.Stream( data );
						stream.offset = 0;

						var loader = new THREE.CTMLoader();
						loader.createModel( new CTM.File( stream ), function( geometry ) {

							geometry.sourceType = "ctm";
							geometry.sourceFile = file.name;

							var material = new THREE.MeshPhongMaterial();

							var mesh = new THREE.Mesh( geometry, material );
							mesh.name = filename;

							scene.add( mesh );

							} );
					};
					scr.src = loaderBase + 'js/loaders/ctm/CTMLoader.js';


/*
				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var data = new Uint8Array( event.target.result );

					var stream = new CTM.Stream( data );
					stream.offset = 0;

					var loader = new THREE.CTMLoader();
					loader.createModel( new CTM.File( stream ), function( geometry ) {

						geometry.sourceType = "ctm";
						geometry.sourceFile = file.name;

						var material = new THREE.MeshPhongMaterial();

						var mesh = new THREE.Mesh( geometry, material );
						mesh.name = filename;

						editor.addObject( mesh );
						editor.select( mesh );

					} );

				}, false );
				reader.readAsArrayBuffer( file );
*/

				break;

			case 'dae':

					scr = document.body.appendChild( document.createElement( 'script' ) );
					scr.onload = function() {

						var fname = basepath + filename;
						var contents = requestFile( fname );

						var parser = new DOMParser();
						var xml = parser.parseFromString( contents, 'text/xml' );

						var loader = new THREE.ColladaLoader();
						loader.parse( xml, function ( collada ) {

							collada.scene.name = filename;

							scene.add( collada.scene );
							scene.select( collada.scene );

						} );
					}
					scr.src = loaderBase + 'js/loaders/ColladaLoader.js';


/*
				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var parser = new DOMParser();
					var xml = parser.parseFromString( contents, 'text/xml' );

					var loader = new THREE.ColladaLoader();
					loader.parse( xml, function ( collada ) {

						collada.scene.name = filename;

						editor.addObject( collada.scene );
						editor.select( collada.scene );

					} );

				}, false );
				reader.readAsText( file );
*/
				break;

			case 'js':
			case 'json':

			case '3geo':
			case '3mat':
			case '3obj':
			case '3scn':

					var fname = basepath + filename;
					var contents = requestFile( fname );

					if ( contents.indexOf( 'postMessage' ) !== -1 ) {

						var blob = new Blob( [ contents ], { type: 'text/javascript' } );
						var url = URL.createObjectURL( blob );

						var worker = new Worker( url );

						worker.onmessage = function ( event ) {

							event.data.metadata = { version: 2 };
							handleJSON( event.data, filename, filename );

						};

						worker.postMessage( Date.now() );

						return;

					}

					// >= 3.0

					var data;

					try {

						data = JSON.parse( contents );

					} catch ( error ) {

						alert( error );
						return;

					}

					handleJSON( data, filename, filename );

//				}, false );
//				reader.readAsText( file );

				break;

			case 'obj':

					var fname = basepath + filename;
					var contents = requestFile( fname );

					var scr = document.body.appendChild( document.createElement( 'script' ) );
					scr.onload = function() {

						var object = new THREE.OBJLoader().parse( contents );
						mesh = object.children[0];
						mesh.name = filename;
						mesh.material = new THREE.MeshPhongMaterial();
						mesh.castShadow = true;
						mesh.receiveShadow = true;
						scene.add( mesh );
						scene.select = mesh;
					}
					scr.src = loaderBase + 'js/loaders/OBJLoader.js';

				break;

			case 'ply':

					var fname = basepath + filename;
					var contents = requestFile( fname );

					var scr = document.body.appendChild( document.createElement( 'script' ) );
					scr.onload = function() {

						var geometry = new THREE.PLYLoader().parse( contents );
						geometry.sourceType = "ply";
						geometry.sourceFile = fileList[ index ];

						var material = new THREE.MeshNormalMaterial();

						var mesh = new THREE.Mesh( geometry, material );
						mesh.name = filename;

						scene.add( mesh );

					}
					scr.src = loaderBase + 'js/loaders/PLYLoader.js';

/*
				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					console.log( contents );

					var geometry = new THREE.PLYLoader().parse( contents );
					geometry.sourceType = "ply";
					geometry.sourceFile = file.name;

					var material = new THREE.MeshPhongMaterial();

					var mesh = new THREE.Mesh( geometry, material );
					mesh.name = filename;

					editor.addObject( mesh );
					editor.select( mesh );

				}, false );
				reader.readAsText( file );
*/

				break;

			case 'stl':

					var scr = document.body.appendChild( document.createElement( 'script' ) );
					scr.src = basepath + 'js/wip/TypedGeometry.js';

					var scr = document.body.appendChild( document.createElement( 'script' ) );
					scr.onload = function() {

						var fname = basepath + filename;
						var xmlhttp;
						var contents = requestSTLFile( fname );

						function requestSTLFile( fname ) {
							xmlhttp = new XMLHttpRequest();
							xmlhttp.open( 'GET', fname, true );
							xmlhttp.responseType = "arraybuffer";
							xmlhttp.onload = function (oEvent) {
								var arrayBuffer = xmlhttp.response;
									if (arrayBuffer) {

										var geometry = new THREE.STLLoader().parse( arrayBuffer );
										var material = new THREE.MeshPhongMaterial();
										var mesh = new THREE.Mesh( geometry, material );
										mesh.castShadow = true;
										mesh.receiveShadow = true;

										scene.add( mesh );
										scene.select = mesh;

									}
								};
							xmlhttp.send( null );
						}

					}
					scr.src = loaderBase + 'js/loaders/STLLoader.js';

/*
				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var geometry = new THREE.STLLoader().parse( contents );
					geometry.sourceType = "stl";
					geometry.sourceFile = file.name;

					var material = new THREE.MeshPhongMaterial();

					var mesh = new THREE.Mesh( geometry, material );
					mesh.name = filename;

					editor.addObject( mesh );
					editor.select( mesh );

				}, false );

				if ( reader.readAsBinaryString !== undefined ) {

					reader.readAsBinaryString( file );

				} else {

					reader.readAsArrayBuffer( file );

				}
*/

				break;

			/*
			case 'utf8':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var geometry = new THREE.UTF8Loader().parse( contents );
					var material = new THREE.MeshLambertMaterial();

					var mesh = new THREE.Mesh( geometry, material );

					editor.addObject( mesh );
					editor.select( mesh );

				}, false );
				reader.readAsBinaryString( file );

				break;
			*/

			case 'vtk':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var geometry = new THREE.VTKLoader().parse( contents );
					geometry.sourceType = "vtk";
					geometry.sourceFile = file.name;

					var material = new THREE.MeshPhongMaterial();

					var mesh = new THREE.Mesh( geometry, material );
					mesh.name = filename;

					editor.addObject( mesh );
					editor.select( mesh );

				}, false );
				reader.readAsText( file );

				break;

			case 'wrl':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var result = new THREE.VRMLLoader().parse( contents );

					editor.setScene( result );

				}, false );
				reader.readAsText( file );

				break;

			default:
				if ( filename.length > 2 ) {
console.log( filename );

				} else {
				alert( 'Unsupported file format.' );
				}
				break;

		}

	}

	var handleJSON = function ( data, file, filename ) {

		if ( data.metadata === undefined ) { // 2.0

			data.metadata = { type: 'Geometry' };

		}

		if ( data.metadata.type === undefined ) { // 3.0

			data.metadata.type = 'Geometry';

		}

		if ( data.metadata.version === undefined ) {

			data.metadata.version = data.metadata.formatVersion;

		}

		if ( data.metadata.type.toLowerCase() === 'geometry' ) {

			var loader = new THREE.JSONLoader();
			var result = loader.parse( data );

			var geometry = result.geometry;
			var material;

			if ( result.materials !== undefined ) {

				if ( result.materials.length > 1 ) {

					material = new THREE.MeshFaceMaterial( result.materials );

				} else {

					material = result.materials[ 0 ];

				}

			} else {

				material = new THREE.MeshPhongMaterial();

			}

			geometry.sourceType = "ascii";
			geometry.sourceFile = filename;

			var mesh = new THREE.Mesh( geometry, material );
			mesh.name = filename;
			mesh.castShadow = true;
			mesh.receiveShadow = true;

			scene.add( mesh );
			scene.select = mesh;

		} else if ( data.metadata.type.toLowerCase() === 'object' ) {

			var loader = new THREE.ObjectLoader();
			var result = loader.parse( data );

			if ( result instanceof THREE.Scene ) {

				scene.add( result );

			} else {

				scene.add( result );
				scene.select( result );

			}

		} else if ( data.metadata.type.toLowerCase() === 'scene' ) {

			// DEPRECATED

			var loader = new THREE.SceneLoader();
			loader.parse( data, function ( result ) {

				scne.add( result.scene );

			}, '' );

		}

	};
