// Initialisation de la scène, de la caméra et du rendu
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

// Définir la taille du rendu
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Créer un cube
const geometry = new THREE.BoxGeometry(1.5,1.5,1.5);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const mainCube = new THREE.Mesh(geometry, material);
scene.add(mainCube);


const jaune = "#eef907";
const orange = "#f9a807";
const rouge = "#f90707";
const vert = "#42f907";
const bleuVert = "#07f971";
const turquoise = "#07f9c6";
const bleu = "#0775f9";
const bleuFonce = "#0712f9";
const violet = "#8007f9";
const rose = "#f9079a";

// Variables des couleurs
const couleurs = [jaune, orange, rouge, vert, bleuVert, turquoise, bleu, bleuFonce, violet, rose];

// Fonction pour sélectionner aléatoirement une variable dans le tableau
function getRandomCouleur(arr) {
    var randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

// Listes de sphères et cubes
var spheres = [];
var cubes = [mainCube]

// Listes d'attente pour stocker les positions du cube principal
var positionQueue = [];

// Ajouter une lumière
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// Positionner la caméra
camera.position.z = 30;



// Variables pour stocker la vitesse et le vecteur du cube
// var velocity = new THREE.Vector2(0, 0);
var speed = 0; // Vitesse de déplacement du cube

// Variables de vitesse pour le mouvement
var speedX = 0;
var speedY = 0;
var speedZ = 0;
var vitesse = 0.05;

// Variables booléennes pour la vitesse

var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;

// Fonction pour créer une sphère à une position aléatoire dans la scène
function createSphere() {
    var geometry = new THREE.SphereGeometry(0.5, 32, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    var sphere = new THREE.Mesh(geometry, material);
    
    // Position aléatoire
    sphere.position.x = Math.random() * 40 - 20; // Entre -20 et 20
    sphere.position.y = Math.random() * 40 - 20; // Entre -20 et 20
    sphere.position.z = 0; // À une certaine distance devant la caméra
    
    scene.add(sphere);
    spheres.push(sphere);
}

// Fonction pour créer un cube
function createCube() {
    var couleurCube = getRandomCouleur(couleurs);

    var newCubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    var newCubeMaterial = new THREE.MeshBasicMaterial({ color: couleurCube });
    var newCube = new THREE.Mesh(newCubeGeometry, newCubeMaterial);

    // var lastCube = cubes[cubes.length - 1];
    // newCube.position = lastCube.position.x -1;
    // positionQueue.push(lastCube.position);

    scene.add(newCube);
    cubes.push(newCube); // Ajouter le nouveau cube à la liste des cubes
    console.log("cube créée");
}

// Check si le cube touche une sphere
function checkCollision() {
    // Création hitbox cube
    var cubeBox = new THREE.Box3().setFromObject(mainCube);

    for (var i = 0; i < spheres.length; i++) {
        var sphere = spheres[i];
        // Création hitbox sphere
        var sphereBox = new THREE.Box3().setFromObject(sphere);
    
        // Vérifier si les boîtes englobantes se chevauchent
        if (cubeBox.intersectsBox(sphereBox)) {

            // Collision détectée, supprimer la sphère de la scène
            var collidedSphereUUID = sphere.uuid;

            // Comparaison de toutes les spheres avec celle en collision
            for (let u = 0; u < spheres.length; u++) {
                if (spheres[i].uuid === collidedSphereUUID) {
                    // Suppression de la sphère
                    scene.remove(spheres[i]);
                    spheres.splice(i, 1);
                    console.log("Sphere supprimée");

                    // AJOUTER DE LA VITESSE AU CUBE
                    vitesse += 0.005
                    console.log("vitesse ajoutée (0.005)");
                    
                    // AJOUTER UN AUTRE CUBE A LA CHAINE
                    createCube();
                }  
            }
            // scene.remove(spheres);
            // spheres.splice(1, 1);

            // Arrêter la vérification de collision
            renderer.setAnimationLoop(null);
        }
    } 
}

// Fonction pour mettre à jour les positions des cubes
function updateCubes() {
    // Appliquer de la vitesse au cube principal
    mainCube.position.x += speedX;
    mainCube.position.y += speedY;
    mainCube.position.z += speedZ;

    // Ajouter la position actuelle du cube principal à la file d'attente
    positionQueue.push(mainCube.position.clone());
    // positionQueue.push(cubes[i].position.clone());
    // var distance = Math.max(10, 1 / vitesse); // Ajuster la distance en fonction de la vitesse


    // console.log(positionQueue);

    // Mettre à jour les positions des autres cubes en fonction de la positionQueue
    for (var i = 1; i < cubes.length; i++) {
        // Distance de base entre les cubes
        var baseDistance = 31.5;

        // Ajuster la distance en fonction de la vitesse
        var distance = baseDistance / Math.max(1, vitesse * 20); 

        // Modifier la valeur de positionIndex pour modifier la distance à laquelle le cube se place par rapport au cube avant
        var positionIndex = positionQueue.length - 1 - Math.floor(i * distance);

        if (positionIndex >= 0) {
            cubes[i].position.copy(positionQueue[positionIndex]);
        }
    }
}


// Créer une sphère toutes les 2 secondes
setInterval(createSphere, 2000);

function onDocumentKeyDown(event) {
    animateInputs(event);
}

// Animation du cube avec inputs (moi)
document.addEventListener("keydown", animateInputs, false)

function animateInputs(event) {

    // velocity.set(0,0);

    var keycode = event.which;

    if (keycode == 37 && moveLeft == false ) { // Flèche gauche
        moveLeft = true;
        moveRight = true;
        speedY = 0;
        speedX -= vitesse;
        moveDown = false;
        moveUp = false;
    }
    if (keycode == 38 && moveUp == false) { // Flèche haut
        moveUp = true;
        moveDown = true;
        speedX = 0;
        speedY += vitesse;
        moveRight = false;
        moveLeft = false;
    }
    if (keycode == 39 && moveRight == false) { // Flèche droite
        moveRight = true;
        moveLeft = true;
        speedY = 0;
        speedX += vitesse;
        moveDown = false;
        moveUp = false;
    }
    if (keycode == 40 && moveDown == false) { // Flèche bas
        moveDown = true;
        moveUp = true;
        speedX = 0;
        speedY -= vitesse;
        moveLeft = false;
        moveRight = false;
    }
    if (keycode == 83) {
        speedX = 0;
        speedY = 0;
    }
}

// Fonction d'animation
function animate() {
    requestAnimationFrame(animate);

    // check des collision
    checkCollision();

    updateCubes();

    renderer.render(scene, camera);
}

animate();


// Gérer le redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});


// Charger la texture de l'image de fond
// var textureLoader = new THREE.TextureLoader();
// textureLoader.load(
//     'img/papiers-peints-damier-vert.jpg',  // Chemin relatif
//     function(texture) {
//         console.log('Texture chargée avec succès');
//         // Définir l'image chargée comme arrière-plan de la scène
//         scene.background = texture;
//     },
//     undefined,
//     function(error) {
//         console.error('Erreur lors du chargement de la texture:', error);
//     }
// );


// Appliquer la vélocité au cube
// cube.rotation.x += velocity.y;
// cube.rotation.y += velocity.x;

// Changer la rotation de la caméra
//camera.rotation.x = Math.PI / 4; // Rotation de -45 degrés autour de l'axe X
//camera.rotation.y = Math.PI / 4;  // Rotation de 45 degrés autour de l'axe Y